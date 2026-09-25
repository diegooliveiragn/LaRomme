import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Configurando o SDK do MP com o token seguro do servidor
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '', 
  options: { timeout: 5000, idempotencyKey: crypto.randomUUID() } 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Recebendo pedido de pagamento:", body.paymentMethodId);

    const payment = new Payment(client);
    
    // Dados obrigatórios para criação da transação
    const requestOptions = {
      body: {
        transaction_amount: body.transactionAmount,
        description: body.description || 'LaRomme - Coleção Origo',
        payment_method_id: body.paymentMethodId,
        payer: {
          email: body.payer.email,
          first_name: body.payer.firstName,
          last_name: body.payer.lastName,
          identification: {
            type: body.payer.identification.type,
            number: body.payer.identification.number
          }
        },
      }
    };

    // Cria a transação na API do Mercado Pago
    const result = await payment.create(requestOptions);
    
    console.log("Status do Pagamento:", result.status);

    // Retorna a aprovação, o código PIX copia e cola, ou os erros.
    return NextResponse.json({
      id: result.id,
      status: result.status,
      detail: result.status_detail,
      qr_code: result.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error: any) {
    console.error("Erro na API de Checkout:", error);
    return NextResponse.json({ 
      error: "Falha na comunicação com o adquirente.", 
      details: error.message 
    }, { status: 500 });
  }
}