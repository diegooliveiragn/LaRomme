'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, Truck, MapPin, CheckCircle2,
  AlertTriangle, DollarSign, RefreshCw, Box, Layers, TrendingUp, ArrowRight, ShieldCheck
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

  // Penetração Geográfica Real
  const geoCount: Record<string, number> = {};
  paidOrders.forEach((o: any) => {
    const uf = (o.shipping_state || 'CE').toUpperCase();
    geoCount[uf] = (geoCount[uf] || 0) + 1;
  });

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

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CENTRO DE COMANDO • VISÃO CONSOLIDADA</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Cockpit Executivo</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Monitoramento de Faturamento, Tração e Cumprimento Operacional</p>
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

      {/* TOP RADAR: SAÚDE DO CAIXA E EFICIÊNCIA */}
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Ticket Médio Real</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgTicket)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Média por patrono liquidado</p>
        </div>
      </div>

      {/* FUNIL PIX EM TEMPO REAL & SAZONALIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FUNIL PIX */}
        <div className="lg:col-span-6 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Funil de Conversão Pix (Tempo Real)</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Chaves Geradas vs. Confirmações de Pagamento</p>
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
                <span>2. Pix Liquidados com Sucesso</span>
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
            <span className="text-emerald-600 font-mono font-bold">Liquidação D+0 Ativa</span>
          </div>
        </div>

        {/* SLA DE FULFILLMENT & RUNWAY */}
        <div className="lg:col-span-6 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">SLA de Bancada & Sobrevivência</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Eficiência Logística de Expedição e Cobertura</p>
            </div>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded border border-zinc-200 bg-zinc-50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block font-mono mb-1">
                Velocidade de Despacho
              </span>
              <span className="text-2xl font-bold font-mono text-zinc-900">&lt; 24h</span>
              <p className="text-[10px] text-zinc-400 mt-1">Meta interna: envio no mesmo dia útil</p>
            </div>

            <div className="p-4 rounded border border-zinc-200 bg-zinc-50">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block font-mono mb-1">
                Runway Operacional
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-600">Estruturado</span>
              <p className="text-[10px] text-zinc-400 mt-1">R$ 894,25 em Ativos de Fundação</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-zinc-600 font-mono flex items-center justify-between">
            <span>Logística Bifurcada:</span>
            <span className="font-bold text-zinc-900">LaRomme Courier (CE) + Correios (BR)</span>
          </div>
        </div>
      </div>

      {/* PENETRAÇÃO GEOGRÁFICA REAL */}
      <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-zinc-500" /> Penetração Geográfica de Vendas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 font-mono text-xs">
          {Object.entries(geoCount).map(([uf, count]) => (
            <div key={uf} className="p-3 rounded border border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <span className="font-bold text-zinc-900">{uf}</span>
              <span className="text-zinc-600">{count} {count === 1 ? 'pedido' : 'pedidos'}</span>
            </div>
          ))}
          {Object.keys(geoCount).length === 0 && (
            <span className="text-zinc-400 col-span-full font-mono text-xs">Aguardando novos despachos regionais.</span>
          )}
        </div>
      </div>
    </div>
  );
}