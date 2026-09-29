import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extrai o ID do Pedido (suporta formato do Webhook MP real ou formato de Teste)
    const orderId = body.order_id || body.data?.id;
    const paymentStatus = body.payment_status || body.status || 'PAGO';

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Atualiza o pedido para PAGO na tabela 'orders' do Supabase
    // Isso dispara automaticamente o trigger PostgreSQL 'trigger_order_settlement'
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso. Liquidação autônoma ativada no PostgreSQL.',
      settled_order: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}