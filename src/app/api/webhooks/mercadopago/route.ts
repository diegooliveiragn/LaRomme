import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    // Tenta capturar o ID do pagamento enviado pelo Mercado Pago
    const paymentId = body.data?.id || body.id || url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!paymentId) {
      return NextResponse.json({ status: 'ignored', reason: 'No payment ID provided' }, { status: 200 });
    }

    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      console.error('[WEBHOOK] MERCADOPAGO_ACCESS_TOKEN não configurado.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Consulta os detalhes reais da transação diretamente na API do Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
      },
    });

    if (!mpResponse.ok) {
      console.error(`[WEBHOOK] Erro ao consultar pagamento MP (${paymentId}):`, mpResponse.statusText);
      return NextResponse.json({ status: 'error', reason: 'Failed to fetch MP payment' }, { status: 200 });
    }

    const paymentData = await mpResponse.json();
    const status = paymentData.status; // 'approved', 'pending', etc.
    const externalReference = paymentData.external_reference; // ID do pedido no Supabase

    if (!externalReference) {
      return NextResponse.json({ status: 'ignored', reason: 'No external_reference found' }, { status: 200 });
    }

    // SE O PAGAMENTO FOI APROVADO COM SUCESSO:
    if (status === 'approved') {
      // 1. Busca os dados do pedido no Supabase
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', externalReference)
        .single();

      if (orderErr || !order) {
        console.error('[WEBHOOK] Pedido não encontrado no banco:', externalReference);
        return NextResponse.json({ status: 'order_not_found' }, { status: 200 });
      }

      // Se já estiver pago, ignora para evitar duplicação
      if (order.status === 'paid') {
        return NextResponse.json({ status: 'already_processed' }, { status: 200 });
      }

      const feeDetails = paymentData.fee_details || [];
      const gatewayFee = feeDetails.reduce((sum: number, fee: any) => sum + Number(fee.amount || 0), 0);
      const totalAmount = Number(order.total_amount || order.subtotal || 0);
      const netRevenue = totalAmount - gatewayFee;

      // 2. Atualiza o Pedido para 'paid' e grava os valores financeiros
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          gateway_fee: gatewayFee,
          net_revenue: netRevenue,
        })
        .eq('id', externalReference);

      // 3. AUTOMATISMO DE CRM: Cadastra ou Atualiza a ficha do Patrono em `customers`
      if (order.customer_email) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', order.customer_email)
          .maybeSingle();

        if (!existingCustomer) {
          await supabase.from('customers').insert([
            {
              email: order.customer_email,
              full_name: order.customer_name || 'Patrono',
              phone: order.customer_phone || null,
              default_address: order.shipping_address || null,
            },
          ]);
        } else {
          await supabase
            .from('customers')
            .update({
              full_name: order.customer_name || 'Patrono',
              phone: order.customer_phone || null,
              default_address: order.shipping_address || null,
            })
            .eq('id', existingCustomer.id);
        }
      }

      // 4. AUTOMATISMO DE WMS: Liquidação de Estoque Físico e Reservado
      const items = order.items || [];
      for (const item of items) {
        // Tenta localizar a variante correspondente pelo SKU ou ID do produto
        const { data: variant } = await supabase
          .from('inventory_variants')
          .select('*')
          .eq('product_id', item.productId || item.id)
          .eq('size', item.size || 'UNICO')
          .maybeSingle();

        if (variant) {
          const qty = Number(item.quantity || 1);
          const newPhysical = Math.max(0, (variant.stock_physical || 0) - qty);
          const newReserved = Math.max(0, (variant.stock_reserved || 0) - qty);
          const newAvailable = Math.max(0, newPhysical - newReserved);

          // Atualiza os saldos reais no WMS
          await supabase
            .from('inventory_variants')
            .update({
              stock_physical: newPhysical,
              stock_reserved: newReserved,
              stock_available: newAvailable,
            })
            .eq('id', variant.id);

          // Lança o log de auditoria no Livro Razão de Estoque
          await supabase.from('inventory_movements').insert([
            {
              variant_id: variant.id,
              movement_type: 'SALE_DISPATCH',
              quantity: -qty,
              reference_id: order.id,
            },
          ]);
        }
      }

      console.log(`[CORTEX OS] Pedido #${order.short_id || order.id} processado com sucesso via Webhook!`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: any) {
    console.error('[WEBHOOK ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}