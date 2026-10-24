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
    const { orderId } = body;

    let targetOrders: any[] = [];

    if (orderId) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${orderId},short_id.eq.${orderId}`)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Pedido não localizado.' }, { status: 404 });
      }
      targetOrders = [data];
    } else {
      const timeThreshold = new Date(Date.now() - 45 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .lte('created_at', timeThreshold)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      targetOrders = data || [];
    }

    if (targetOrders.length === 0) {
      return NextResponse.json({ success: true, message: 'Nenhuma reserva pendente para recuperação.', sent: 0 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <suporte@laromme.com.br>';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';
    const results = [];

    for (const order of targetOrders) {
      const email = order.customer_email;
      if (!email || !email.includes('@')) continue;

      const rawName = (order.customer_name || '').trim();
      const firstName = rawName ? rawName.split(' ')[0] : 'Patrono';
      const orderShortId = order.short_id || order.id;
      const checkoutUrl = `${siteUrl}/pedido/${order.id}`;

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      const itemsSummary = items && items.length > 0
        ? items.map((it: any) => `${it.product_name || it.name || 'Peça LaRomme'} (${it.size || 'Único'})`).join(', ')
        : 'Sua seleção no acervo';

      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Sua seleção permanece reservada',
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sua seleção na LaRomme</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; color: #18181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Suas peças selecionadas permanecem retidas temporariamente.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
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
                Reserva de Acervo
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 36px 40px; font-size: 14px; line-height: 1.7; color: #3F3F46;">
              <p style="margin: 0 0 18px 0;">Olá, ${firstName}.</p>
              <p style="margin: 0 0 18px 0;">Identificamos que a conclusão do seu pedido <strong>${orderShortId}</strong> não foi finalizada.</p>
              <p style="margin: 0 0 18px 0;">Trabalhamos com tiragens enxutas e peças de produção controlada. Por esse motivo, o estoque selecionado permanece retido por período determinado antes de retornar à disponibilidade pública.</p>
              
              <div style="background-color: #F4F4F5; border-left: 2px solid #18181B; padding: 14px 18px; margin: 24px 0;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717A;">Itens retidos</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #18181B; font-weight: 500;">${itemsSummary}</p>
              </div>

              <p style="margin: 0 0 28px 0;">Caso deseje assegurar suas peças e concluir a reserva, o acesso direto ao seu pedido permanece disponível pelo canal seguro abaixo.</p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${checkoutUrl}" target="_blank" style="display: inline-block; background-color: #18181B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">
                      Concluir Reserva
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
              <p style="margin: 0;">Você recebeu esta mensagem técnica relativa a uma reserva iniciada em laromme.com.br.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      });

      results.push({ orderId: order.id, shortId: order.short_id, email, status: 'sent', resendId: emailResponse.data?.id });
    }

    return NextResponse.json({ success: true, processed: results.length, details: results });
  } catch (error: any) {
    console.error('Erro na recuperação de carrinho:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}