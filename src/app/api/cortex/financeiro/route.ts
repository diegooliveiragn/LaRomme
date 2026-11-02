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

    // 1. Busca todos os pedidos do sistema (para funil e conversão)
    const { data: allOrders, error: allOrdersErr } = await supabase
      .from('orders')
      .select('id, short_id, total_amount, subtotal, status, created_at, shipping_state, customer_name, customer_email')
      .order('created_at', { ascending: false });

    if (allOrdersErr) throw allOrdersErr;

    const orders = allOrders || [];
    const paidOrders = orders.filter((o) =>
      ['approved', 'paid', 'shipped', 'delivered'].includes(o.status)
    );

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

    // 3. Custos de Fundação / Pré-Operacionais Reais
    const startupCosts = {
      inpiIntangible: 500.00, // Ativo Não Circulante (Marca)
      domainsInfrastructure: 394.25, // .com.br (R$ 129,99) + .club, .xyz, .net, .store (R$ 264,26)
      totalStartup: 894.25
    };

    // 4. Métricas Contábeis Consolidadas
    const grossRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
    const taxSimples = Number((grossRevenue * 0.06).toFixed(2));
    const gatewayPixFee = Number((grossRevenue * 0.0099).toFixed(2)); // Alíquota Real MP: 0,99%
    const cogsTextil = Number((grossRevenue * 0.35).toFixed(2)); // CMV Têxtil ~35%
    const opexFixo = Number((grossRevenue * 0.12).toFixed(2)); // Despesas Operacionais e Nuvem ~12%

    const netRevenue = Number((grossRevenue - taxSimples - gatewayPixFee).toFixed(2));
    const contributionMargin = Number((netRevenue - cogsTextil).toFixed(2));
    const netProfitEbitda = Number((contributionMargin - opexFixo).toFixed(2));

    // Regra de Ouro (70% Reinvestimento Acervo / 30% Pró-Labore Fundador)
    const splitReinvestimento = Number((netProfitEbitda * 0.70).toFixed(2));
    const splitProLabore = Number((netProfitEbitda * 0.30).toFixed(2));

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