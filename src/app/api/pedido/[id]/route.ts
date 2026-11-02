export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'ID do pedido obrigatório.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Configuração ausente.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // 1. Busca pedido no Supabase
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Pedido não encontrado.' }, { status: 404 });
    }

    // 2. Fallback Ativo: Se ainda estiver pending, consulta o Mercado Pago
    if (order.status === 'pending' && mpAccessToken) {
      try {
        const searchRes = await fetch(
          `https://api.mercadopago.com/v1/payments/search?external_reference=${order.short_id}&sort=date_created&criteria=desc`,
          { headers: { Authorization: `Bearer ${mpAccessToken}` } }
        );

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const approvedPayment = searchData.results?.find((p: any) => p.status === 'approved');

          if (approvedPayment) {
            await supabase
              .from('orders')
              .update({
                status: 'approved',
                mp_payment_id: String(approvedPayment.id),
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            order.status = 'approved';
            order.mp_payment_id = String(approvedPayment.id);
          }
        }
      } catch (mpErr) {
        console.error('Falha no fallback ativo MP:', mpErr);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Erro na rota /api/pedido:', error);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}