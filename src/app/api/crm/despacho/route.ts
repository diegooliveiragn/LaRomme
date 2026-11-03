import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getOrderShippedEmail } from '@/lib/email-templates';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LaRomme <pedidos@laromme.com.br>';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, customerName, orderNumber, trackingCode, carrierName } = body;

    if (!email || !orderNumber || !trackingCode) {
      return NextResponse.json({ success: false, error: 'Dados insuficientes para envio de rastreio.' }, { status: 400 });
    }

    if (!resend) {
      console.warn('[CRM DESPACHO] RESEND_API_KEY não configurada.');
      return NextResponse.json({ success: false, message: 'RESEND_API_KEY pendente.' }, { status: 200 });
    }

    const carrier = carrierName || 'Correios / Transportadora';
    const trackingUrl = `https://www.laromme.com.br/pedido/${orderNumber}`;

    const { subject, html } = getOrderShippedEmail({
      customerName,
      orderNumber,
      carrierName: carrier,
      trackingCode,
      trackingUrl
    });

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: 'contato@laromme.com.br',
      to: email,
      subject,
      html
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[CRM DESPACHO] Erro:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}