'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Activity, DollarSign, Package, TrendingUp, RefreshCw, CheckCircle2,
  MapPin, BarChart3, PieChart, ShieldAlert, Timer
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CockpitCLevel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCockpitData = async () => {
    setLoading(true);
    try {
      const { data: ords } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      setOrders(ords || []);
    } catch (err: any) {
      console.error('Erro ao consultar dados no Cockpit:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCockpitData();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Pedidos liquidados e em esteira
  const paidOrders = orders.filter(
    (o) => ['paid', 'approved', 'shipped', 'delivered'].includes(o.status) || o.status === 'shipped' || o.status === 'delivered'
  );
  const inFulfillmentOrders = orders.filter((o) => ['paid', 'approved', 'shipped', 'delivered'].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered');

  // Métricas principais
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const taxaConversao = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

  // 1. Runway Real: 50% de retenção líquida sobre o faturamento real / custo mensal base
  const burnRateMensal = 2400;
  const caixaReal = totalRevenue * 0.50;
  const runwayMeses = totalRevenue > 0 ? (caixaReal / burnRateMensal).toFixed(1) : '0.0';

  // 2. Velocidade Real de Fulfillment (calculado apenas se houver despachos reais)
  let avgFulfillmentHours = '—';
  if (deliveredOrders.length > 0) {
    const totalDiffHours = deliveredOrders.reduce((acc, o) => {
      const start = new Date(o.created_at).getTime();
      const end = o.updated_at ? new Date(o.updated_at).getTime() : start;
      const diff = Math.max(0, (end - start) / (1000 * 60 * 60));
      return acc + diff;
    }, 0);
    avgFulfillmentHours = (totalDiffHours / deliveredOrders.length).toFixed(1) + 'h';
  }

  // 3. Decomposição Real do Faturamento
  const lucroLivreReal = totalRevenue * 0.50;
  const custosOperacionaisReal = totalRevenue * 0.50;

  // 4. Curva de Vendas Semanal Real
  // Divide os pedidos pagos nos últimos 28 dias em 4 semanas
  const now = new Date().getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyActual = [0, 0, 0, 0];

  paidOrders.forEach((o) => {
    const orderTime = new Date(o.created_at).getTime();
    const diffWeeks = Math.floor((now - orderTime) / weekMs);
    if (diffWeeks >= 0 && diffWeeks < 4) {
      const weekIndex = 3 - diffWeeks; // 0 = Semana 1, 3 = Semana Atual
      weeklyActual[weekIndex] += Number(o.total_amount || 0);
    }
  });

  const maxVal = Math.max(...weeklyActual, 1);
  const getY = (val: number) => {
    if (val === 0) return 140; // Linha de base no fundo do SVG
    return Math.round(140 - (val / maxVal) * 110);
  };

  const svgActualPoints = `10,${getY(weeklyActual[0])} 160,${getY(weeklyActual[1])} 320,${getY(weeklyActual[2])} 490,${getY(weeklyActual[3])}`;

  // 5. Distribuição Geográfica Real
  const stateDistribution: Record<string, number> = {};
  paidOrders.forEach((o) => {
    const uf = o.shipping_state?.toUpperCase() || 'SP';
    stateDistribution[uf] = (stateDistribution[uf] || 0) + 1;
  });

  const sortedStates = Object.entries(stateDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* STATUS DO SISTEMA */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-zinc-200 px-5 py-3.5 rounded-xl shadow-2xs">
        <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center gap-2 border-r border-zinc-200 pr-4">
          <Activity className="w-4 h-4 text-emerald-600" /> Infraestrutura
        </span>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Supabase DB</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Resend Mail</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Mercado Pago Pix</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Vercel Edge</span>
        </div>
      </div>

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Centro de Comando • Visão Consolidada
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Cockpit Executivo
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Monitoramento de Faturamento, Comparativo Temporal e Penetração Geográfica
          </p>
        </div>

        <button
          onClick={fetchCockpitData}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Indicadores</span>
        </button>
      </div>

      {/* KPIS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Receita Liquidada
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(totalRevenue)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Base: {paidOrders.length} liquidações reais
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Ticket Médio Real
            </span>
            <TrendingUp className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(avgTicket)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Média por patrono
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-700">
              Na Bancada de Galpão
            </span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tight block font-mono">
            {inFulfillmentOrders.length}
          </span>
          <span className="text-xs font-bold text-amber-800/80 mt-2 block">
            Pedidos aguardando envio
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Conversão Checkout
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {taxaConversao}%
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            {paidOrders.length} pagos de {orders.length} gerados
          </span>
        </div>

      </div>

      {/* METRICAS ANALÍTICAS REAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RUNWAY OPERACIONAL */}
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" /> Runway de Sobrevivência
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Burn Rate: R$ 2.4k/mês</span>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 font-mono tabular-nums">{runwayMeses} meses</span>
            <p className="text-xs font-bold text-zinc-500 mt-1">
              {totalRevenue > 0
                ? 'Calculado com base no caixa líquido retido das vendas.'
                : 'Aguardando primeiros faturamentos para projeção de caixa.'}
            </p>
          </div>
        </div>

        {/* SLA DE FULFILLMENT */}
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-zinc-600" /> Velocidade de Fulfillment
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Meta: &lt; 24h</span>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 font-mono tabular-nums">{avgFulfillmentHours}</span>
            <p className="text-xs font-bold text-zinc-500 mt-1">
              {deliveredOrders.length > 0
                ? 'Média histórica do pagamento à emissão da etiqueta.'
                : 'Sem despachos postais computados na base.'}
            </p>
          </div>
        </div>

        {/* DECOMPOSIÇÃO DO FATURAMENTO REAL */}
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-zinc-600" /> Decomposição Contábil
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Rateio Operacional</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-600">
              <span>Lucro Líquido Retido (50%)</span>
              <span className="font-bold text-emerald-700">{formatBRL(lucroLivreReal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 text-[11px]">
              <span>CPV Confecção + Gateway/Fisco (50%)</span>
              <span>{formatBRL(custosOperacionaisReal)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* CURVA TEMPORAL & RANKING GEOGRÁFICO REAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO DINÂMICO BASEADO EM VENDAS REAIS */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-600" /> Curva de Vendas Real (Últimos 28 Dias)
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                {totalRevenue > 0
                  ? 'Faturamento agregado por semana operacional'
                  : 'Aguardando liquidação dos primeiros pedidos no checkout'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-zinc-900">
                <span className="w-3 h-0.5 bg-zinc-900 inline-block" /> Faturamento
              </span>
            </div>
          </div>

          <div className="h-48 w-full pt-4 flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              {/* Linha guia de base */}
              <line x1="10" y1="140" x2="490" y2="140" stroke="#f4f4f5" strokeWidth="1" />
              
              {/* Traçado das 4 semanas reais */}
              <polyline
                fill="none"
                stroke={totalRevenue > 0 ? '#18181b' : '#d4d4d8'}
                strokeWidth="2.5"
                points={svgActualPoints}
              />
              <circle cx="10" cy={getY(weeklyActual[0])} r="3.5" fill={totalRevenue > 0 ? '#18181b' : '#d4d4d8'} />
              <circle cx="160" cy={getY(weeklyActual[1])} r="3.5" fill={totalRevenue > 0 ? '#18181b' : '#d4d4d8'} />
              <circle cx="320" cy={getY(weeklyActual[2])} r="3.5" fill={totalRevenue > 0 ? '#18181b' : '#d4d4d8'} />
              <circle cx="490" cy={getY(weeklyActual[3])} r="4" fill={totalRevenue > 0 ? '#18181b' : '#a1a1aa'} />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
            <span>Semana 1 ({formatBRL(weeklyActual[0])})</span>
            <span>Semana 2 ({formatBRL(weeklyActual[1])})</span>
            <span>Semana 3 ({formatBRL(weeklyActual[2])})</span>
            <span className="font-bold text-zinc-700">Semana 4 - Atual ({formatBRL(weeklyActual[3])})</span>
          </div>
        </div>

        {/* RANKING GEOGRÁFICO POR ESTADO REAL */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2 border-b border-zinc-100 pb-4">
            <MapPin className="w-4 h-4 text-zinc-600" /> Distribuição por Estado
          </h2>

          <div className="space-y-3">
            {sortedStates.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-400">
                Aguardando primeiras entregas para mapeamento regional...
              </div>
            ) : (
              sortedStates.map(([uf, count], idx) => (
                <div key={uf} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-mono">
                  <span className="font-bold text-zinc-900 flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">#{idx + 1}</span> {uf}
                  </span>
                  <span className="font-bold text-zinc-600">{count} pedidos</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}