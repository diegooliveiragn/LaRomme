import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-8200222016080718-092510-00543ef160f32881f08966dee98aa8ee-3717076176',
  options: { timeout: 8000 }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payment = new Payment(client);

    // Sanitização e fallback de CPF válido para testes (Algoritmo Mod11 aprovado pelo BC)
    const rawCpf = body.payer?.identification?.number || '22880752042';
    const cleanCpf = rawCpf.replace(/\D/g, '') || '22880752042';

    const requestOptions = {
      body: {
        transaction_amount: Number(body.transactionAmount || body.transaction_amount || 320),
        description: body.description || 'LaRomme - Coleção Origo',
        payment_method_id: body.paymentMethodId || body.payment_method_id || 'pix',
        token: body.token,
        installments: body.installments ? Number(body.installments) : 1,
        payer: {
          email: body.payer?.email || 'cliente@laromme.com',
          first_name: body.payer?.firstName || 'Cliente',
          last_name: body.payer?.lastName || 'VIP',
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
      details: error.message || error.cause || "Verifique as credenciais da adquirente."
    }, { status: 500 });
  }
}