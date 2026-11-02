export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'ID do pedido obrigatório.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Configuração ausente.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // 1. Busca pedido no Supabase
    let { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Pedido não encontrado.' }, { status: 404 });
    }

    // 2. Fallback Ativo: Se ainda estiver pending, consulta o Mercado Pago
    if (order.status === 'pending' && mpAccessToken) {
      try {
        const searchRes = await fetch(
          `https://api.mercadopago.com/v1/payments/search?external_reference=${order.short_id}&sort=date_created&criteria=desc`,
          { headers: { Authorization: `Bearer ${mpAccessToken}` } }
        );

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const approvedPayment = searchData.results?.find((p: any) => p.status === 'approved');

          if (approvedPayment) {
            await supabase
              .from('orders')
              .update({
                status: 'approved',
                mp_payment_id: String(approvedPayment.id),
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            order.status = 'approved';
            order.mp_payment_id = String(approvedPayment.id);

            // 3. Disparo do e-mail de confirmação
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey && order.customer_email) {
              try {
                const resend = new Resend(resendKey);
                const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <contato@laromme.com.br>';
                const clientName = order.customer_name || 'Patrono';
                const shortIdStr = order.short_id ? `#${order.short_id}` : '';

                await resend.emails.send({
                  from: fromEmail,
                  to: [order.customer_email],
                  subject: `Ordem Homologada ${shortIdStr} — LaRomme`,
                  html: `
                    <div style="background-color: #050505; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; line-height: 1.6;">
                      <div style="max-width: 540px; margin: 0 auto; background: #0c0c0c; border: 1px solid #27272a; padding: 32px;">
                        <h1 style="color: #ffffff; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; font-weight: 500;">
                          ARTEFATO HOMOLOGADO
                        </h1>
                        <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 16px;">
                          Saudações, ${clientName}.
                        </p>
                        <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 24px;">
                          Seu pagamento referente ao Pedido <strong>${shortIdStr}</strong> foi liquidado e confirmado via Pix.
                        </p>
                        <div style="background: #18181b; border-left: 2px solid #10b981; padding: 16px; margin-bottom: 24px;">
                          <p style="color: #10b981; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            Status: Em Separação no Galpão
                          </p>
                        </div>
                        <p style="color: #71717a; font-size: 11px; margin-bottom: 0;">
                          Acompanhe os próximos registros de rastreamento diretamente na sua conta LaRomme.
                        </p>
                      </div>
                    </div>
                  `
                });
              } catch (mailErr) {
                console.error('[ERRO RESEND]:', mailErr);
              }
            }
          }
        }
      } catch (mpErr) {
        console.error('Falha no fallback ativo MP:', mpErr);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Erro na rota /api/pedido:', error);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}