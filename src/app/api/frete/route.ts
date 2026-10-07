import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { destinationCep, items } = await req.json();

    const token = process.env.MELHORENVIO_TOKEN;
    const originCep = process.env.MELHORENVIO_ORIGIN_CEP || '61770030';

    const cleanDestination = (destinationCep || '').replace(/\D/g, '');
    if (cleanDestination.length !== 8) {
      return NextResponse.json({ success: false, error: 'CEP de destino inválido.' }, { status: 400 });
    }

    const validOptions: any[] = [];

    // Checa se o CEP pertence a Fortaleza ou Região Metropolitana (CEPs iniciando em 60 ou 61)
    const isFortalezaRMF = /^60\d{6}$\vert{}^61[6-9]\d{5}$/.test(cleanDestination);

    if (isFortalezaRMF) {
      validOptions.push({
        id: 'motoboy-fortaleza',
        name: 'Entrega Expressa (Motoboy Direct)',
        company: 'LaRomme Courier',
        picture: '',
        price: 15.00, // Valor fixo de entrega via Motoboy
        deliveryTime: 1,
      });
    }

    // Consulta cotação nacional via MelhorEnvio
    if (token) {
      const productsPayload = (items || []).map((item: any) => ({
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
          Authorization: `Bearer ${token}`,
          'User-Agent': 'LaRomme (suporte@laromme.com.br)',
        },
        body: JSON.stringify({
          from: { postal_code: originCep },
          to: { postal_code: cleanDestination },
          products: productsPayload,
        }),
      });

      if (response.ok) {
        const optionsData = await response.json();
        const meOptions = optionsData
          .filter((option: any) => !option.error && option.price)
          .map((option: any) => ({
            id: String(option.id),
            name: option.name,
            company: option.company?.name || 'Transportadora',
            picture: option.company?.picture || '',
            price: parseFloat(option.custom_price || option.price),
            deliveryTime: option.custom_delivery_time || option.delivery_time,
          }));

        validOptions.push(...meOptions);
      }
    }

    return NextResponse.json({
      success: true,
      options: validOptions,
    });

  } catch (error: any) {
    console.error('Erro interno na rota de frete:', error);
    return NextResponse.json({ success: false, error: 'Erro ao calcular frete.' }, { status: 500 });
  }
}