import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { fullName, email, cpf, totalAmount, orderNumber, customerId, state } = await request.json();

    let qrCodeCopiaECola = "00020126580014BR.GOV.BCB.PIX0136laromme-pix-chave-aleatoria-mock5204000053039865405320.005802BR5915LaRomme%20Brand6009Sao%20Paulo62070503***6304E2D1";
    
    // INTEGRAÇÃO REAL MERCADO PAGO (Ativada se a variável de ambiente existir)
    if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          transaction_amount: totalAmount,
          description: 'LaRomme - Coleção Origo',
          payment_method_id: 'pix',
          payer: { email, first_name: fullName, identification: { type: 'CPF', number: cpf.replace(/\D/g, '') } },
          external_reference: orderNumber
        })
      });
      const mpData = await mpResponse.json();
      if (mpData.point_of_interaction?.transaction_data) {
         qrCodeCopiaECola = mpData.point_of_interaction.transaction_data.qr_code;
      }
    }

    // REGISTRA O PEDIDO NO SUPABASE COMO "PENDENTE"
    const netProfit = totalAmount - 60.00 - 10.50 - (totalAmount * 0.06) - (totalAmount * 0.04);
    
    await supabase.from('orders').insert([{
      order_number: orderNumber,
      customer_id: customerId,
      total_amount: totalAmount,
      net_profit: netProfit,
      payment_method: 'PIX',
      payment_status: 'PENDENTE',
      delivery_state: state || 'SP'
    }]);

    return NextResponse.json({ success: true, pixCopiaECola: qrCodeCopiaECola });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}