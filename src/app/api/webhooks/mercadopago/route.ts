import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// O Resend exige uma chave, se não tiver, roda silenciosamente
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (id && process.env.MERCADOPAGO_ACCESS_TOKEN) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
      });
      const mpData = await mpRes.json();

      if (mpData.status === 'approved') {
        const orderNumber = mpData.external_reference;
        const { data: order } = await supabase.from('orders').select('*').eq('order_number', orderNumber).single();
        
        if (order && order.payment_status === 'PENDENTE') {
          // 1. ATUALIZA O PEDIDO PARA PAGO
          await supabase.from('orders').update({ payment_status: 'PAGO' }).eq('id', order.id);
          
          // 2. BAIXA DE ESTOQUE (PRODUTO 01)
          const { data: prod } = await supabase.from('products').select('id, stock').eq('sku_code', 'BOXY-BLK-M').single();
          if (prod && prod.stock > 0) {
            await supabase.from('products').update({ stock: prod.stock - 1 }).eq('id', prod.id);
          }

          // 3. EMISSÃO DO SERIAL GRAVADO
          const serialCode = `LR-D00-BOXY-${Math.floor(1000 + Math.random() * 9000)}`;
          await supabase.from('serialized_items').insert([{
            serial_code: serialCode,
            customer_id: order.customer_id,
            order_id: order.id,
            size: 'M'
          }]);

          // 4. BUSCA DADOS DO CLIENTE PARA O E-MAIL
          const { data: customer } = await supabase.from('customers').select('email, full_name').eq('id', order.customer_id).single();

          // 5. DISPARO DO RECIBO TRANSACIONAL DE LUXO
          if (customer && process.env.RESEND_API_KEY) {
            await resend.emails.send({
              from: 'LaRomme <onboarding@resend.dev>', // E-mail de testes da plataforma
              to: customer.email,
              subject: `[LaRomme] Aquisição Confirmada - Serial ${serialCode}`,
              html: `
                <div style="background-color: #050505; color: #ffffff; font-family: Helvetica, Arial, sans-serif; padding: 40px; text-transform: uppercase; letter-spacing: 1px;">
                  <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin-bottom: 5px; letter-spacing: 4px;">LaRomme.</h1>
                  <p style="font-size: 10px; color: #a1a1aa; margin-top: 0; letter-spacing: 2px;">Recibo de Liquidação</p>
                  
                  <hr style="border: none; border-top: 1px solid #27272a; margin: 30px 0;" />
                  
                  <p style="font-size: 11px; margin-bottom: 20px;">Saudações, ${customer.full_name}.</p>
                  <p style="font-size: 11px; color: #d4d4d8; line-height: 1.6;">O seu artefato do Lote Zero foi assegurado e liberado do cofre. A sua credencial no Senado VIP foi atualizada com o código de série exclusivo gravado na peça.</p>
                  
                  <div style="background-color: #0a0a0a; border: 1px solid #27272a; padding: 20px; margin: 30px 0;">
                    <p style="font-size: 10px; color: #71717a; margin: 0 0 10px 0;">Documento: <span style="color: #ffffff;">${orderNumber}</span></p>
                    <p style="font-size: 10px; color: #71717a; margin: 0;">Serial Code: <span style="color: #34d399; font-weight: bold;">${serialCode}</span></p>
                  </div>
                  
                  <p style="font-size: 10px; color: #71717a; margin-top: 40px; letter-spacing: 2px;">A força de Roma. O movimento de Fortaleza.</p>
                  <p style="font-size: 9px; color: #52525b; margin-top: 10px;">Fortaleza &bull; CE</p>
                </div>
              `
            });
          }
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no Webhook' }, { status: 500 });
  }
}