interface BaseEmailParams {
  customerName?: string;
}

interface OrderConfirmedParams extends BaseEmailParams {
  orderNumber: string;
  productName: string;
  productSize: string;
  quantity?: number;
  orderTotal: string;
  shippingAddress?: string;
  trackingUrl: string;
}

interface OrderShippedParams extends BaseEmailParams {
  orderNumber: string;
  carrierName: string;
  trackingCode: string;
  trackingUrl: string;
}

interface AbandonedCartParams extends BaseEmailParams {
  productName: string;
  productSize: string;
  checkoutUrl: string;
}

interface WelcomeVIPParams extends BaseEmailParams {
  storeUrl?: string;
}

// Layout Base Reutilizável
function renderBaseLayout(title: string, preheader: string, contentHtml: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f7f7f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .content { padding: 32px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 0; background-color: #f7f7f7;">
  <span style="display:none;font-size:1px;color:#f7f7f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </span>
  <center>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center">
          <table class="container" border="0" cellpadding="0" cellspacing="0" width="560" style="background-color: #ffffff; border: 1px solid #e8e8e8; border-radius: 2px;">
            <!-- TOPO INSTITUCIONAL -->
            <tr>
              <td align="center" style="padding: 40px 40px 24px 40px; border-bottom: 1px solid #f0f0f0;">
                <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; letter-spacing: 0.25em; text-transform: uppercase; color: #000000; text-decoration: none;">
                  L A R O M M E
                </span>
                <div style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 0.3em; color: #888888; text-transform: uppercase; margin-top: 6px;">
                  3°44' S &nbsp; 38°31' W // FORTALEZA
                </div>
              </td>
            </tr>

            <!-- CONTEÚDO PRINCIPAL -->
            <tr>
              <td class="content" style="padding: 40px 44px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- RODAPÉ SÓBRIO -->
            <tr>
              <td align="center" style="padding: 28px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f0;">
                <p style="font-size: 11px; color: #888888; line-height: 1.6; margin: 0 0 10px 0;">
                  Atendimento direto: <a href="mailto:contato@laromme.com.br" style="color: #111111; text-decoration: underline;">contato@laromme.com.br</a>
                </p>
                <div style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 0.2em; color: #aaaaaa; text-transform: uppercase;">
                  LaRomme • Força em Movimento • Fortaleza, Brasil
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

// 1. Confirmação de Pedido
export function getOrderConfirmedEmail(params: OrderConfirmedParams): { subject: string; html: string } {
  const name = params.customerName ? `, ${params.customerName}` : '';
  const subject = `Pedido confirmado • #${params.orderNumber}`;
  const preheader = 'Seu artefato está em preparação em Fortaleza.';

  const content = `
    <div style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #777777; margin-bottom: 8px;">
      Transação Confirmada
    </div>
    <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #111111; margin: 0 0 20px 0; line-height: 1.3;">
      Recebemos seu pedido #${params.orderNumber}.
    </h1>

    <p style="font-size: 13px; line-height: 1.7; color: #444444; margin: 0 0 24px 0; font-weight: 300;">
      Olá${name}. Confirmamos o recebimento e a aprovação do seu pedido. Nossas peças são desenvolvidas sob o rigor do clima costeiro e agora entram na esteira de inspeção cuidadosa e embalagem.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #eeeeee; margin-bottom: 24px;">
      <tr>
        <td style="padding: 18px 20px;">
          <div style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #888888; margin-bottom: 8px;">
            Resumo do Pedido
          </div>
          <div style="font-family: Georgia, serif; font-size: 15px; font-weight: bold; color: #111111; margin-bottom: 4px;">
            ${params.productName}
          </div>
          <div style="font-size: 12px; color: #666666; margin-bottom: 12px;">
            Grade: <strong>${params.productSize}</strong> ${params.quantity ? `&nbsp;|&nbsp; Quantidade: <strong>${params.quantity}</strong>` : ''}
          </div>
          ${params.shippingAddress ? `<div style="font-size: 11px; color: #777777; margin-bottom: 10px;">Destino: ${params.shippingAddress}</div>` : ''}
          <div style="border-top: 1px solid #e8e8e8; padding-top: 10px; font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; color: #111111;">
            Total: ${params.orderTotal}
          </div>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; line-height: 1.6; color: #666666; margin: 0 0 28px 0;">
      Assim que a encomenda for lacrada e confiada à transportadora, você receberá a notificação com o código de rastreamento.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="${params.trackingUrl}" target="_blank" style="display: inline-block; background-color: #050505; color: #ffffff; font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 1px;">
            Acompanhar Pedido
          </a>
        </td>
      </tr>
    </table>
  `;

  return { subject, html: renderBaseLayout(subject, preheader, content) };
}

// 2. Pedido Despachado
export function getOrderShippedEmail(params: OrderShippedParams): { subject: string; html: string } {
  const name = params.customerName ? `, ${params.customerName}` : '';
  const subject = `Seu pedido está a caminho • #${params.orderNumber}`;
  const preheader = 'Acompanhe o trajeto do seu pacote até o destino.';

  const content = `
    <div style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #777777; margin-bottom: 8px;">
      Logística Acionada
    </div>
    <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #111111; margin: 0 0 20px 0; line-height: 1.3;">
      Seu artefato está em trânsito.
    </h1>

    <p style="font-size: 13px; line-height: 1.7; color: #444444; margin: 0 0 24px 0; font-weight: 300;">
      Olá${name}. A logística foi acionada. O seu pedido #${params.orderNumber} foi despachado de nossa base em Fortaleza e já está em trânsito com a transportadora.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050505; color: #ffffff; margin-bottom: 24px; border-radius: 1px;">
      <tr>
        <td style="padding: 22px 24px;">
          <div style="font-family: 'Courier New', monospace; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #999999; margin-bottom: 6px;">
            Código de Rastreamento
          </div>
          <div style="font-family: 'Courier New', monospace; font-size: 17px; font-weight: bold; letter-spacing: 0.15em; color: #ffffff; margin-bottom: 10px;">
            ${params.trackingCode}
          </div>
          <div style="font-size: 11px; color: #aaaaaa;">
            Operador Logístico: ${params.carrierName}
          </div>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; line-height: 1.6; color: #666666; margin: 0 0 28px 0;">
      Para acompanhar as etapas da movimentação em tempo real, utilize o acesso direto abaixo. Quando o pacote chegar, sinta a diferença da nossa arquitetura têxtil.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="${params.trackingUrl}" target="_blank" style="display: inline-block; background-color: #050505; color: #ffffff; font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 1px;">
            Rastrear Encomenda
          </a>
        </td>
      </tr>
    </table>
  `;

  return { subject, html: renderBaseLayout(subject, preheader, content) };
}

// 3. Carrinho Pendente / Seleção Salva
export function getAbandonedCartEmail(params: AbandonedCartParams): { subject: string; html: string } {
  const name = params.customerName ? `, ${params.customerName}` : '';
  const subject = 'Sua seleção na LaRomme continua disponível';
  const preheader = 'Guardamos os artefatos selecionados para você.';

  const content = `
    <div style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #777777; margin-bottom: 8px;">
      Seleção Pendente
    </div>
    <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #111111; margin: 0 0 20px 0; line-height: 1.3;">
      Guardamos os seus itens.
    </h1>

    <p style="font-size: 13px; line-height: 1.7; color: #444444; margin: 0 0 24px 0; font-weight: 300;">
      Olá${name}. Notamos que a sua seleção de peças ficou pendente. Como nossa confecção opera com controle rigoroso de metragem, guardamos os seus itens temporariamente para que você possa retomar a escolha quando for conveniente.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; border: 1px solid #eeeeee; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px 20px;">
          <div style="font-family: Georgia, serif; font-size: 14px; font-weight: bold; color: #111111;">
            ${params.productName}
          </div>
          <div style="font-size: 12px; color: #666666; margin-top: 4px;">
            Grade selecionada: <strong>${params.productSize}</strong>
          </div>
        </td>
      </tr>
    </table>

    <p style="font-size: 12px; line-height: 1.6; color: #666666; margin: 0 0 28px 0;">
      Se houver dúvidas sobre proporções do Provador Anatômico, modelagem ou propriedades térmicas das fibras, nossa equipe está à disposição respondendo a esta mensagem.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="${params.checkoutUrl}" target="_blank" style="display: inline-block; background-color: #050505; color: #ffffff; font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 1px;">
            Retomar Seleção
          </a>
        </td>
      </tr>
    </table>
  `;

  return { subject, html: renderBaseLayout(subject, preheader, content) };
}

// 4. Boas-Vindas ao Senado VIP
export function getWelcomeVIPEmail(params: WelcomeVIPParams): { subject: string; html: string } {
  const name = params.customerName ? `, ${params.customerName}` : '';
  const subject = 'Bem-vindo à LaRomme';
  const preheader = 'Acesso confirmado ao Senado e comunicações exclusivas.';
  const storeUrl = params.storeUrl || 'https://www.laromme.com.br';

  const content = `
    <div style="font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #777777; margin-bottom: 8px;">
      Membro Confirmado
    </div>
    <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #111111; margin: 0 0 20px 0; line-height: 1.3;">
      Acesso ao Senado VIP.
    </h1>

    <p style="font-size: 13px; line-height: 1.7; color: #444444; margin: 0 0 20px 0; font-weight: 300;">
      Olá${name}. Sua inscrição no Senado foi confirmada. A partir de agora, você faz parte de um círculo que acompanha nossas criações, decisões de modelagem e bastidores antes do público geral.
    </p>

    <p style="font-size: 13px; line-height: 1.7; color: #444444; margin: 0 0 24px 0; font-weight: 300;">
      A LaRomme nasce do encontro entre a exigência do treino diário sob o calor do litoral e a sobriedade das proporções clássicas. Não espere excesso de mensagens ou promoções vazias. Nosso contato é direto e respeita o seu tempo.
    </p>

    <p style="font-size: 12px; line-height: 1.6; color: #666666; margin: 0 0 28px 0;">
      Quando um novo lote ou artefato estiver prestes a ser disponibilizado, você será avisado com antecedência de janela exclusiva.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="${storeUrl}" target="_blank" style="display: inline-block; background-color: #050505; color: #ffffff; font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 1px;">
            Explorar o Acervo
          </a>
        </td>
      </tr>
    </table>
  `;

  return { subject, html: renderBaseLayout(subject, preheader, content) };
}