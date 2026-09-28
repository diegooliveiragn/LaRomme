import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');
const FROM_EMAIL = 'LaRomme <onboarding@resend.dev>';

export async function sendVipWelcomeEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '[LaRomme] Credencial Ativada • Senado VIP',
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: Helvetica, Arial, sans-serif; padding: 40px; text-transform: uppercase; letter-spacing: 1px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-bottom: 5px; letter-spacing: 4px;">LaRomme.</h1>
          <p style="font-size: 10px; color: #a1a1aa; margin-top: 0; letter-spacing: 2px;">Acesso ao Senado VIP</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="font-size: 11px; margin-bottom: 20px;">Saudações, ${name || 'Membro VIP'}.</p>
          <p style="font-size: 11px; color: #d4d4d8; line-height: 1.6;">Sua credencial foi ativada. Você terá prioridade exclusiva de 1 hora no lançamento do Lote Zero para assegurar seus artefatos antes da abertura pública do cofre.</p>
          <p style="font-size: 10px; color: #71717a; margin-top: 40px; letter-spacing: 2px;">A força de Roma. O movimento de Fortaleza.</p>
          <p style="font-size: 9px; color: #52525b; margin-top: 10px;">Fortaleza &bull; CE</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail VIP:', err);
  }
}

export async function sendPixGeneratedEmail(email: string, name: string, orderNumber: string, pixCode: string, total: number) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[LaRomme] Código Pix de Liquidação • ${orderNumber}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: Helvetica, Arial, sans-serif; padding: 40px; text-transform: uppercase; letter-spacing: 1px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-bottom: 5px; letter-spacing: 4px;">LaRomme.</h1>
          <p style="font-size: 10px; color: #a1a1aa; margin-top: 0; letter-spacing: 2px;">Reserva de Aquisição</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="font-size: 11px; margin-bottom: 20px;">Saudações, ${name}.</p>
          <p style="font-size: 11px; color: #d4d4d8; line-height: 1.6;">O seu pedido <strong>${orderNumber}</strong> (R$ ${total.toFixed(2)}) está aguardando liquidação. Utilize o código Pix Copia e Cola abaixo para finalizar:</p>
          <div style="background-color: #0a0a0a; border: 1px solid #27272a; padding: 15px; margin: 25px 0; word-break: break-all; font-family: monospace; font-size: 10px; color: #a1a1aa;">
            ${pixCode}
          </div>
          <p style="font-size: 10px; color: #71717a; margin-top: 40px; letter-spacing: 2px;">A força de Roma. O movimento de Fortaleza.</p>
          <p style="font-size: 9px; color: #52525b; margin-top: 10px;">Fortaleza &bull; CE</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail Pix:', err);
  }
}

export async function sendPaymentApprovedEmail(email: string, name: string, orderNumber: string, serialCode: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[LaRomme] Aquisição Confirmada • Serial ${serialCode}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: Helvetica, Arial, sans-serif; padding: 40px; text-transform: uppercase; letter-spacing: 1px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-bottom: 5px; letter-spacing: 4px;">LaRomme.</h1>
          <p style="font-size: 10px; color: #a1a1aa; margin-top: 0; letter-spacing: 2px;">Recibo de Liquidação</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="font-size: 11px; margin-bottom: 20px;">Saudações, ${name}.</p>
          <p style="font-size: 11px; color: #d4d4d8; line-height: 1.6;">O seu artefato do Lote Zero foi assegurado e liberado do cofre. Sua credencial no Senado VIP foi atualizada com o código de série exclusivo gravado na peça.</p>
          <div style="background-color: #0a0a0a; border: 1px solid #27272a; padding: 20px; margin: 30px 0;">
            <p style="font-size: 10px; color: #71717a; margin: 0 0 10px 0;">Documento: <span style="color: #ffffff;">${orderNumber}</span></p>
            <p style="font-size: 10px; color: #71717a; margin: 0;">Serial Code: <span style="color: #34d399; font-weight: bold;">${serialCode}</span></p>
          </div>
          <p style="font-size: 10px; color: #71717a; margin-top: 40px; letter-spacing: 2px;">A força de Roma. O movimento de Fortaleza.</p>
          <p style="font-size: 9px; color: #52525b; margin-top: 10px;">Fortaleza &bull; CE</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail Aprovado:', err);
  }
}

export async function sendShippingTrackingEmail(email: string, name: string, orderNumber: string, trackingCode: string, carrier: string = 'Correios') {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `[LaRomme] Artefato Despachado • Rastreio ${trackingCode}`,
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: Helvetica, Arial, sans-serif; padding: 40px; text-transform: uppercase; letter-spacing: 1px;">
          <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-bottom: 5px; letter-spacing: 4px;">LaRomme.</h1>
          <p style="font-size: 10px; color: #a1a1aa; margin-top: 0; letter-spacing: 2px;">Despacho Logístico White Glove</p>
          <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
          <p style="font-size: 11px; margin-bottom: 20px;">Saudações, ${name}.</p>
          <p style="font-size: 11px; color: #d4d4d8; line-height: 1.6;">O seu artefato relativo ao documento <strong>${orderNumber}</strong> foi inspecionado, embalado e despachado da nossa base em Fortaleza.</p>
          <div style="background-color: #0a0a0a; border: 1px solid #27272a; padding: 20px; margin: 30px 0;">
            <p style="font-size: 10px; color: #71717a; margin: 0 0 10px 0;">Operador: <span style="color: #ffffff;">${carrier}</span></p>
            <p style="font-size: 10px; color: #71717a; margin: 0;">Código de Rastreio: <span style="color: #ffffff; font-weight: bold;">${trackingCode}</span></p>
          </div>
          <p style="font-size: 10px; color: #71717a; margin-top: 40px; letter-spacing: 2px;">A força de Roma. O movimento de Fortaleza.</p>
          <p style="font-size: 9px; color: #52525b; margin-top: 10px;">Fortaleza &bull; CE</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail de Rastreio:', err);
  }
}