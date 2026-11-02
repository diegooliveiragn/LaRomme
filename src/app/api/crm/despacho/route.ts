export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY;

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

    // Identifica se é UUID ou short_id numérico para evitar erro de tipo no Supabase
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(orderId));
    const isNumeric = /^\d+$/.test(String(orderId));

    let query = supabase.from('orders').select('*');
    if (isUuid) {
      query = query.eq('id', String(orderId));
    } else if (isNumeric) {
      query = query.eq('short_id', Number(orderId));
    } else {
      query = query.eq('id', String(orderId));
    }

    const { data: order, error: orderError } = await query.maybeSingle();

    if (orderError || !order) {
      console.error('[ERRO DESPACHO] Pedido não encontrado:', orderError);
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

    const activeTracking = trackingCode || order.tracking_code || null;

    // Atualiza status e rastreamento no Supabase
    await supabase
      .from('orders')
      .update({
        tracking_code: activeTracking,
        status: 'shipped',
        fulfillment_substatus: 'DESPACHADO',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    // Disparo de e-mail de despacho via Resend
    let resendId = null;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const rawName = (order.customer_name || '').trim();
        const firstName = rawName ? rawName.split(' ')[0] : 'Patrono';
        const orderShortId = order.short_id ? `#${order.short_id}` : order.id;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <contato@laromme.com.br>';
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';

        const trackingBlock = activeTracking
          ? `<div style="background-color: #18181b; border-left: 2px solid #10b981; padding: 16px 20px; margin: 24px 0;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #a1a1aa;">Código de Rastreamento</p>
              <p style="margin: 6px 0 0 0; font-family: monospace; font-size: 16px; color: #10b981; font-weight: 700; letter-spacing: 0.08em;">${activeTracking}</p>
            </div>`
          : '';

        const trackingUrl = activeTracking
          ? `https://rastreamento.correios.com.br/app/index.php?codigo=${activeTracking}`
          : `${siteUrl}/pedido/${order.id}`;

        const emailResponse = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `Ordem Despachada ${orderShortId} — LaRomme`,
          html: `
            <div style="background-color: #050505; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; line-height: 1.6;">
              <div style="max-width: 540px; margin: 0 auto; background: #0c0c0c; border: 1px solid #27272a; padding: 32px;">
                <h1 style="color: #ffffff; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; font-weight: 500;">
                  ENCOMENDA DESPACHADA
                </h1>
                <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 16px;">
                  Saudações, ${firstName}.
                </p>
                <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 24px;">
                  O seu pedido <strong>${orderShortId}</strong> foi conferido, embalado e retirado pelo operador logístico.
                </p>
                ${trackingBlock}
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${trackingUrl}" target="_blank" style="background-color: #ffffff; color: #000000; padding: 12px 24px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">
                    Rastrear Objeto
                  </a>
                </div>
                <p style="color: #71717a; font-size: 11px; margin-bottom: 0;">
                  LaRomme • Logística & Custódia Operacional
                </p>
              </div>
            </div>
          `,
        });

        resendId = emailResponse.data?.id;
      } catch (mailErr) {
        console.error('[ERRO RESEND DESPACHO]:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      shortId: order.short_id,
      resendId,
    });
  } catch (error: any) {
    console.error('Erro interno no despacho:', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno.' }, { status: 500 });
  }
}