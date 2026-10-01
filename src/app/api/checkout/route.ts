import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, payer, address, paymentMethod, subtotal, shippingCost = 0, shippingService = 'Frete Padrão', cardData } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return NextResponse.json({ success: false, error: 'Credenciais do MP ausentes.' }, { status: 500 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ success: false, error: 'Banco inacessível.' }, { status: 500 });

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const cleanCpf = payer.cpf ? payer.cpf.replace(/\D/g, '') : '';
    const cleanPhone = payer.phone ? payer.phone.replace(/\D/g, '') : '';
    const cleanCep = address.cep ? address.cep.replace(/\D/g, '') : '';
    const totalAmount = parseFloat((subtotal + shippingCost).toFixed(2));

    let paymentPayload: any = {
      transaction_amount: totalAmount,
      description: `Pedido LaRomme (${shippingService})`,
      payer: {
        email: payer.email,
        first_name: payer.fullName ? payer.fullName.split(' ')[0] : 'Cliente',
        last_name: payer.fullName && payer.fullName.includes(' ') ? payer.fullName.split(' ').slice(1).join(' ') : 'LaRomme',
        identification: { type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF', number: cleanCpf },
        address: { zip_code: cleanCep, street_name: address.street, street_number: address.number, neighborhood: address.neighborhood, city: address.city, federal_unit: address.state },
      },
      notification_url: 'https://www.laromme.com.br/api/webhooks/mercadopago',
    };

    if (paymentMethod === 'pix') {
      paymentPayload.payment_method_id = 'pix';
    } else if (paymentMethod === 'card' && cardData) {
      paymentPayload.token = cardData.token;
      paymentPayload.installments = cardData.installments;
      paymentPayload.payment_method_id = cardData.payment_method_id;
      paymentPayload.issuer_id = cardData.issuer_id;
      if (cardData.payer && cardData.payer.email) paymentPayload.payer.email = cardData.payer.email;
    } else {
        return NextResponse.json({ success: false, error: 'Método inválido.' }, { status: 400 });
    }

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `laromme-pay-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const mpData = await mpResponse.json();
    if (!mpResponse.ok) return NextResponse.json({ success: false, error: mpData.message || 'Pagamento recusado.' }, { status: 400 });

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: payer.fullName,
        customer_email: payer.email,
        customer_cpf: cleanCpf,
        customer_phone: cleanPhone,
        shipping_cep: cleanCep,
        shipping_street: address.street,
        shipping_number: address.number,
        shipping_neighborhood: address.neighborhood,
        shipping_city: address.city,
        shipping_state: address.state,
        payment_method: paymentMethod,
        mp_payment_id: mpData.id.toString(),
        subtotal: totalAmount,
        status: mpData.status || 'pending'
      })
      .select('id, short_id')
      .single();

    if (orderError || !orderData) return NextResponse.json({ success: false, error: 'Erro ao salvar pedido.' }, { status: 500 });

    const orderItemsPayload = items.map((item: any) => ({
        order_id: orderData.id,
        product_name: item.name,
        product_size: item.size,
        product_color: item.colorName,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.priceNumeric
    }));
    await supabase.from('order_items').insert(orderItemsPayload);

    let qrCode = null, qrCodeBase64 = null, ticketUrl = null;
    if (paymentMethod === 'pix' && mpData.point_of_interaction?.transaction_data) {
      qrCode = mpData.point_of_interaction.transaction_data.qr_code;
      qrCodeBase64 = mpData.point_of_interaction.transaction_data.qr_code_base64;
      ticketUrl = mpData.point_of_interaction.transaction_data.ticket_url;
    }

    const isApproved = mpData.status === 'approved';
    const orderLink = `https://www.laromme.com.br/pedido/${orderData.id}`;
    
    const emailHtml = `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000; background-color: #fff;">
        <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">LaRomme</h1>
        </div>
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Olá, ${payer.fullName.split(' ')[0]}.</p>
        <p style="font-size: 14px; line-height: 1.6;">O seu pedido <strong>#${orderData.short_id}</strong> foi registrado no nosso ecossistema.</p>
        
        ${isApproved ? `
          <div style="background-color: #000; color: #fff; padding: 15px; text-align: center; margin: 30px 0; font-weight: bold; letter-spacing: 2px;">
            PAGAMENTO APROVADO
          </div>
          <p style="font-size: 14px; line-height: 1.6;">Os nossos artesãos já iniciaram o processo de separação e embalagem.</p>
        ` : `
          <div style="border: 1px solid #000; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="margin-top: 0; font-weight: bold; letter-spacing: 2px;">AGUARDANDO PAGAMENTO PIX</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">Copie o código abaixo e pague no app do seu banco:</p>
            <div style="background-color: #f4f4f4; padding: 10px; word-break: break-all; font-size: 11px;">
              ${qrCode || 'Código Pix indisponível.'}
            </div>
          </div>
        `}

        <div style="margin: 40px 0; text-align: center;">
          <a href="${orderLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
            Acompanhar Encomenda
          </a>
        </div>
      </div>
    `;

    // INICIALIZAÇÃO SEGURA DO RESEND AQUI DENTRO (Evita erro de compilação)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        resend.emails.send({
          from: 'LaRomme <pedidos@laromme.com.br>',
          to: payer.email,
          subject: isApproved ? `Pagamento Aprovado - Pedido #${orderData.short_id}` : `Aguardando Pagamento - Pedido #${orderData.short_id}`,
          html: emailHtml,
        }).catch(err => console.error('Erro Resend:', err));
    }

    return NextResponse.json({
      success: true,
      orderUuid: orderData.id,
      orderShortId: orderData.short_id,
      status: mpData.status,
      paymentMethod,
      pixDetails: paymentMethod === 'pix' ? { qrCode, qrCodeBase64, ticketUrl } : null,
    });

  } catch (error: any) {
    console.error('Exceção capturada na API:', error);
    return NextResponse.json({ success: false, error: 'Erro de comunicação.' }, { status: 500 });
  }
}