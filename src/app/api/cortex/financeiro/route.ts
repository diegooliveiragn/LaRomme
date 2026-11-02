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

    // 1. Busca todos os pedidos
    const { data: allOrders, error: allOrdersErr } = await supabase
      .from('orders')
      .select('id, short_id, total_amount, subtotal, status, created_at, shipping_state, customer_name, customer_email')
      .order('created_at', { ascending: false });

    if (allOrdersErr) throw allOrdersErr;

    const orders = allOrders || [];
    const paidOrders = orders.filter((o) =>
      ['approved', 'paid', 'shipped', 'delivered'].includes(o.status)
    );

    // 2. Custos de Fundação (R$ 894,25)
    const startupCosts = {
      inpiIntangible: 500.00,
      domainsInfrastructure: 394.25,
      totalStartup: 894.25
    };

    // 3. Métricas Contábeis
    const grossRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
    const taxSimples = Number((grossRevenue * 0.06).toFixed(2));
    const gatewayPixFee = Number((grossRevenue * 0.0099).toFixed(2)); // Alíquota Pix real: 0,99%
    const cogsTextil = Number((grossRevenue * 0.35).toFixed(2));
    const opexFixo = Number((grossRevenue * 0.12).toFixed(2));

    const netRevenue = Number((grossRevenue - taxSimples - gatewayPixFee).toFixed(2));
    const contributionMargin = Number((netRevenue - cogsTextil).toFixed(2));
    const netProfitEbitda = Number((contributionMargin - opexFixo).toFixed(2));

    const splitReinvestimento = Number((netProfitEbitda * 0.70).toFixed(2));
    const splitProLabore = Number((netProfitEbitda * 0.30).toFixed(2));

    // 4. Saldo em Custódia no Mercado Pago (Líquido retido das vendas)
    const saldoCustodiaCalculado = Number((grossRevenue - gatewayPixFee).toFixed(2));

    let mpBalance = {
      available: saldoCustodiaCalculado,
      unavailable: 0,
      total: saldoCustodiaCalculado,
      connected: Boolean(mpAccessToken),
      source: 'pedidos_liquidados'
    };

    // Tenta consulta bancária direta se houver escopo ativo
    if (mpAccessToken) {
      try {
        const mpRes = await fetch('https://api.mercadopago.com/v1/account/balance', {
          headers: { Authorization: `Bearer ${mpAccessToken}` }
        });
        if (mpRes.ok) {
          const balanceData = await mpRes.json();
          mpBalance = {
            available: Number(balanceData.available_amount || saldoCustodiaCalculado),
            unavailable: Number(balanceData.unavailable_amount || 0),
            total: Number(balanceData.total_amount || saldoCustodiaCalculado),
            connected: true,
            source: 'api_mercadopago_live'
          };
        }
      } catch (mpErr) {
        // Fallback resiliente para a custódia das ordens liquidadas
      }
    }

    return NextResponse.json({
      success: true,
      orders: paidOrders,
      allOrders,
      mpBalance,
      startupCosts,
      accounting: {
        grossRevenue,
        taxSimples,
        gatewayPixFee,
        netRevenue,
        cogsTextil,
        contributionMargin,
        opexFixo,
        netProfitEbitda,
        splitReinvestimento,
        splitProLabore
      }
    });
  } catch (err: any) {
    console.error('Erro na API Financeiro Cortex:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}