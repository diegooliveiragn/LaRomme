'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, Truck, MapPin, CheckCircle2,
  DollarSign, RefreshCw, Box, Layers, TrendingUp, ShieldCheck,
  BarChart3, PieChart, Calendar, ChevronDown
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

  // Funil Pix filtrado
  const totalPixGenerated = allOrders.filter((o: any) => {
    const oDate = new Date(o.created_at);
    return oDate >= new Date(startDate + 'T00:00:00') && oDate <= new Date(endDate + 'T23:59:59');
  }).length;
  const totalPixPaid = filteredOrders.length;
  const pixAbandonmentRate = totalPixGenerated > 0
    ? Math.round(((totalPixGenerated - totalPixPaid) / totalPixGenerated) * 100)
    : 0;

  // Agrupamento diário para o gráfico
  const daysMap: Record<string, { amount: number; count: number }> = {};
  
  // Inicializa os dias do intervalo (limite máximo de 31 dias visíveis)
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
  const getChartX = (idx: number, total: number) => {
    if (total <= 1) return 240;
    return Math.round(20 + (idx / (total - 1)) * 440);
  };

  const pointsString = chartEntries
    .map(([_, v], idx) => `${getChartX(idx, chartEntries.length)},${getChartY(v.amount)}`)
    .join(' ');

  // Seletor rápido de intervalo
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
      {/* INFRAESTRUTURA OPERACIONAL */}
      <div className="flex flex-wrap items-center gap-4 bg-white border border-zinc-200 px-4 py-3 rounded-lg shadow-sm">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 border-r border-zinc-200 pr-4">
          <Activity className="w-4 h-4 text-emerald-600" /> Infraestrutura Operacional
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-zinc-800">Supabase DB</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-zinc-800">Resend Mail</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-zinc-800">Mercado Pago Pix (0,99%)</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-zinc-800">Vercel Edge</span>
        </div>
      </div>

      {/* CABEÇALHO & FILTRO TEMPORAL */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CENTRO DE COMANDO • VISÃO CONSOLIDADA</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Cockpit Executivo</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Painel Analítico de Faturamento, Tração e Dinâmica de Vendas</p>
        </div>

        {/* CONTROLES DE FILTRO DE DATA */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-zinc-200 rounded-lg shadow-sm">
          <button
            onClick={() => applyQuickRange('today')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border ${
              dateRange === 'today' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => applyQuickRange('7d')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border ${
              dateRange === '7d' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            7 Dias
          </button>
          <button
            onClick={() => applyQuickRange('month')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border ${
              dateRange === 'month' ? 'bg-zinc-900 text-white border-zinc-900 font-bold' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Mês Atual
          </button>
          <button
            onClick={() => applyQuickRange('30d')}
            className={`px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded border ${
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
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-all ml-1 disabled:opacity-50"
            title="Sincronizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* TOP RADAR: SAÚDE DO CAIXA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Receita no Período</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(grossRev)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">{filteredOrders.length} {filteredOrders.length === 1 ? 'ordem liquidada' : 'ordens liquidadas'}</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Margem Retida (58%)</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">{formatBRL(netRetained)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Livre após CPV (35%) e Impostos</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">ROAS Breakeven</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">1.72x</div>
          <p className="text-[11px] text-zinc-400 mt-1">Ponto de equilíbrio para tráfego pago</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Ticket Médio</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgTicket)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Média por patrono no filtro</p>
        </div>
      </div>

      {/* BLOCO CENTRAL: GRÁFICO DINÂMICO COM HOVER DE DATA REAL + MIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRÁFICO DIÁRIO COM TOOLTIP */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4 relative">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-600" /> Curva Diária de Vendas
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Passar o mouse sobre os pontos revela a data e o faturamento específico
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-900">
              Total: {formatBRL(grossRev)}
            </span>
          </div>

          {/* ÁREA DO GRÁFICO SVG COM TOOLTIP INTERATIVO */}
          <div className="h-48 w-full pt-4 relative">
            <svg viewBox="0 0 480 150" className="w-full h-full overflow-visible">
              <line x1="20" y1="135" x2="460" y2="135" stroke="#e4e4e7" strokeWidth="1" />
              <line x1="20" y1="87" x2="460" y2="87" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="40" x2="460" y2="40" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />

              {/* Traçado contínuo */}
              <polyline
                fill="none"
                stroke={grossRev > 0 ? '#18181b' : '#d4d4d8'}
                strokeWidth="2.5"
                points={pointsString}
              />

              {/* Pontos interativos com hover */}
              {chartEntries.map(([d, val], idx) => {
                const cx = getChartX(idx, chartEntries.length);
                const cy = getChartY(val.amount);
                const isHovered = hoveredPoint?.date === d;

                return (
                  <g key={d}>
                    <circle
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
                  </g>
                );
              })}
            </svg>

            {/* BALÃO FLUTUANTE (TOOLTIP) */}
            {hoveredPoint && (
              <div
                className="absolute z-20 pointer-events-none bg-zinc-900 text-white px-3 py-2 rounded shadow-lg text-[11px] font-mono -translate-x-1/2 -translate-y-full mb-3"
                style={{
                  left: `${(hoveredPoint.x / 480) * 100}%`,
                  top: `${(hoveredPoint.y / 150) * 100}%`
                }}
              >
                <div className="font-bold text-emerald-400">
                  {hoveredPoint.date.split('-').reverse().join('/')}
                </div>
                <div className="text-zinc-200 font-bold">{formatBRL(hoveredPoint.amount)}</div>
                <div className="text-[10px] text-zinc-400">{hoveredPoint.count} {hoveredPoint.count === 1 ? 'pedido' : 'pedidos'}</div>
              </div>
            )}
          </div>

          {/* RÓTULOS DOS DIAS */}
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
            <span>Início: {startDate.split('-').reverse().join('/')}</span>
            <span className="text-zinc-500 font-bold">Interação ativa por dia</span>
            <span>Fim: {endDate.split('-').reverse().join('/')}</span>
          </div>
        </div>

        {/* MIX ESPORTIVO */}
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

      {/* FUNIL PIX & MATRIZ WMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Funil de Conversão Pix</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Chaves Geradas vs. Pagamentos no Período</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
              Taxa: {totalPixGenerated > 0 ? Math.round((totalPixPaid / totalPixGenerated) * 100) : 0}%
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-600 mb-1">
                <span>1. Pix Gerados</span>
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

        <div className="lg:col-span-6 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Matriz WMS • Acervo Ativo</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Disponibilidade física para os 4 artefatos oficiais</p>
            </div>
            <Box className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { name: 'Camiseta Boxy Heavyweight', sku: 'BOXY-HW-01', stock: '0 un', status: 'Pré-Produção' },
              { name: 'Camiseta Tenax Performance', sku: 'TENAX-PERF-01', stock: '0 un', status: 'Pré-Produção' },
              { name: 'Regata Libertas Oversized', sku: 'LIBERTAS-REG-01', stock: '0 un', status: 'Pré-Produção' },
              { name: 'Boné Umbra 5-Panel', sku: 'UMBRA-5PANEL-01', stock: '0 un', status: 'Pré-Produção' }
            ].map((prod) => (
              <div key={prod.sku} className="p-2.5 rounded border border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <div>
                  <span className="font-bold text-zinc-900 block">{prod.name}</span>
                  <span className="text-[10px] text-zinc-400">{prod.sku}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-zinc-800 block">{prod.stock}</span>
                  <span className="text-[9px] uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {prod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}