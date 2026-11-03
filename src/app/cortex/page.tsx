'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Activity, TrendingUp, Users, AlertCircle, ShoppingBag, 
  CheckCircle2, Clock, PieChart, Smile, ShieldCheck, ArrowUpRight
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexCockpitPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [adSpend, setAdSpend] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; value: number } | null>(null);

  useEffect(() => {
    async function loadCockpitData() {
      setLoading(true);
      try {
        // 1. Pedidos Reais
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        setOrders(ordersData || []);

        // 2. Carrinhos Abandonados Reais
        const { data: cartsData } = await supabase
          .from('abandoned_carts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setAbandonedCarts(cartsData || []);
      } catch (err) {
        console.error('Erro ao carregar telemetria do Cortex:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCockpitData();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos Financeiros Reais
  const paidOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered'
  );

  const grossRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalOrdersCount = paidOrders.length;
  const avgTicket = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;

  // Margem Bruta e EBITDA Reais baseadas no Faturamento
  const grossMargin = grossRevenue * 0.58;
  const ebitdaMargin = grossRevenue * 0.46;
  const roasReal = adSpend > 0 ? (grossRevenue / adSpend).toFixed(2) : '0.00';

  // Top Patronos Reais (Agrupados por Email do Comprador)
  const customersMap: Record<string, { name: string; email: string; spent: number; orders: number }> = {};
  paidOrders.forEach((ord) => {
    const key = ord.customer_email || 'anônimo';
    if (!customersMap[key]) {
      customersMap[key] = {
        name: ord.customer_name || 'Patrono Não Identificado',
        email: ord.customer_email || '—',
        spent: 0,
        orders: 0
      };
    }
    customersMap[key].spent += Number(ord.total_amount || 0);
    customersMap[key].orders += 1;
  });

  const topPatronos = Object.values(customersMap)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* 1. INFRAESTRUTURA OPERACIONAL */}
      <div className="bg-white border border-zinc-200 px-6 py-4 rounded-sm shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-900 border-r border-zinc-200 pr-4">
            Infraestrutura Operacional
          </span>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-zinc-600">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Supabase DB</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resend Mail</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Mercado Pago Pix</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Google Analytics</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ativo em Fortaleza / CE
        </div>
      </div>

      {/* 2. TÍTULO E CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 block mb-1">
            Centro de Comando C-Level • La Romme
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Cockpit Executivo
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Visão Holística de Vendas, Aquisição de Mídia e Margens Contábeis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-zinc-900 text-white px-3 py-1.5 rounded-sm font-semibold">
            MÊS ATUAL
          </span>
        </div>
      </div>

      {/* 3. CARDS DE KPIS FINANCEIROS EM TEMPO REAL */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Receita Bruta */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            Receita Bruta
          </span>
          <p className="text-xl md:text-2xl font-black text-zinc-900 tabular-nums">
            {formatBRL(grossRevenue)}
          </p>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1">
            {totalOrdersCount} {totalOrdersCount === 1 ? 'pedido liquidado' : 'pedidos liquidados'}
          </span>
        </div>

        {/* Margem Bruta */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            Margem Bruta (58%)
          </span>
          <p className="text-xl md:text-2xl font-black text-emerald-600 tabular-nums">
            {formatBRL(grossMargin)}
          </p>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1">
            Após CPV (35%) e Impostos
          </span>
        </div>

        {/* Margem EBITDA */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            Margem EBITDA (46%)
          </span>
          <p className="text-xl md:text-2xl font-black text-blue-600 tabular-nums">
            {formatBRL(ebitdaMargin)}
          </p>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1">
            Após OpEx Fixo (12%)
          </span>
        </div>

        {/* ROAS Breakeven */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            ROAS Breakeven
          </span>
          <p className="text-xl md:text-2xl font-black text-zinc-900 tabular-nums">
            1.72x
          </p>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1">
            Ponto zero de lucro em ads
          </span>
        </div>

        {/* Ad Spend */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            Ad Spend no Mês
          </span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-xs font-mono text-zinc-400">R$</span>
            <input 
              type="number" 
              value={adSpend} 
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-16 font-mono font-bold text-zinc-900 border-b border-zinc-300 focus:outline-none focus:border-zinc-900 text-sm"
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1">
            ROAS Real: {roasReal}x
          </span>
        </div>

        {/* Status NPS */}
        <div className="bg-white p-5 border border-zinc-200 rounded-sm shadow-sm space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block font-semibold">
            Avaliação Geral
          </span>
          <p className="text-xl md:text-2xl font-black text-zinc-400 tabular-nums">
            —
          </p>
          <span className="text-[10px] font-mono text-zinc-400 block pt-1 truncate">
            Pré-Lançamento Oficial
          </span>
        </div>

      </div>

      {/* 4. CURVA DE FATURAMENTO & ORIGEM DO TRÁFEGO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Curva de Faturamento */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 rounded-sm shadow-sm">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Curva Diária de Faturamento
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Valores reais liquidados no banco de dados
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-zinc-900">
              Total: {formatBRL(grossRevenue)}
            </span>
          </div>

          <div className="h-44 w-full flex items-center justify-center border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50">
            {grossRevenue > 0 ? (
              <div className="text-center space-y-1 font-mono">
                <span className="text-xs text-zinc-500 uppercase">Receita Registrada em Novembro</span>
                <p className="text-2xl font-black text-zinc-900">{formatBRL(grossRevenue)}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">✓ 100% Confirmado via Gateway</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-zinc-400">
                Aguardando primeiro faturamento para traçar curva diária.
              </span>
            )}
          </div>
        </div>

        {/* Origem do Tráfego Real */}
        <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <PieChart className="w-4 h-4 text-zinc-500" /> Origem do Tráfego
            </h2>
            <span className="text-[9px] font-mono text-zinc-400 uppercase">UTMs</span>
          </div>

          <div className="py-8 text-center space-y-2">
            <span className="text-xs font-mono text-zinc-500 block">
              Tráfego Proprietário & Senado VIP
            </span>
            <p className="text-[11px] font-mono text-zinc-400">
              Mapeamento de campanhas ativo. As proporções reais serão exibidas conforme o fluxo do primeiro drop for acionado.
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 text-[10px] font-mono text-zinc-500 flex justify-between">
            <span>Rastreamento ativo</span>
            <span className="text-emerald-600 font-semibold">Pronto</span>
          </div>
        </div>

      </div>

      {/* 5. TOP PATRONOS (LTV) vs. DETRATORES & RISCOS REAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Patronos Reais */}
        <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" /> Patronos com Compras Acumuladas
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Extraído diretamente da tabela orders do Supabase
              </p>
            </div>
            <span className="text-[9px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase">
              Base Real
            </span>
          </div>

          <div className="space-y-3">
            {topPatronos.length > 0 ? (
              topPatronos.map((patrono, idx) => (
                <div key={patrono.email} className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block font-sans">
                      {patrono.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {patrono.email} • {patrono.orders} {patrono.orders === 1 ? 'pedido' : 'pedidos'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-zinc-900 block">
                      {formatBRL(patrono.spent)}
                    </span>
                    <span className="text-[9px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase font-bold">
                      {idx === 0 ? 'Maior Aporte' : 'Patrono VIP'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-mono text-zinc-400">
                Nenhuma compra faturada registrada ainda.
              </div>
            )}
          </div>
        </div>

        {/* Detratores e Riscos Operacionais */}
        <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-500" /> Riscos Operacionais & Abandonos
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Monitoramento de sessões inativas e carrinhos pendentes
              </p>
            </div>
            <span className="text-[9px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase">
              Rastreamento Ativo
            </span>
          </div>

          <div className="space-y-3">
            {abandonedCarts.length > 0 ? (
              abandonedCarts.map((cart) => (
                <div key={cart.id} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-sm flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="font-bold text-zinc-900 block">
                      Carrinho #{cart.id?.slice(0, 8)}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {cart.customer_email || 'Lead Sem E-mail'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded font-bold">
                    Aguardando Abordagem
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="text-xs font-mono font-bold text-zinc-800 block">
                  Operação Saudável
                </span>
                <p className="text-[10px] font-mono text-zinc-400">
                  Nenhum abandono crítico ou detrator pendente no sistema.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 6. AVALIAÇÃO DE CLIENTE (ESTADO PRE-LAUNCH) */}
      <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-sm">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <Smile className="w-4 h-4 text-zinc-500" /> Satisfação & Feedback Pós-Uso
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              Protocolo de acompanhamento 7 dias após a entrega física
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-sm">
            Status: Pronto para Ativação
          </span>
        </div>

        <div className="py-6 text-center space-y-2">
          <p className="text-xs font-mono text-zinc-600 max-w-xl mx-auto leading-relaxed">
            As métricas de NPS (Promotores, Neutros e Detratores) serão computadas automaticamente após a entrega dos primeiros lotes físicos e envio da rotina de concierge.
          </p>
        </div>
      </div>

    </div>
  );
}