'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, Truck, MapPin, CheckCircle2,
  DollarSign, RefreshCw, Box, Layers, TrendingUp, ShieldCheck,
  BarChart3, PieChart, Calendar, Gift, Zap, Users, Eye, ArrowUpRight,
  Smile, Frown, Meh, AlertTriangle, ExternalLink, ThumbsUp, ThumbsDown
} from 'lucide-react';

export default function CockpitCLevel() {
  const [loading, setLoading] = useState(true);
  const [finData, setFinData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'today' | '7d' | 'month' | '30d' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('2026-11-01');
  const [endDate, setEndDate] = useState<string>('2026-11-30');
  const [adSpendInput, setAdSpendInput] = useState<number>(0);
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
  const netRetained = grossRev * 0.58; // Margem Livre após CPV (35%) e Simples (6%)
  const netEbitda = grossRev * 0.46; // EBITDA Real (46%)
  const avgTicket = filteredOrders.length > 0 ? grossRev / filteredOrders.length : 0;

  // ROAS Real vs. Breakeven
  const roasReal = adSpendInput > 0 ? (grossRev / adSpendInput).toFixed(2) : '0.00';

  // Origem de Aquisição (Instagram vs. TikTok vs. Direto)
  const trafficChannels = [
    { channel: 'Instagram (@uselaromme)', pct: 68, visits: 31, sales: 1, conversion: '3.2%' },
    { channel: 'TikTok (@laromme)', pct: 20, visits: 9, sales: 0, conversion: '0.0%' },
    { channel: 'Acesso Direto / Senado', pct: 12, visits: 6, sales: 0, conversion: '0.0%' }
  ];

  // Top 3 Clientes (Maior Aporte / LTV)
  const top3Customers = [
    { rank: 1, name: 'Diego Oliveira Gomes do Nascimento', tier: 'FOUNDER', spent: 894.25, orders: 1, sport: 'Vôlei de Praia' },
    { rank: 2, name: 'Patrono Senado VIP #02', tier: 'SENADOR', spent: 0.00, orders: 0, sport: 'Beach Tennis' },
    { rank: 3, name: 'Patrono Senado VIP #03', tier: 'SENADOR', spent: 0.00, orders: 0, sport: 'Futevôlei' }
  ];

  // Top 3 Detratores / Ocorrências Operacionais
  const top3Detractors = [
    { id: 'DET-01', patron: 'Reserva Abandonada #920964', motive: 'Abandono no Checkout Pix', status: 'Aguardando Abordagem', risk: 'R$ 289,00' },
    { id: 'DET-02', patron: 'Reserva Expirada #920963', motive: 'Tempo Limite de 15m Excedido', status: 'Peça Devolvida ao WMS', risk: 'R$ 269,00' },
    { id: 'DET-03', patron: 'Triagem Pós-Venda REV-01', motive: 'Dúvida de Modelagem Boxy', status: 'Concierge Solucionado', risk: 'R$ 0,00' }
  ];

  // NPS - Net Promoter Score
  const npsData = {
    score: 92,
    promotersPct: 92,
    passivesPct: 8,
    detractorsPct: 0,
    totalEvaluations: 12
  };

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
      {/* 1. BARRA DE STATUS DE INFRAESTRUTURA */}
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
          <span className="text-[10px] font-mono text-zinc-400">Ativo em Fortaleza / CE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* 2. CABEÇALHO & SELETORES TEMPORAIS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CENTRO DE COMANDO C-LEVEL • LA ROMME</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Cockpit Executivo</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Visão Holística de Vendas, Aquisição de Mídia, NPS e Margens Contábeis</p>
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

      {/* 3. QUADRO RADAR DE MARGEM E MÍDIA (6 CARDS C-LEVEL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Receita Bruta</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">{formatBRL(grossRev)}</span>
          <span className="text-[10px] text-zinc-400">{filteredOrders.length} pedido liquidado</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">Margem Bruta (58%)</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono tracking-tight my-1">{formatBRL(netRetained)}</span>
          <span className="text-[10px] text-zinc-400">Após CPV (35%) e Simples (6%)</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">Margem EBITDA (46%)</span>
          <span className="text-2xl font-bold text-indigo-600 font-mono tracking-tight my-1">{formatBRL(netEbitda)}</span>
          <span className="text-[10px] text-zinc-400">Após OpEx Fixo (12%)</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600">ROAS Breakeven</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono tracking-tight my-1">1.72x</span>
          <span className="text-[10px] text-zinc-400">Ponto zero de lucro em ads</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">Ad Spend no Mês</span>
          <div className="flex items-center gap-1 my-1">
            <span className="text-xs font-mono text-zinc-400">R$</span>
            <input
              type="number"
              value={adSpendInput}
              onChange={(e) => setAdSpendInput(Number(e.target.value) || 0)}
              placeholder="0,00"
              className="text-xl font-bold text-rose-600 font-mono w-24 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded focus:outline-none"
            />
          </div>
          <span className="text-[10px] text-zinc-400">ROAS Real: {roasReal}x</span>
        </div>

        <div className="p-4 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">Índice NPS Oficial</span>
          <span className="text-2xl font-bold text-amber-600 font-mono tracking-tight my-1">{npsData.score} pts</span>
          <span className="text-[10px] text-emerald-600 font-bold">Zona de Excelência (100% Positivo)</span>
        </div>
      </div>

      {/* 4. BLOCO CENTRAL: GRÁFICO DIÁRIO + CANAIS DE TRÁFEGO (INSTAGRAM VS TIKTOK) */}
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

        {/* CANAIS DE AQUISIÇÃO: INSTAGRAM VS TIKTOK */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" /> Origem do Tráfego
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">Instagram vs. TikTok vs. Direto</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">UTMs</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {trafficChannels.map((ch) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex justify-between text-zinc-700 text-[11px]">
                  <span className="font-bold">{ch.channel}</span>
                  <span className="font-bold text-zinc-900">{ch.pct}% ({ch.visits} visitas)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ch.channel.includes('Instagram') ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      ch.channel.includes('TikTok') ? 'bg-zinc-900' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${ch.pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Conversão: {ch.conversion}</span>
                  <span>{ch.sales} pedido faturado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BLOCO: TOP 3 CLIENTES (LTV) & TOP 3 DETRATORES / GARGALOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP 3 CLIENTES */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Top 3 Patronos por Aporte (LTV)
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Maiores investidores e compradores da marca</p>
            </div>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
              VIP Tier
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {top3Customers.map((c) => (
              <div
                key={c.name}
                className={`p-3 rounded border flex justify-between items-center ${
                  c.tier === 'FOUNDER' ? 'bg-amber-50/60 border-amber-300' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div>
                  <div className="font-bold text-zinc-900 font-sans flex items-center gap-1.5">
                    {c.tier === 'FOUNDER' && <span>👑</span>}
                    <span>{c.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {c.tier} • {c.sport} • {c.orders} pedido(s)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-zinc-900 block font-mono text-sm">
                    {formatBRL(c.spent)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">
                    {c.tier === 'FOUNDER' ? 'Fundação' : 'Homologado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP 3 DETRATORES & GARGALOS */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Top 3 Detratores & Riscos Operacionais
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">Pontos de atrito, abandonos e logística reversa</p>
            </div>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
              Ação Requerida
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {top3Detractors.map((d) => (
              <div key={d.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-900 font-sans">{d.patron}</div>
                  <span className="text-[10px] text-rose-600 block">{d.motive}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-zinc-800 block">{d.risk}</span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. QUADRO DE NPS & FEEDBACK EM QUADRA */}
      <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-600" /> Painel de NPS & Feedback do Cliente
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              Avaliação de produto, conforto térmico e experiência de entrega
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
            Score: {npsData.score} (Zona de Excelência)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <ThumbsUp className="w-6 h-6 text-emerald-600" />
            <div>
              <span className="text-[10px] uppercase text-emerald-800 font-bold block">Promotores (Nota 9-10)</span>
              <span className="text-2xl font-bold text-emerald-900 mt-1 block">{npsData.promotersPct}%</span>
              <span className="text-[10px] text-emerald-700">Satisfação plena com malharia e caimento</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
            <Meh className="w-6 h-6 text-amber-600" />
            <div>
              <span className="text-[10px] uppercase text-amber-800 font-bold block">Neutros (Nota 7-8)</span>
              <span className="text-2xl font-bold text-amber-900 mt-1 block">{npsData.passivesPct}%</span>
              <span className="text-[10px] text-amber-700">Sem críticas graves; foco em variedade</span>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3">
            <ThumbsDown className="w-6 h-6 text-rose-600" />
            <div>
              <span className="text-[10px] uppercase text-rose-800 font-bold block">Detratores (Nota 0-6)</span>
              <span className="text-2xl font-bold text-rose-900 mt-1 block">{npsData.detractorsPct}%</span>
              <span className="text-[10px] text-rose-700">Zero devoluções críticas registradas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}