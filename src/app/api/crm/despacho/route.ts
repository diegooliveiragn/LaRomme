import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, trackingCode } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Identificador do pedido (orderId) obrigatório.' },
        { status: 400 }
      );
    }

    // Busca o pedido no Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .or(`id.eq.${orderId},short_id.eq.${orderId}`)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Pedido não localizado no acervo.' },
        { status: 404 }
      );
    }

    const email = order.customer_email;
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Pedido sem endereço de e-mail associado.' },
        { status: 400 }
      );
    }

    // Atualiza tracking_code e status se informado
    const activeTracking = trackingCode || order.tracking_code || null;
    if (trackingCode && trackingCode !== order.tracking_code) {
      await supabase
        .from('orders')
        .update({ tracking_code: trackingCode, status: 'shipped' })
        .eq('id', order.id);
    }

    // Busca itens do pedido para discriminação
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    const rawName = (order.customer_name || '').trim();
    const firstName = rawName ? rawName.split(' ')[0] : 'Patrono';
    const orderShortId = order.short_id || order.id;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <suporte@laromme.com.br>';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';

    const itemsSummary = items && items.length > 0
      ? items.map((it: any) => `${it.product_name || it.name || 'Peça LaRomme'} (${it.size || 'Único'})`).join(', ')
      : 'Itens do acervo';

    const trackingUrl = activeTracking
      ? `https://rastreamento.correios.com.br/app/index.php?codigo=${activeTracking}`
      : `${siteUrl}/pedido/${order.id}`;

    const trackingBlock = activeTracking
      ? `<div style="background-color: #F4F4F5; border-left: 2px solid #18181B; padding: 16px 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717A;">Código de Rastreamento</p>
          <p style="margin: 6px 0 0 0; font-family: monospace; font-size: 15px; color: #18181B; font-weight: 700; letter-spacing: 0.08em;">${activeTracking}</p>
        </div>`
      : '';

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Despacho confirmado: ${orderShortId}`,
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Despacho Confirmado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; color: #18181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    O seu pedido ${orderShortId} foi despachado e encontra-se em trânsito.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; padding: 40px 0 60px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 4px;">
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px;">
              <a href="${siteUrl}" target="_blank">
                <img src="${siteUrl}/logo-preta.png" alt="LaRomme" width="40" style="display: block; max-width: 40px; border: 0;">
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 40px 24px 40px;">
              <h1 style="margin: 0; font-family: Georgia, 'Libre Baskerville', serif; font-size: 20px; font-weight: 700; color: #18181B; text-transform: uppercase; letter-spacing: 0.05em;">
                Despacho Confirmado
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 36px 40px; font-size: 14px; line-height: 1.7; color: #3F3F46;">
              <p style="margin: 0 0 18px 0;">Olá, ${firstName}.</p>
              <p style="margin: 0 0 18px 0;">O seu pedido <strong>${orderShortId}</strong> foi conferido, embalado e formalmente entregue à transportadora.</p>
              <p style="margin: 0 0 18px 0;">Nossas peças seguem um processo rígido de inspeção individual antes do envio, assegurando integridade e conformidade com os parâmetros construtivos da LaRomme.</p>
              
              ${trackingBlock}

              <div style="background-color: #FFFFFF; border: 1px solid #E4E4E7; padding: 14px 18px; margin: 20px 0; border-radius: 2px;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717A;">Resumo do envio</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #18181B;">${itemsSummary}</p>
              </div>

              <p style="margin: 0 0 28px 0;">Você pode acompanhar a movimentação do pacote em tempo real utilizando o botão abaixo.</p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #18181B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">
                      Acompanhar Objeto
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 40px; background-color: #F4F4F5; font-size: 11px; line-height: 1.6; color: #71717A; border-top: 1px solid #E4E4E7; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #18181B;">LaRomme</p>
              <p style="margin: 0 0 8px 0;">
                <a href="mailto:suporte@laromme.com.br" style="color: #71717A; text-decoration: underline;">suporte@laromme.com.br</a> &nbsp;|&nbsp;
                <a href="https://open.spotify.com/user/31voi2u5nwaugj46lxf2pectkcha" target="_blank" style="color: #71717A; text-decoration: underline;">Spotify Oficial</a>
              </p>
              <p style="margin: 0;">Notificação logística gerada automaticamente a partir do pedido ${orderShortId}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      shortId: orderShortId,
      email,
      resendId: emailResponse.data?.id,
    });
  } catch (error: any) {
    console.error('Erro no despacho:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno.' }, { status: 500 });
  }
}