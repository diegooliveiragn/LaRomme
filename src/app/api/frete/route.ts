import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { destinationCep, items } = await req.json();

    const token = process.env.MELHORENVIO_TOKEN;
    const originCep = process.env.MELHORENVIO_ORIGIN_CEP || '61770030';

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token do Melhor Envio não configurado.' }, { status: 500 });
    }

    const cleanDestination = destinationCep.replace(/\D/g, '');
    if (cleanDestination.length !== 8) {
      return NextResponse.json({ success: false, error: 'CEP de destino inválido.' }, { status: 400 });
    }

    // Mapeamento dos produtos enviando a caixa padrão por item
    const productsPayload = items.map((item: any) => ({
      id: item.productId || 'bone-laromme',
      width: 20,
      height: 15,
      length: 20,
      weight: 0.3,
      insurance_value: item.priceNumeric || 100,
      quantity: item.quantity || 1,
    }));

    const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'LaRomme (suporte@laromme.com.br)',
      },
      body: JSON.stringify({
        from: { postal_code: originCep },
        to: { postal_code: cleanDestination },
        products: productsPayload,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API do Melhor Envio:', errorData);
      return NextResponse.json({ success: false, error: 'Falha ao consultar frete junto ao Melhor Envio.' }, { status: 400 });
    }

    const optionsData = await response.json();

    // Filtra serviços com erro e formata as opções válidas
    const validOptions = optionsData
      .filter((option: any) => !option.error && option.price)
      .map((option: any) => ({
        id: option.id,
        name: option.name,
        company: option.company?.name || 'Transportadora',
        picture: option.company?.picture || '',
        price: parseFloat(option.custom_price || option.price),
        deliveryTime: option.custom_delivery_time || option.delivery_time,
      }));

    return NextResponse.json({
      success: true,
      options: validOptions,
    });

  } catch (error: any) {
    console.error('Erro interno na rota de frete:', error);
    return NextResponse.json({ success: false, error: 'Erro ao calcular frete.' }, { status: 500 });
  }
}