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

    // Template Dark Mode blindado contra inversões forçadas do Gmail (iOS / Android)
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <title>LaRomme // Senado VIP</title>
  <style>
    :root {
      color-scheme: dark only;
      supported-color-schemes: dark only;
    }
    body, table, td, div, p, a {
      -webkit-font-smoothing: antialiased;
      text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #040405; background-image: linear-gradient(#040405, #040405); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <div style="background-color: #040405; background-image: linear-gradient(#040405, #040405); padding: 40px 12px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #09090b; background-image: linear-gradient(#09090b, #09090b); border: 1px solid #27272a; border-radius: 4px; overflow: hidden;">
      
      <!-- TOPO TÉCNICO // COORDENADAS -->
      <tr>
        <td style="padding: 18px 28px; background-color: #070708; background-image: linear-gradient(#070708, #070708); border-bottom: 1px solid #1f1f23;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="left" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #D4D4D8; letter-spacing: 2px;">
                03°43'16"S 38°32'41"W
              </td>
              <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #FFFFFF; font-weight: bold; letter-spacing: 2px;">
                SENADO VIP • DROP 01
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CABEÇALHO DA MARCA -->
      <tr>
        <td align="center" style="padding: 44px 28px 20px 28px;">
          <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; letter-spacing: 10px; color: #FFFFFF; font-weight: 700; text-transform: uppercase;">
            LAROMME
          </h1>
          <p style="margin: 8px 0 0 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 4px; color: #D4D4D8; text-transform: uppercase;">
            SISTEMA ORIGO // CONVOCAÇÃO OFICIAL
          </p>
        </td>
      </tr>

      <!-- MENSAGEM PRINCIPAL -->
      <tr>
        <td style="padding: 20px 32px 32px 32px;">
          <p style="font-size: 15px; line-height: 24px; color: #FFFFFF; margin: 0 0 16px 0; font-weight: 600;">
            Prezado(a) ${nome},
          </p>
          <p style="font-size: 13px; line-height: 22px; color: #E4E4E7; margin: 0 0 24px 0; font-weight: 300;">
            Seu alistamento foi homologado com êxito no acervo privativo da LaRomme. Seus parâmetros anatômicos e de modalidade foram alocados para o planejamento do estoque inicial do nosso primeiro lançamento.
          </p>

          <!-- CREDENCIAL TÉCNICA (BOX BLINDADO) -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0; background-color: #030303; background-image: linear-gradient(#030303, #030303); border: 1px solid #3f3f46;">
            <tr>
              <td style="padding: 22px 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="8">
                  <tr>
                    <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A1A1AA; text-transform: uppercase;">STATUS:</td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #34D399; font-weight: bold; letter-spacing: 1px;">HOMOLOGADO // 24H PRIVATIVO</td>
                  </tr>
                  <tr>
                    <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A1A1AA; text-transform: uppercase;">IDENTIFICAÇÃO:</td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #FFFFFF; font-weight: bold;">MEMBRO #${codeId}</td>
                  </tr>
                  <tr>
                    <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A1A1AA; text-transform: uppercase;">PASSE DO DROP 01:</td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #FFFFFF; font-weight: bold; letter-spacing: 2px;">ORIGO24H</td>
                  </tr>
                  <tr>
                    <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A1A1AA; text-transform: uppercase;">GRADE ALOCADA:</td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #FFFFFF; font-weight: bold;">TAMANHO ${tamanho || 'M'}</td>
                  </tr>
                  <tr>
                    <td style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #A1A1AA; text-transform: uppercase;">MODALIDADE:</td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #FFFFFF; font-weight: bold;">${esporte || 'BEACH TENNIS'}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="font-size: 13px; line-height: 22px; color: #E4E4E7; margin: 24px 0 32px 0; font-weight: 300;">
            A vitrine do Drop 01 será liberada aos patronos cadastrados 24 horas antes da abertura geral. Você poderá acessar diretamente com este endereço de e-mail ou aplicando o passe mestre acima.
          </p>

          <!-- BOTÃO DE EXPLORAÇÃO -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <a href="https://laromme.com.br/#origo" target="_blank" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; padding: 15px 36px; text-decoration: none; border-radius: 2px;">
                  INSPECIONAR O ACERVO
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- RODAPÉ EDITORIAL -->
      <tr>
        <td style="padding: 24px 28px; background-color: #070708; background-image: linear-gradient(#070708, #070708); border-top: 1px solid #1f1f23; text-align: center;">
          <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #A1A1AA; line-height: 18px; letter-spacing: 1px;">
            LAROMME SPORTING ARCHITECTURE • FORTALEZA, BRASIL<br>
            COMUNICAÇÃO EXCLUSIVA E PRIVATIVA DIRIGIDA AO PATRONO.
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
      reply_to: 'romannuscompany@gmail.com',
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
