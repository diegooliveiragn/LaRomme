import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, tamanho, esporte, estado } = body;

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

    // Se o domínio próprio já estiver verificado no Resend, use senado@laromme.com.br
    // Caso contrário, usa onboarding@resend.dev para fase de testes
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <senado@laromme.com.br>';

    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>LaRomme // Senado VIP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E4E4E7;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- CONTAINER PRINCIPAL -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #09090b; border: 1px solid #1f1f23; border-radius: 4px; overflow: hidden;">
          
          <!-- TOPO TÉCNICO -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #18181b; background-color: #070708;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="font-family: 'Courier New', monospace; font-size: 10px; color: #71717A; letter-spacing: 2px;">
                    03°43'16"S 38°32'41"W
                  </td>
                  <td align="right" style="font-family: 'Courier New', monospace; font-size: 10px; color: #D4D4D8; letter-spacing: 2px; font-weight: bold;">
                    SENADO VIP • DROP 01
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CABEÇALHO DA MARCA -->
          <tr>
            <td style="padding: 48px 32px 24px 32px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; letter-spacing: 8px; color: #FFFFFF; font-weight: 700; text-transform: uppercase;">
                LAROMME
              </h1>
              <p style="margin: 6px 0 0 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 4px; color: #A1A1AA; text-transform: uppercase;">
                SISTEMA ORIGO // ACESSO PRIVATIVO
              </p>
            </td>
          </tr>

          <!-- CONTEÚDO PRINCIPAL -->
          <tr>
            <td style="padding: 16px 32px 32px 32px;">
              <p style="font-size: 14px; line-height: 24px; color: #D4D4D8; margin-top: 0; font-weight: 300;">
                Olá, <strong>${nome}</strong>.
              </p>
              <p style="font-size: 13px; line-height: 22px; color: #A1A1AA; margin: 16px 0; font-weight: 300;">
                Seu alistamento foi homologado com sucesso no acervo do <strong>Senado VIP</strong>. Suas preferências de modelagem e esporte foram registradas para o planejamento de estoque do nosso primeiro lançamento.
              </p>

              <!-- CARTÃO DE CREDENCIAL -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0; background-color: #040405; border: 1px solid #27272a; padding: 20px;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8">
                      <tr>
                        <td style="font-family: 'Courier New', monospace; font-size: 11px; color: #71717A; text-transform: uppercase;">STATUS:</td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: #34D399; font-weight: bold;">PRIORIDADE HOMOLOGADA (24H)</td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Courier New', monospace; font-size: 11px; color: #71717A; text-transform: uppercase;">PASSE DE ACESSO:</td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 13px; color: #FFFFFF; font-weight: bold; letter-spacing: 2px;">ORIGO24H</td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Courier New', monospace; font-size: 11px; color: #71717A; text-transform: uppercase;">GRADE RESERVADA:</td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: #E4E4E7;">TAMANHO ${tamanho || 'M'}</td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Courier New', monospace; font-size: 11px; color: #71717A; text-transform: uppercase;">MODALIDADE:</td>
                        <td align="right" style="font-family: 'Courier New', monospace; font-size: 11px; color: #E4E4E7;">${esporte || 'BEACH TENNIS'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 20px; color: #A1A1AA; margin: 16px 0; font-weight: 300;">
                O Drop 01 será aberto primeiro aos membros do Senado. Você receberá o convite de compra com 24 horas de antecedência ao público geral, podendo utilizar seu e-mail cadastrado ou o passe mestre acima para desbloquear as peças.
              </p>

              <!-- BOTÃO DE EXPLORAÇÃO -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="https://laromme.com.br/#origo" target="_blank" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-family: -apple-system, sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 14px 32px; text-decoration: none; border-radius: 2px;">
                      CONHECER O ACERVO
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RODAPÉ TÉCNICO -->
          <tr>
            <td style="padding: 24px 32px; background-color: #070708; border-top: 1px solid #18181b; text-align: center;">
              <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 10px; color: #52525B; line-height: 16px; letter-spacing: 1px;">
                LAROMME SPORTING ARCHITECTURE • FORTALEZA, BRASIL<br>
                ESTA É UMA COMUNICAÇÃO PRIVATIVA DIRIGIDA AO MEMBRO ALISTADO.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'SENADO VIP // Homologação de Acesso Antecipado • Drop 01',
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
