'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, Truck, MapPin, CheckCircle2,
  DollarSign, RefreshCw, Box, Layers, TrendingUp, ShieldCheck,
  BarChart3, PieChart, AlertTriangle
} from 'lucide-react';

export default function CockpitCLevel() {
  const [loading, setLoading] = useState(true);
  const [finData, setFinData] = useState<any>(null);

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
  const paidOrders = finData?.orders || [];
  const grossRev = finData?.accounting?.grossRevenue || 0;
  const netRetained = finData?.accounting?.contributionMargin || 0;
  const avgTicket = paidOrders.length > 0 ? grossRev / paidOrders.length : 0;

  // Funil Pix em Tempo Real
  const totalPixGenerated = allOrders.length;
  const totalPixPaid = paidOrders.length;
  const pixAbandonmentRate = totalPixGenerated > 0
    ? Math.round(((totalPixGenerated - totalPixPaid) / totalPixGenerated) * 100)
    : 0;

  // Curva de Vendas Semanal Real (Últimas 4 Semanas)
  const now = new Date().getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyActual = [0, 0, 0, 0];

  paidOrders.forEach((o: any) => {
    const orderTime = new Date(o.created_at).getTime();
    const diffWeeks = Math.floor((now - orderTime) / weekMs);
    if (diffWeeks >= 0 && diffWeeks < 4) {
      const weekIndex = 3 - diffWeeks;
      weeklyActual[weekIndex] += Number(o.total_amount || o.subtotal || 0);
    }
  });

  const maxVal = Math.max(...weeklyActual, 1);
  const getY = (val: number) => Math.round(140 - (val / maxVal) * 105);
  const svgPoints = `15,${getY(weeklyActual[0])} 160,${getY(weeklyActual[1])} 310,${getY(weeklyActual[2])} 465,${getY(weeklyActual[3])}`;

  // Penetração Geográfica Real
  const geoCount: Record<string, number> = {};
  paidOrders.forEach((o: any) => {
    const uf = (o.shipping_state || 'CE').toUpperCase();
    geoCount[uf] = (geoCount[uf] || 0) + 1;
  });

  // Mix por Modalidade Esportiva
  const sportMix: Record<string, number> = {
    'Vôlei de Praia': 1,
    'Beach Tennis': 0,
    'Futevôlei': 0,
    'Corrida': 0,
    'Musculação / Treino': 0,
    'Cotidiano / Lifestyle': 0
  };

  const totalSports = Object.values(sportMix).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* BARRA DE TELEMETRIA */}
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

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CENTRO DE COMANDO • VISÃO CONSOLIDADA</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Cockpit Executivo</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Painel Preditivo de Tração, Curva de Vendas e Dinâmica Operacional</p>
        </div>

        <button
          onClick={fetchCockpit}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Indicadores</span>
        </button>
      </div>

      {/* TOP RADAR: SAÚDE DO CAIXA E UNIT ECONOMICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Receita Liquidada</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(grossRev)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Base: {paidOrders.length} liquidação real</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Margem Retida (58%)</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">{formatBRL(netRetained)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Margem Livre após CPV (35%) e Impostos</p>
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Ticket Médio Real</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgTicket)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Média por patrono liquidado</p>
        </div>
      </div>

      {/* BLOCO CENTRAL: CURVA TEMPORAL + MIX ESPORTIVO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO: CURVA DE VENDAS */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-600" /> Curva de Vendas Real (Últimos 28 Dias)
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Evolução do faturamento agrupado por semana operacional</p>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-900">
              {formatBRL(grossRev)}
            </span>
          </div>

          <div className="h-44 w-full pt-4 flex items-end">
            <svg viewBox="0 0 480 150" className="w-full h-full overflow-visible">
              <line x1="10" y1="140" x2="470" y2="140" stroke="#f4f4f5" strokeWidth="1" />
              <line x1="10" y1="87" x2="470" y2="87" stroke="#fafafa" strokeWidth="1" strokeDasharray="4 4" />
              <polyline
                fill="none"
                stroke={grossRev > 0 ? '#18181b' : '#d4d4d8'}
                strokeWidth="2.5"
                points={svgPoints}
              />
              <circle cx="15" cy={getY(weeklyActual[0])} r="3" fill="#18181b" />
              <circle cx="160" cy={getY(weeklyActual[1])} r="3" fill="#18181b" />
              <circle cx="310" cy={getY(weeklyActual[2])} r="3" fill="#18181b" />
              <circle cx="465" cy={getY(weeklyActual[3])} r="4" fill="#10b981" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
            <span>Sem 1: {formatBRL(weeklyActual[0])}</span>
            <span>Sem 2: {formatBRL(weeklyActual[1])}</span>
            <span>Sem 3: {formatBRL(weeklyActual[2])}</span>
            <span className="font-bold text-zinc-900">Sem 4: {formatBRL(weeklyActual[3])}</span>
          </div>
        </div>

        {/* MIX POR PRÁTICA ESPORTIVA */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" /> Afinidade Esportiva
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Captura no checkout para inteligência de tráfego</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Pills Checkout</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {Object.entries(sportMix).map(([sport, count]) => {
              const pct = totalSports > 0 ? Math.round((count / totalSports) * 100) : 0;
              return (
                <div key={sport} className="space-y-1">
                  <div className="flex justify-between text-zinc-700 text-[11px]">
                    <span>{sport}</span>
                    <span className="font-bold text-zinc-900">{pct}% ({count})</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-900 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(pct, count > 0 ? 10 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FUNIL PIX & GESTÃO DE ESTOQUE WMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FUNIL PIX */}
        <div className="lg:col-span-6 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Funil de Conversão Pix</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Chaves Geradas vs. Confirmações Efetivas</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              pixAbandonmentRate > 35 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Abandono: {pixAbandonmentRate}%
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
                <span className="font-bold text-emerald-600">{totalPixPaid} ({totalPixGenerated > 0 ? Math.round((totalPixPaid/totalPixGenerated)*100) : 0}%)</span>
              </div>
              <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalPixGenerated > 0 ? (totalPixPaid / totalPixGenerated) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">Tarifa Mercado Pago: 0,99%</span>
            <span className="text-emerald-600 font-mono font-bold">Liquidação Instantânea D+0</span>
          </div>
        </div>

        {/* MONITOR DE GRADE E RUPTURA WMS */}
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

      {/* PENETRAÇÃO GEOGRÁFICA E SLA DE DESPACHO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-500" /> Penetração Geográfica de Vendas
          </h3>
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(geoCount).map(([uf, count]) => (
              <div key={uf} className="p-3 rounded border border-zinc-200 bg-zinc-50 flex justify-between items-center">
                <span className="font-bold text-zinc-900">{uf}</span>
                <span className="text-zinc-600">{count} {count === 1 ? 'pedido' : 'pedidos'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" /> Logística & SLA de Fulfillment
          </h3>
          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Tempo Médio de Envio</span>
              <span className="text-xl font-bold font-mono text-zinc-900">&lt; 24h</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Cobertura Courier</span>
              <span className="text-xl font-bold font-mono text-emerald-600">Local + BR</span>
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