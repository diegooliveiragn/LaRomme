import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, esporte, tamanho, estado } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 });
    }

    if (!resend) {
      console.warn('RESEND_API_KEY não configurada. Disparo de e-mail em standby.');
      return NextResponse.json({ success: true, warning: 'Chave do Resend ausente.' });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>LaRomme • Confirmação de Acesso Prioritário</title>
      </head>
      <body style="background-color: #080808; color: #E4E4E7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #0c0c0c; border: 1px solid #27272A; padding: 36px;">
          <tr>
            <td style="border-b: 1px solid #18181B; padding-bottom: 24px; text-align: left;">
              <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; letter-spacing: 0.25em; color: #FFFFFF; text-transform: uppercase;">LAROMME</span>
              <p style="font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #71717A; margin: 6px 0 0 0; text-transform: uppercase;">SENADO VIP • DROP 01 / ORIGO</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0 20px 0;">
              <h1 style="font-family: Georgia, serif; font-size: 22px; color: #FFFFFF; font-weight: normal; margin: 0 0 16px 0; letter-spacing: 0.05em;">
                Olá, ${nome || 'Patrono'}.
              </h1>
              <p style="font-size: 13px; line-height: 1.7; color: #A1A1AA; margin: 0 0 20px 0;">
                Seu registro de acesso prioritário para o primeiro lançamento foi confirmado.
              </p>
              <p style="font-size: 13px; line-height: 1.7; color: #A1A1AA; margin: 0 0 24px 0;">
                Criamos a LaRomme a partir da realidade de Fortaleza — onde a brisa litorânea, o sol e a intensidade do movimento exigem matérias-primas com toque fresco, alta respirabilidade e caimento impecável. Peças desenhadas para transitar com naturalidade da prática esportiva ao cotidiano.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #050505; border: 1px solid #1F1F23; padding: 20px; font-family: monospace; font-size: 11px;">
              <p style="color: #71717A; letter-spacing: 0.15em; margin: 0 0 12px 0; text-transform: uppercase;">SEU PERFIL REGISTRADO</p>
              <table width="100%" cellpadding="4" cellspacing="0" style="color: #E4E4E7; font-size: 11px;">
                <tr>
                  <td style="color: #71717A; width: 140px;">MODALIDADE:</td>
                  <td style="font-weight: bold; color: #FFFFFF;">${esporte || 'LIFESTYLE'}</td>
                </tr>
                <tr>
                  <td style="color: #71717A;">TAMANHO PREFERENCIAL:</td>
                  <td style="font-weight: bold; color: #FFFFFF;">${tamanho || 'M'}</td>
                </tr>
                <tr>
                  <td style="color: #71717A;">TERRITÓRIO:</td>
                  <td style="font-weight: bold; color: #FFFFFF;">${estado || 'CE'}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 0 12px 0;">
              <p style="font-size: 12px; line-height: 1.7; color: #A1A1AA; margin: 0;">
                Com o cadastro ativo, você receberá o link exclusivo diretamente neste e-mail <strong>24 horas antes da abertura geral</strong>, garantindo sua grade de tamanho com tranquilidade.
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-t: 1px solid #18181B; padding-top: 24px; text-align: left; font-family: monospace; font-size: 10px; color: #52525B;">
              <p style="margin: 0; letter-spacing: 0.15em; text-transform: uppercase;">LAROMME • FORTALEZA, CEARÁ</p>
              <p style="margin: 4px 0 0 0; color: #3F3F46;">Design com intenção, proporção e presença.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'LaRomme • Confirmação de Acesso Prioritário',
      html: htmlContent,
    });

    if (error) {
      console.error('Falha no Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Erro na API Senado VIP:', err);
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}
