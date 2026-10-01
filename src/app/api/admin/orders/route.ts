import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Banco de dados inacessível.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pedidos admin:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar pedidos.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Erro na API admin:', error);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status, trackingCode } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'ID do pedido é obrigatório.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (trackingCode !== undefined) updatePayload.tracking_code = trackingCode;

    const { data: order, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select('*, order_items(*)')
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, error: 'Erro ao atualizar pedido.' }, { status: 500 });
    }

    // DISPARO DE E-MAIL SE CÓDIGO DE RASTREIO FOI ADICIONADO OU ALTERADO PARA ENVIADO
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && (trackingCode || status === 'shipped')) {
      const resend = new Resend(resendApiKey);
      const trackingText = trackingCode ? `Código de rastreamento: ${trackingCode}` : 'Sua encomenda está a caminho.';
      
      const emailHtml = `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000; background-color: #fff;">
          <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-family: Georgia, serif; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">LaRomme</h1>
          </div>
          <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Olá, ${order.customer_name.split(' ')[0]}.</p>
          <p style="font-size: 14px; line-height: 1.6;">A sua encomenda <strong>#${order.short_id}</strong> foi despachada!</p>
          
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center; margin: 30px 0; font-weight: bold; letter-spacing: 2px;">
            <p style="margin: 0 0 10px 0;">ENCOMENDA EM TRÂNSITO</p>
            <p style="font-size: 12px; font-weight: normal; color: #ccc; margin: 0;">${trackingText}</p>
          </div>

          <div style="margin: 40px 0; text-align: center;">
            <a href="https://www.laromme.com.br/pedido/${order.id}" style="display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
              Rastrear Pedido
            </a>
          </div>
        </div>
      `;

      resend.emails.send({
        from: 'LaRomme <pedidos@laromme.com.br>',
        to: order.customer_email,
        subject: `Encomenda Despachada - Pedido #${order.short_id}`,
        html: emailHtml,
      }).catch(err => console.error('Erro ao enviar e-mail de envio:', err));
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500 });
  }
}