import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 8000 }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment = new Payment(client);

    const rawCpf = body.payer?.identification?.number || '';
    const cleanCpf = rawCpf.replace(/\D/g, '');

    const requestOptions = {
      body: {
        transaction_amount: 320.00, // <-- Restauração para o valor real da Boxy
        description: 'LaRomme - Coleção Origo',
        payment_method_id: body.paymentMethodId || body.payment_method_id || 'pix',
        token: body.token,
        installments: body.installments ? Number(body.installments) : 1,
        payer: {
          email: body.payer?.email || 'contato@laromme.com',
          first_name: body.payer?.firstName || 'Cliente',
          last_name: body.payer?.lastName || 'LaRomme',
          identification: {
            type: 'CPF',
            number: cleanCpf
          }
        }
      }
    };

    const result = await payment.create(requestOptions);

    return NextResponse.json({
      id: result.id,
      status: result.status,
      detail: result.status_detail,
      qr_code: result.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error: any) {
    console.error("Erro no Mercado Pago:", error);
    return NextResponse.json({
      error: "Falha no processamento.",
      details: error.message || error.cause || "Erro de conexão."
    }, { status: 500 });
  }
}