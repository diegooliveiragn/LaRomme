export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Busca todos os pedidos homologados/pagos
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, short_id, total_amount, subtotal, status, created_at')
      .in('status', ['approved', 'paid', 'shipped', 'delivered'])
      .order('created_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    // 2. Consulta Saldo em Conta no Mercado Pago
    let mpBalance = {
      available: 0,
      unavailable: 0,
      total: 0,
      connected: false
    };

    if (mpAccessToken) {
      try {
        const mpRes = await fetch('https://api.mercadopago.com/v1/account/balance', {
          headers: { Authorization: `Bearer ${mpAccessToken}` }
        });
        if (mpRes.ok) {
          const balanceData = await mpRes.json();
          mpBalance = {
            available: Number(balanceData.available_amount || balanceData.total_amount || 0),
            unavailable: Number(balanceData.unavailable_amount || 0),
            total: Number(balanceData.total_amount || 0),
            connected: true
          };
        }
      } catch (mpErr) {
        console.warn('[AVISO] Falha ao consultar saldo MP:', mpErr);
      }
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      mpBalance
    });
  } catch (err: any) {
    console.error('Erro na API Financeiro Cortex:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}