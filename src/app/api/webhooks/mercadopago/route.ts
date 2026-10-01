import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ekljqqdhrltlydomfeua.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_for_build';

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    // Notificação do Mercado Pago
    if (body.type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = body.data?.id || body.id;

      if (paymentId) {
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
        });

        if (mpResponse.ok) {
          const paymentData = await mpResponse.json();
          
          // Atualiza o status do pedido no Supabase se houver tabela 'orders'
          await supabase
            .from('orders')
            .update({
              status: paymentData.status,
              updated_at: new Date().toISOString(),
            })
            .eq('mp_payment_id', paymentId.toString());
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no processamento do Webhook:', error);
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}