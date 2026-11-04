function toTitleCasePt(name: string): string {
  if (!name) return 'Patrono';
  const particles = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => (i > 0 && particles.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

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
    const { items, payer, shippingCost, paymentMethod = 'pix', walletToken, walletPaymentMethodId, installments = 1 } = body;
    const address = body.address || body.shippingAddress || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Sacola vazia.' }, { status: 400 });
    }

    // 1. CHECAGEM RÍGIDA DE ESTOQUE
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

    const numericShortId = Math.floor(100000 + Math.random() * 900000);
    const orderShortId = `LR-${numericShortId}`;
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    let paymentId: string | number | null = null;
    let paymentStatus: string = 'pending';
    let pixData = null;

    // 3. INTEGRAÇÃO MERCADO PAGO (PIX OU CARTEIRA DIGITAL / CARTÃO)
    if (mpAccessToken) {
      const cleanCpf = (payer.cpf || '').replace(/\D/g, '');
      const payerFirstName = toTitleCasePt(payer.name || payer.fullName || 'Patrono').split(' ')[0] || 'Patrono';
      const payerLastName = toTitleCasePt(payer.name || payer.fullName || 'LaRomme').split(' ').slice(1).join(' ') || 'LaRomme';

      const mpPayload: any = {
        transaction_amount: Number(totalAmount.toFixed(2)),
        description: `LaRomme - Pedido ${orderShortId}`,
        external_reference: String(numericShortId),
        payer: {
          email: payer.email.trim().toLowerCase(),
          first_name: payerFirstName,
          last_name: payerLastName,
          identification: {
            type: cleanCpf.length > 11 ? 'CNPJ' : 'CPF',
            number: cleanCpf || '00000000000',
          },
        },
      };

      if (paymentMethod === 'wallet' && walletToken) {
        // Fluxo Apple Pay / Google Pay / Token de Cartão
        mpPayload.token = walletToken;
        mpPayload.payment_method_id = walletPaymentMethodId || 'credit_card';
        mpPayload.installments = Number(installments) || 1;
      } else {
        // Fluxo Padrão Pix
        mpPayload.payment_method_id = 'pix';
      }

      const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpAccessToken}`,
          'X-Idempotency-Key': orderShortId,
        },
        body: JSON.stringify(mpPayload),
      });

      const mpData = await mpResponse.json();

      if (mpData.id) {
        paymentId = mpData.id;
        paymentStatus = mpData.status === 'approved' ? 'approved' : 'pending';

        if (paymentMethod === 'pix') {
          pixData = {
            paymentId: mpData.id,
            qrCode: mpData.point_of_interaction?.transaction_data?.qr_code,
            qrCodeBase64: mpData.point_of_interaction?.transaction_data?.qr_code_base64,
            ticketUrl: mpData.point_of_interaction?.transaction_data?.ticket_url,
          };
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: mpData.message || 'Falha ao autorizar pagamento no Mercado Pago.' 
        }, { status: 400 });
      }
    }

    // 4. PERSISTÊNCIA DO PEDIDO NO BANCO
    const orderPayload = {
      short_id: numericShortId,
      mp_payment_id: paymentId ? String(paymentId) : null,
      status: paymentStatus,
      total_amount: totalAmount,
      subtotal: calculatedSubtotal,
      shipping_cost: safeShippingCost,
      payment_method: paymentMethod,
      customer_name: toTitleCasePt(payer.fullName || payer.name || 'Patrono'),
      customer_email: payer.email.trim().toLowerCase(),
      customer_cpf: payer.cpf ? payer.cpf.replace(/\D/g, '') : '',
      customer_phone: payer.phone ? payer.phone.replace(/\D/g, '') : '',
      shipping_cep: address.cep ? address.cep.replace(/\D/g, '') : '',
      shipping_street: address.street || '',
      shipping_number: address.number || '',
      shipping_neighborhood: address.neighborhood || '',
      shipping_city: address.city || '',
      shipping_state: address.state || '',
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: `Supabase: ${orderError.message}` }, { status: 500 });
    }

    // 5. SALVA OS ITENS E ATUALIZA RESERVA DE ESTOQUE
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_size: item.size,
      product_color: item.colorName || 'Padrão',
      product_image: item.image || '',
      unit_price: Number(item.priceNumeric) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    await supabase.from('order_items').insert(orderItems);

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
            stock_available: Math.max(0, currentVariant.stock_available - item.quantity),
            stock_reserved: (currentVariant.stock_reserved || 0) + item.quantity,
          })
          .eq('product_id', item.id)
          .eq('size', item.size);
      }
    }

    return NextResponse.json({
      success: true,
      orderUuid: order.id,
      orderShortId: order.short_id,
      paymentId: paymentId,
      status: paymentStatus,
      pix: pixData,
      qrCode: pixData?.qrCode,
      qrCodeBase64: pixData?.qrCodeBase64,
      ticketUrl: pixData?.ticketUrl,
      totalAmount: totalAmount,
    });
  } catch (err: any) {
    console.error('Erro na rota de checkout:', err);
    return NextResponse.json({ success: false, error: err.message || 'Erro interno no servidor.' }, { status: 500 });
  }
}