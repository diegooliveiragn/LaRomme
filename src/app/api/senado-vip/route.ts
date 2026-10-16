import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, tamanho, esporte, estado, patronoId } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'E-mail obrigatório' }, { status: 400 });
    }

    if (!resend) {
      console.warn('[SENADO VIP EMAIL] RESEND_API_KEY não configurada no ambiente.');
      return NextResponse.json({
        success: false,
        message: 'Chave RESEND_API_KEY pendente de configuração.',
      });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <contato@laromme.com.br>';
    const codeId = patronoId || Math.floor(100 + Math.random() * 900).toString();
    const firstName = nome ? nome.trim().split(' ')[0] : 'Atleta';

    // Versão Texto Puro (Critério essencial para não cair em Spam)
    const textPlain = `LaRomme — Acesso Antecipado ao Drop 01

Olá, ${firstName}.

Seu cadastro no Senado VIP foi confirmado.

Registramos sua preferência de modalidade (${esporte || 'Prática Esportiva'}) e tamanho (${tamanho || 'M'}). Essas informações nos ajudam a calibrar o estoque do nosso primeiro lançamento.

Identificação: Membro #${codeId}
Acesso prioritário: 24 horas antes da abertura geral
Código de acesso: ORIGO24H

Quando o Drop 01 estiver pronto, você receberá o link privativo diretamente neste e-mail.

Conhecer a LaRomme: https://laromme.com.br

LaRomme — Entre a prática e o cotidiano.
Fortaleza, Ceará.
`;

    // Template HTML 100% Tipográfico com Libre Baskerville
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LaRomme — Acesso Antecipado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed; -webkit-font-smoothing: antialiased;">
  <div style="background-color: #0c0c0e; padding: 48px 16px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #121215; border: 1px solid #222226; border-radius: 2px;">
      
      <!-- IDENTIFICAÇÃO SUPERIOR -->
      <tr>
        <td style="padding: 24px 32px; border-bottom: 1px solid #1c1c21;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; letter-spacing: 2px; color: #71717a; text-transform: uppercase;">
                SENADO VIP // DROP 01
              </td>
              <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; letter-spacing: 1px; color: #a1a1aa;">
                MEMBRO #${codeId}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CABEÇALHO TIPOGRÁFICO OFICIAL -->
      <tr>
        <td align="center" style="padding: 48px 32px 32px 32px;">
          <h1 style="margin: 0; font-family: 'Libre Baskerville', Georgia, 'Times New Roman', serif; font-size: 32px; letter-spacing: 8px; color: #ffffff; font-weight: 400; text-transform: uppercase;">
            LAROMME
          </h1>
          <p style="margin: 12px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; letter-spacing: 3px; color: #82828c; text-transform: uppercase;">
            ENTRE A PRÁTICA E O COTIDIANO
          </p>
        </td>
      </tr>

      <!-- CONTEÚDO PRINCIPAL -->
      <tr>
        <td style="padding: 16px 36px 36px 36px;">
          <p style="font-size: 15px; line-height: 24px; color: #f4f4f5; margin: 0 0 16px 0; font-weight: 500;">
            Olá, ${firstName}.
          </p>
          <p style="font-size: 14px; line-height: 24px; color: #a1a1aa; margin: 0 0 28px 0; font-weight: 400;">
            Seu cadastro no Senado VIP foi confirmado. Registramos sua preferência de modalidade e tamanho para calibrar a produção do nosso primeiro lançamento.
          </p>

          <!-- CARTÃO TÉCNICO DE PREFERÊNCIA -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0; background-color: #0a0a0c; border: 1px solid #1f1f24; border-radius: 2px;">
            <tr>
              <td style="padding: 20px 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="8">
                  <tr>
                    <td style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">MODALIDADE:</td>
                    <td align="right" style="font-size: 12px; color: #ffffff; font-weight: 500;">${esporte || 'BEACH TENNIS'}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">GRADE PREFERENCIAL:</td>
                    <td align="right" style="font-size: 12px; color: #ffffff; font-weight: 500;">TAMANHO ${tamanho || 'M'}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">ACESSO:</td>
                    <td align="right" style="font-size: 12px; color: #ffffff; font-weight: 500;">24H DE ANTECEDÊNCIA</td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">CÓDIGO DE RESERVA:</td>
                    <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 12px; color: #ffffff; font-weight: 600; letter-spacing: 1px;">ORIGO24H</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="font-size: 14px; line-height: 24px; color: #a1a1aa; margin: 0 0 36px 0; font-weight: 400;">
            Quando o Drop 01 for aberto, você receberá o link de compra com 24 horas de antecedência ao público geral. Se precisar falar conosco ou atualizar algum dado, basta responder diretamente a esta mensagem.
          </p>

          <!-- CTA OBJETIVO -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <a href="https://laromme.com.br" target="_blank" style="display: inline-block; background-color: #ededed; color: #0c0c0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 14px 32px; text-decoration: none; border-radius: 2px;">
                  Conhecer a LaRomme
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- RODAPÉ INSTITUCIONAL -->
      <tr>
        <td style="padding: 24px 32px; border-top: 1px solid #1c1c21; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #52525b; line-height: 20px; letter-spacing: 0.5px;">
            LaRomme • Fortaleza, Ceará.<br>
            Comunicação transacional enviada para membros cadastrados.
          </p>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      replyTo: 'romannuscompany@gmail.com',
      to: [email],
      subject: 'LaRomme — Acesso antecipado confirmado',
      text: textPlain,
      html: emailHtml,
    });

    if (error) {
      console.error('[RESEND ERROR]', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('[API SENADO VIP] Erro inesperado:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
