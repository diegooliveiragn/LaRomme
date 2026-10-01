import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, payer, address, paymentMethod, subtotal } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Credenciais do Mercado Pago não configuradas.' }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
       console.error("Supabase keys missing in environment");
       return NextResponse.json({ success: false, error: 'Banco de dados inacessível.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    });

    const cleanCpf = payer.cpf ? payer.cpf.replace(/\D/g, '') : '';
    const cleanPhone = payer.phone ? payer.phone.replace(/\D/g, '') : '';
    const cleanCep = address.cep ? address.cep.replace(/\D/g, '') : '';

    // 1. CHAMA O MERCADO PAGO PRIMEIRO PARA GERAR O PIX/COBRANÇA
    const paymentPayload: any = {
      transaction_amount: subtotal,
      description: `Pedido LaRomme`,
      payment_method_id: paymentMethod === 'pix' ? 'pix' : 'master',
      payer: {
        email: payer.email,
        first_name: payer.fullName ? payer.fullName.split(' ')[0] : 'Cliente',
        last_name: payer.fullName && payer.fullName.includes(' ') ? payer.fullName.split(' ').slice(1).join(' ') : 'LaRomme',
        identification: {
          type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
          number: cleanCpf,
        },
        address: {
          zip_code: cleanCep,
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
        'X-Idempotency-Key': `laromme-pay-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Mercado Pago falhou:', mpData);
      return NextResponse.json({ 
        success: false, 
        error: mpData.message || 'Erro ao processar transação financeira.' 
      }, { status: 400 });
    }

    // 2. INSERE O PEDIDO NO SUPABASE (Tabela: orders)
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
        subtotal: subtotal,
        status: mpData.status || 'pending'
      })
      .select('id, short_id')
      .single();

    if (orderError || !orderData) {
      console.error('Erro ao salvar pedido no Supabase:', orderError);
      return NextResponse.json({ success: false, error: 'Ocorreu um erro interno ao registrar a encomenda.' }, { status: 500 });
    }

    // 3. INSERE OS ITENS DO PEDIDO (Tabela: order_items)
    const orderItemsPayload = items.map((item: any) => ({
        order_id: orderData.id,
        product_name: item.name,
        product_size: item.size,
        product_color: item.colorName,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.priceNumeric
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
    
    if (itemsError) {
        console.error('Erro ao salvar os itens no Supabase:', itemsError);
    }

    let qrCode = null;
    let qrCodeBase64 = null;
    let ticketUrl = null;

    if (mpData.point_of_interaction?.transaction_data) {
      qrCode = mpData.point_of_interaction.transaction_data.qr_code;
      qrCodeBase64 = mpData.point_of_interaction.transaction_data.qr_code_base64;
      ticketUrl = mpData.point_of_interaction.transaction_data.ticket_url;
    }

    // 4. RETORNA O SUCESSO, O ID DA PÁGINA DE RASTREIO E OS DADOS DO PIX
    return NextResponse.json({
      success: true,
      orderUuid: orderData.id,
      orderShortId: orderData.short_id,
      status: mpData.status,
      paymentMethod,
      pixDetails: paymentMethod === 'pix' ? {
        qrCode,
        qrCodeBase64,
        ticketUrl,
      } : null,
    });

  } catch (error: any) {
    console.error('Exceção capturada na API:', error);
    return NextResponse.json({ success: false, error: 'Erro de comunicação interna.' }, { status: 500 });
  }
}