import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentApprovedEmail } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (id && process.env.MERCADOPAGO_ACCESS_TOKEN) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
      });
      const mpData = await mpRes.json();

      if (mpData.status === 'approved') {
        const orderNumber = mpData.external_reference;
        const { data: order } = await supabase.from('orders').select('*').eq('order_number', orderNumber).single();
        
        if (order && order.payment_status === 'PENDENTE') {
          await supabase.from('orders').update({ payment_status: 'PAGO' }).eq('id', order.id);
          
          const { data: prod } = await supabase.from('products').select('id, stock').eq('sku_code', 'BOXY-BLK-M').single();
          if (prod && prod.stock > 0) {
            await supabase.from('products').update({ stock: prod.stock - 1 }).eq('id', prod.id);
          }

          const serialCode = `LR-D00-BOXY-${Math.floor(1000 + Math.random() * 9000)}`;
          await supabase.from('serialized_items').insert([{
            serial_code: serialCode,
            customer_id: order.customer_id,
            order_id: order.id,
            size: 'M'
          }]);

          const { data: customer } = await supabase.from('customers').select('email, full_name').eq('id', order.customer_id).single();

          if (customer) {
            await sendPaymentApprovedEmail(customer.email, customer.full_name, orderNumber, serialCode);
          }
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no Webhook' }, { status: 500 });
  }
}