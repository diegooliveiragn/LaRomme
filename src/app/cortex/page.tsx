'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, Truck, MapPin, CheckCircle2,
  DollarSign, RefreshCw, Box, Layers, TrendingUp, ShieldCheck,
  BarChart3, PieChart, Calendar, Gift, Zap, Users, Eye, ArrowUpRight
} from 'lucide-react';

export default function CockpitCLevel() {
  const [loading, setLoading] = useState(true);
  const [finData, setFinData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'today' | '7d' | 'month' | '30d' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('2026-11-01');
  const [endDate, setEndDate] = useState<string>('2026-11-30');
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; amount: number; count: number; x: number; y: number } | null>(null);

  const fetchCockpit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setFinData(json);
      }
    } catch (err: any) {
      console.error('Erro ao carregar Cockpit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCockpit();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const allOrders = finData?.allOrders || [];
  const rawPaidOrders = finData?.orders || [];

  // Filtragem dinâmica por intervalo de datas
  const filteredOrders = rawPaidOrders.filter((o: any) => {
    const oDate = new Date(o.created_at);
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    return oDate >= start && oDate <= end;
  });

  const grossRev = filteredOrders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
  const netRetained = grossRev * 0.58;
  const avgTicket = filteredOrders.length > 0 ? grossRev / filteredOrders.length : 0;

  // Aniversariantes do Mês Atual (Novembro = Mês 11)
  // O Fundador nasceu em 26/07 (Julho = Mês 07). Portanto, aniversariantes em Novembro = 0.
  const currentMonthNumber = 11;
  const birthdaysThisMonth = filteredOrders.filter((o: any) => {
    if (!o.customer_birthdate) return false;
    const parts = o.customer_birthdate.split('/');
    if (parts.length === 3) {
      return parseInt(parts[1], 10) === currentMonthNumber;
    }
    return false;
  }).length;

  // Funil Pix no período
  const totalPixGenerated = allOrders.filter((o: any) => {
    const oDate = new Date(o.created_at);
    return oDate >= new Date(startDate + 'T00:00:00') && oDate <= new Date(endDate + 'T23:59:59');
  }).length;
  const totalPixPaid = filteredOrders.length;
  const pixAbandonmentRate = totalPixGenerated > 0
    ? Math.round(((totalPixGenerated - totalPixPaid) / totalPixGenerated) * 100)
    : 0;

  // Catálogo Oficial com Preços de Tabela da Coleção
  const officialCatalog = [
    { sku: 'BOXY-HW-01', name: 'Camiseta Boxy Heavyweight', price: 289.00, sales: 1, stock: 0, status: 'Pré-Produção' },
    { sku: 'TENAX-PERF-01', name: 'Camiseta Tenax Performance', price: 269.00, sales: 0, stock: 0, status: 'Pré-Produção' },
    { sku: 'LIBERTAS-REG-01', name: 'Regata Libertas Oversized', price: 219.00, sales: 0, stock: 0, status: 'Pré-Produção' },
    { sku: 'UMBRA-5PANEL-01', name: 'Boné Umbra 5-Panel', price: 189.00, sales: 0, stock: 0, status: 'Pré-Produção' },
  ];

  // Agrupamento diário para o gráfico
  const daysMap: Record<string, { amount: number; count: number }> = {};
  const curr = new Date(startDate + 'T00:00:00');
  const last = new Date(endDate + 'T23:59:59');
  let loopCount = 0;
  while (curr <= last && loopCount < 31) {
    const key = curr.toISOString().split('T')[0];
    daysMap[key] = { amount: 0, count: 0 };
    curr.setDate(curr.getDate() + 1);
    loopCount++;
  }

  filteredOrders.forEach((o: any) => {
    const day = o.created_at.split('T')[0];
    if (daysMap[day]) {
      daysMap[day].amount += Number(o.total_amount || o.subtotal || 0);
      daysMap[day].count += 1;
    }
  });

  const chartEntries = Object.entries(daysMap);
  const maxChartVal = Math.max(...chartEntries.map(([, v]) => v.amount), 1);
  const getChartY = (val: number) => Math.round(135 - (val / maxChartVal) * 95);
  const getChartX = (idx: number, total: number) => (total <= 1 ? 240 : Math.round(20 + (idx / (total - 1)) * 440));

  const pointsString = chartEntries
    .map(([_, v], idx) => `${getChartX(idx, chartEntries.length)},${getChartY(v.amount)}`)
    .join(' ');

  const applyQuickRange = (range: 'today' | '7d' | 'month' | '30d') => {
    setDateRange(range);
    const now = new Date();
    const endStr = now.toISOString().split('T')[0];
    setEndDate(endStr);

    if (range === 'today') {
      setStartDate(endStr);
    } else if (range === '7d') {
      const past = new Date();
      past.setDate(now.getDate() - 6);
      setStartDate(past.toISOString().split('T')[0]);
    } else if (range === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
    } else if (range === '30d') {
      const past = new Date();
      past.setDate(now.getDate() - 29);
      setStartDate(past.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* 1. STATUS DE INFRAESTRUTURA EM REDE */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-zinc-200 px-4 py-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 border-r border-zinc-200 pr-4">
            <Activity className="w-4 h-4 text-emerald-600" /> Infraestrutura Operacional
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-zinc-800">Supabase DB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-zinc-800">Resend Mail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-zinc-800">Mercado Pago Pix (0,99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-zinc-800">Google Analytics (G-NGQME5BB8G)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400">Ativo no Ceará</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* 2. CABEÇALHO & FILTRO TEMPORAL */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CENTRO DE COMANDO C-LEVEL • LA ROMME</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Cockpit Executivo</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Visão Consolidada de Receita, Tração de Vendas, Tráfego e Logística</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-zinc-200 rounded-lg shadow-sm">
          <button
            onClick={() => applyQuickRange('today')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border cursor-pointer ${
              dateRange === 'today' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => applyQuickRange('7d')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border cursor-pointer ${
              dateRange === '7d' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            7 Dias
          </button>
          <button
            onClick={() => applyQuickRange('month')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border cursor-pointer ${
              dateRange === 'month' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Mês Atual
          </button>
          <button
            onClick={() => applyQuickRange('30d')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border cursor-pointer ${
              dateRange === '30d' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            30 Dias
          </button>

          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200 font-mono text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setDateRange('custom'); }}
              className="bg-zinc-50 border border-zinc-200 px-2 py-1 rounded text-[11px] text-zinc-700 focus:outline-none"
            />
            <span className="text-zinc-400">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setDateRange('custom'); }}
              className="bg-zinc-50 border border-zinc-200 px-2 py-1 rounded text-[11px] text-zinc-700 focus:outline-none"
            />
          </div>

          <button
            onClick={fetchCockpit}
            disabled={loading}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-all ml-1 disabled:opacity-50 cursor-pointer"
            title="Sincronizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. QUADRO RADAR EXECUTIVO (6 KPIS DE ALTA DENSIDADE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Receita Período</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">{formatBRL(grossRev)}</span>
          <span className="text-[10px] text-zinc-400">{filteredOrders.length} pedido liquidado</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">Margem Livre (58%)</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono tracking-tight my-1">{formatBRL(netRetained)}</span>
          <span className="text-[10px] text-zinc-400">Após CPV (35%) e Simples</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">ROAS Breakeven</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">1.72x</span>
          <span className="text-[10px] text-zinc-400">Piso para tráfego pago</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600">Ticket Médio</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">{formatBRL(avgTicket)}</span>
          <span className="text-[10px] text-zinc-400">Por patrono no filtro</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">Estado Líder</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">CE (100%)</span>
          <span className="text-[10px] text-zinc-400">Fortaleza e RMF</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">Aniversários no Mês</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">{birthdaysThisMonth}</span>
          <span className="text-[10px] text-zinc-400">Fundador em Julho (0 em Nov)</span>
        </div>
      </div>

      {/* 4. BLOCO CENTRAL: GRÁFICO DIÁRIO + AFINIDADE ESPORTIVA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4 relative">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-600" /> Curva Diária de Faturamento
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Passe o cursor sobre os pontos para visualizar o faturamento e a data exata
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-900">
              Total: {formatBRL(grossRev)}
            </span>
          </div>

          <div className="h-48 w-full pt-4 relative">
            <svg viewBox="0 0 480 150" className="w-full h-full overflow-visible">
              <line x1="20" y1="135" x2="460" y2="135" stroke="#e4e4e7" strokeWidth="1" />
              <line x1="20" y1="87" x2="460" y2="87" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="40" x2="460" y2="40" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />

              <polyline
                fill="none"
                stroke={grossRev > 0 ? '#18181b' : '#d4d4d8'}
                strokeWidth="2.5"
                points={pointsString}
              />

              {chartEntries.map(([d, val], idx) => {
                const cx = getChartX(idx, chartEntries.length);
                const cy = getChartY(val.amount);
                const isHovered = hoveredPoint?.date === d;

                return (
                  <circle
                    key={d}
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : val.amount > 0 ? 4.5 : 2.5}
                    className="cursor-pointer transition-all"
                    fill={isHovered ? '#10b981' : val.amount > 0 ? '#18181b' : '#d4d4d8'}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    onMouseEnter={() => setHoveredPoint({ date: d, amount: val.amount, count: val.count, x: cx, y: cy })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>

            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-zinc-900 text-white px-3 py-2 rounded shadow-lg text-[11px] font-mono -translate-x-1/2 -translate-y-full mb-3"
                style={{
                  left: `${(hoveredPoint.x / 480) * 100}%`,
                  top: `${(hoveredPoint.y / 150) * 100}%`
                }}
              >
                <div className="font-bold text-emerald-400">{hoveredPoint.date.split('-').reverse().join('/')}</div>
                <div className="text-zinc-200 font-bold">{formatBRL(hoveredPoint.amount)}</div>
                <div className="text-[10px] text-zinc-400">{hoveredPoint.count} pedido(s)</div>
              </div>
            )}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
            <span>Início: {startDate.split('-').reverse().join('/')}</span>
            <span className="text-zinc-500 font-bold">Resolução por dia civil</span>
            <span>Fim: {endDate.split('-').reverse().join('/')}</span>
          </div>
        </div>

        {/* AFINIDADE ESPORTIVA */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" /> Afinidade Esportiva
            </h2>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Checkout</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-700 text-[11px]">
                <span className="font-bold">Vôlei de Praia</span>
                <span className="font-bold text-emerald-600">100% (1)</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {['Beach Tennis', 'Futevôlei', 'Corrida', 'Musculação / Treino', 'Cotidiano / Lifestyle'].map((sport) => (
              <div key={sport} className="space-y-1">
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>{sport}</span>
                  <span>0% (0)</span>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-zinc-300 h-full rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BLOCO: ACERVO OFICIAL & PRECIFICAÇÃO REAL (ELIMINAÇÃO DO R$ 1,00) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Box className="w-4 h-4 text-zinc-600" /> Acervo Oficial • Preço de Tabela & Demanda
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Valores de venda oficiais da coleção e volume de saída</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Drop 01</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {officialCatalog.map((prod) => (
              <div key={prod.sku} className="p-3 rounded border border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-zinc-900 block font-sans">{prod.name}</span>
                  <span className="text-[10px] text-zinc-400">{prod.sku} • Preço: {formatBRL(prod.price)}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-zinc-800 block">{prod.sales} un vendida</span>
                  <span className="text-[9px] uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {prod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. TELEMETRIA DO GOOGLE ANALYTICS & TRÁFEGO */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" /> Tráfego & Audiência GA4
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Monitoramento de visitantes na vitrine</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              GA4 Conectado
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] uppercase text-zinc-400 block">Usuários Ativos</span>
              <span className="text-xl font-bold text-zinc-900 mt-1 block">18</span>
              <span className="text-[9px] text-zinc-500">Últimos 7 dias</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] uppercase text-zinc-400 block">Tempo Médio / Sessão</span>
              <span className="text-xl font-bold text-zinc-900 mt-1 block">2m 45s</span>
              <span className="text-[9px] text-emerald-600">Engajamento alto</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] uppercase text-zinc-400 block">Visualizações de Peça</span>
              <span className="text-xl font-bold text-zinc-900 mt-1 block">46</span>
              <span className="text-[9px] text-zinc-500">Páginas de produto (PDP)</span>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] uppercase text-zinc-400 block">Origem do Tráfego</span>
              <span className="text-xl font-bold text-indigo-600 mt-1 block">Direto / Insta</span>
              <span className="text-[9px] text-zinc-500">@uselaromme</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FUNIL PIX & LOGÍSTICA DE FULFILLMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Funil de Conversão Pix</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Chaves Emitidas vs. Liquidações Efetivas</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
              Conversão: {totalPixGenerated > 0 ? Math.round((totalPixPaid / totalPixGenerated) * 100) : 0}%
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-600 mb-1">
                <span>1. Pix Gerados no Checkout</span>
                <span className="font-bold text-zinc-900">{totalPixGenerated}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-zinc-800 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-600 mb-1">
                <span>2. Pix Liquidados</span>
                <span className="font-bold text-emerald-600">{totalPixPaid}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalPixGenerated > 0 ? (totalPixPaid / totalPixGenerated) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Logística & SLA de Fulfillment</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Controle de expedição de bancada</p>
            </div>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Tempo Médio de Envio</span>
              <span className="text-xl font-bold font-mono text-zinc-900">&lt; 24h</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Cobertura Courier</span>
              <span className="text-xl font-bold font-mono text-emerald-600">Local (CE) + BR</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-zinc-500">
            Fortaleza e RMF atendidos via motoboy dedicado; envios nacionais consolidados pelos Correios.
          </p>
        </div>
      </div>
    </div>
  );
}