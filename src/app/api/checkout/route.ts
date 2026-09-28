import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPixGeneratedEmail } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, cpf, totalAmount, orderNumber, customerId, state } = body;

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id: customerId,
        total_amount: totalAmount,
        payment_status: 'PENDENTE',
        delivery_state: state || 'CE'
      }])
      .select('id')
      .single();

    if (orderErr) throw orderErr;

    let pixCode = `00020126580014br.gov.bcb.pix0136${orderNumber}5204000053039865406${totalAmount.toFixed(2)}5802BR5908LAROMME6009FORTALEZA62070503***6304`;
    let qrCodeBase64 = '';

    if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
      try {
        const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': orderNumber
          },
          body: JSON.stringify({
            transaction_amount: Number(totalAmount),
            description: `Artefato LaRomme - Pedido ${orderNumber}`,
            payment_method_id: 'pix',
            payer: { email: email, first_name: fullName },
            external_reference: orderNumber
          })
        });

        const mpData = await mpRes.json();
        if (mpData.point_of_interaction?.transaction_data) {
          pixCode = mpData.point_of_interaction.transaction_data.qr_code;
          qrCodeBase64 = mpData.point_of_interaction.transaction_data.qr_code_base64;
        }
      } catch (e) {
        console.error('Erro na API Mercado Pago, usando fallback:', e);
      }
    }

    await sendPixGeneratedEmail(email, fullName, orderNumber, pixCode, totalAmount);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      pixCopiaECola: pixCode,
      qrCodeBase64
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}