import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // ID do pagamento enviado pelo Mercado Pago
    const paymentId = body?.data?.id || url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ status: 'ignored', message: 'No payment ID provided' }, { status: 200 });
    }

    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      return NextResponse.json({ error: 'Mercado Pago token missing' }, { status: 500 });
    }

    // Consulta detalhes do pagamento diretamente no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpAccessToken}` },
    });

    if (!mpRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch payment details' }, { status: 400 });
    }

    const paymentData = await mpRes.json();
    const mpStatus = paymentData.status; // 'approved', 'cancelled', 'rejected', etc.
    const externalRef = paymentData.external_reference; // Contém o short_id ex: "LR-123456"

    // Busca o pedido correspondente no Supabase
    let query = supabase.from('orders').select('id, status, short_id');
    if (externalRef) {
      query = query.eq('short_id', externalRef);
    } else {
      query = query.eq('mp_payment_id', paymentId);
    }

    const { data: order } = await query.single();

    if (!order) {
      return NextResponse.json({ status: 'ignored', message: 'Order not found' }, { status: 200 });
    }

    // CENÁRIO 1: PIX PAGO COM SUCESSO (Status -> approved)
    if (mpStatus === 'approved' && order.status !== 'approved') {
      await supabase
        .from('orders')
        .update({ status: 'approved', mp_payment_id: String(paymentId), updated_at: new Date().toISOString() })
        .eq('id', order.id);

      // Confirma baixa no estoque reservado
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      if (items) {
        for (const item of items) {
          const { data: variant } = await supabase
            .from('inventory_variants')
            .select('stock_reserved, stock_physical')
            .eq('product_id', item.product_id)
            .eq('size', item.product_size)
            .single();

          if (variant) {
            await supabase
              .from('inventory_variants')
              .update({
                stock_reserved: Math.max(0, (variant.stock_reserved || 0) - item.quantity),
                stock_physical: Math.max(0, (variant.stock_physical || 0) - item.quantity),
              })
              .eq('product_id', item.product_id)
              .eq('size', item.product_size);
          }
        }
      }
    }

    // CENÁRIO 2: PIX EXPIRADO OU CANCELADO (Status -> cancelled / rejected)
    if ((mpStatus === 'cancelled' || mpStatus === 'rejected' || mpStatus === 'expired') && order.status === 'pending') {
      await supabase
        .from('orders')
        .update({ status: 'cancelled', mp_payment_id: String(paymentId), updated_at: new Date().toISOString() })
        .eq('id', order.id);

      // DEVOLVE AS PEÇAS PARA O ESTOQUE DISPONÍVEL
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      if (items) {
        for (const item of items) {
          const { data: variant } = await supabase
            .from('inventory_variants')
            .select('stock_available, stock_reserved')
            .eq('product_id', item.product_id)
            .eq('size', item.product_size)
            .single();

          if (variant) {
            await supabase
              .from('inventory_variants')
              .update({
                stock_reserved: Math.max(0, (variant.stock_reserved || 0) - item.quantity),
                stock_available: (variant.stock_available || 0) + item.quantity,
              })
              .eq('product_id', item.product_id)
              .eq('size', item.product_size);
          }
        }
      }
    }

    return NextResponse.json({ success: true, status: mpStatus }, { status: 200 });
  } catch (err: any) {
    console.error('Erro no Webhook:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}