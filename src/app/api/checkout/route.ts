import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, payer, address, shippingCost } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Sacola vazia.' }, { status: 400 });
    }

    // 1. CHECAGEM RÍGIDA DE ESTOQUE (Se 2 pessoas clicarem juntas, só 1 passa)
    for (const item of items) {
      const { data: variant } = await supabase
        .from('inventory_variants')
        .select('stock_available')
        .eq('product_id', item.id)
        .eq('size', item.size)
        .single();

      if (!variant || (variant.stock_available ?? 0) < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Sinto muito. Alguém foi mais rápido e o item "${item.name}" (${item.size}) esgotou.` },
          { status: 400 }
        );
      }
    }

    // 2. CÁLCULO FINANCEIRO
    const calculatedSubtotal = items.reduce((acc: number, item: any) => {
      let price = item.priceNumeric;
      if (!price && item.priceString) {
        price = parseFloat(item.priceString.replace(/[^\d,-]/g, '').replace(',', '.'));
      }
      if (!price && item.price) {
        price = parseFloat(String(item.price).replace(/[^\d,-]/g, '').replace(',', '.'));
      }
      const unitPrice = Number(price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + unitPrice * qty;
    }, 0);

    const safeShippingCost = Number(shippingCost) || 0;
    const totalAmount = calculatedSubtotal + safeShippingCost;

    if (totalAmount <= 0) {
      return NextResponse.json({ success: false, error: 'O valor total do pedido precisa ser maior que zero.' }, { status: 400 });
    }

    const orderShortId = `LR-${Math.floor(100000 + Math.random() * 900000)}`;
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    let pixData = null;

    // 3. GERAÇÃO DO PIX NO MERCADO PAGO
    if (mpAccessToken) {
      const cleanCpf = (payer.cpf || '').replace(/\D/g, '');
      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpAccessToken}`,
          'X-Idempotency-Key': orderShortId,
        },
        body: JSON.stringify({
          transaction_amount: Number(totalAmount.toFixed(2)),
          description: `LaRomme - Pedido ${orderShortId}`,
          payment_method_id: 'pix',
          payer: {
            email: payer.email.trim().toLowerCase(),
            first_name: payer.fullName.split(' ')[0] || 'Patrono',
            last_name: payer.fullName.split(' ').slice(1).join(' ') || 'LaRomme',
            identification: {
              type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
              number: cleanCpf || '00000000000',
            },
          },
        }),
      });

      const mpData = await mpResponse.json();

      if (mpData.id) {
        pixData = {
          paymentId: mpData.id,
          qrCode: mpData.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64: mpData.point_of_interaction?.transaction_data?.qr_code_base64,
          ticketUrl: mpData.point_of_interaction?.transaction_data?.ticket_url,
        };
      } else {
        return NextResponse.json({ success: false, error: mpData.message || 'Falha ao gerar Pix no Mercado Pago.' }, { status: 400 });
      }
    }

    // 4. SALVA O PEDIDO NO BANCO
    const orderPayload = {
      short_id: orderShortId,
      status: 'pending',
      total_amount: totalAmount,
      subtotal: calculatedSubtotal,
      shipping_cost: safeShippingCost,
      payment_method: 'pix',
      customer_name: payer.fullName,
      customer_email: payer.email.trim().toLowerCase(),
      customer_cpf: payer.cpf.replace(/\D/g, ''),
      customer_phone: payer.phone.replace(/\D/g, ''),
      shipping_cep: address.cep.replace(/\D/g, ''),
      shipping_street: address.street,
      shipping_number: address.number,
      shipping_neighborhood: address.neighborhood,
      shipping_city: address.city,
      shipping_state: address.state,
    };

    const { data: order, error: orderError } = await supabase.from('orders').insert([orderPayload]).select().single();

    if (orderError) {
      return NextResponse.json({ success: false, error: `Supabase: ${orderError.message}` }, { status: 500 });
    }

    // 5. SALVA OS ITENS E RESERVA O ESTOQUE FISICAMENTE
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_size: item.size,
      product_color: item.colorName,
      product_image: item.image,
      unit_price: item.priceNumeric || parseFloat(String(item.priceString || item.price).replace(/[^\d,-]/g, '').replace(',', '.')),
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    // MOVE O ESTOQUE DE "AVAILABLE" PARA "RESERVED"
    for (const item of items) {
      const { data: currentVariant } = await supabase
        .from('inventory_variants')
        .select('stock_available, stock_reserved')
        .eq('product_id', item.id)
        .eq('size', item.size)
        .single();

      if (currentVariant) {
        await supabase
          .from('inventory_variants')
          .update({
            stock_available: currentVariant.stock_available - item.quantity,
            stock_reserved: currentVariant.stock_reserved + item.quantity
          })
          .eq('product_id', item.id)
          .eq('size', item.size);
      }
    }

    return NextResponse.json({
      success: true,
      orderUuid: order.id,
      orderShortId: order.short_id,
      pix: pixData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: `Erro Crítico: ${err.message}` }, { status: 500 });
  }
}