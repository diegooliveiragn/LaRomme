import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, payer, address, paymentMethod, subtotal } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Credenciais do Mercado Pago não encontradas no servidor.' }, { status: 500 });
    }

    const cleanCpf = payer.cpf ? payer.cpf.replace(/\D/g, '') : '';
    const cleanPhone = payer.phone ? payer.phone.replace(/\D/g, '') : '';

    const paymentPayload: any = {
      transaction_amount: subtotal,
      description: `Pedido LaRomme - Drop 01: ORIGO`,
      payment_method_id: paymentMethod === 'pix' ? 'pix' : 'master',
      payer: {
        email: payer.email,
        first_name: payer.fullName ? payer.fullName.split(' ')[0] : 'Cliente',
        last_name: payer.fullName ? payer.fullName.split(' ').slice(1).join(' ') || 'LaRomme' : 'LaRomme',
        identification: {
          type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
          number: cleanCpf,
        },
        address: {
          zip_code: address.cep ? address.cep.replace(/\D/g, '') : '',
          street_name: address.street,
          street_number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          federal_unit: address.state,
        },
      },
      notification_url: 'https://www.laromme.com.br/api/webhooks/mercadopago',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `laromme-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Erro na API do Mercado Pago:', mpData);
      return NextResponse.json({ 
        success: false, 
        error: mpData.message || 'Erro ao processar transação junto ao Mercado Pago.' 
      }, { status: 400 });
    }

    let qrCode = null;
    let qrCodeBase64 = null;
    let ticketUrl = null;

    if (mpData.point_of_interaction?.transaction_data) {
      qrCode = mpData.point_of_interaction.transaction_data.qr_code;
      qrCodeBase64 = mpData.point_of_interaction.transaction_data.qr_code_base64;
      ticketUrl = mpData.point_of_interaction.transaction_data.ticket_url;
    }

    return NextResponse.json({
      success: true,
      orderId: mpData.id,
      status: mpData.status,
      paymentMethod,
      pixDetails: paymentMethod === 'pix' ? {
        qrCode,
        qrCodeBase64,
        ticketUrl,
      } : null,
    });

  } catch (error: any) {
    console.error('Erro interno na API de checkout:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.' }, { status: 500 });
  }
}