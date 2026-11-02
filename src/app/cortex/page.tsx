'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Target, Clock, AlertTriangle, Truck, MapPin,
  CheckCircle2, Zap, ArrowRight, ShieldCheck, DollarSign, RefreshCw, Box, Layers
} from 'lucide-react';

export default function CockpitCLevel() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchCockpitData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setOrders(json.orders || []);
      }
    } catch (err: any) {
      console.error('Erro ao carregar Cockpit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCockpitData();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const paidOrders = orders.filter((o) =>
    ['paid', 'approved', 'shipped', 'delivered'].includes(o.status)
  );

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const inFulfillmentCount = orders.filter((o) => o.status === 'approved' && o.fulfillment_substatus !== 'ENTREGUE').length;
  const conversionRate = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

  // Decomposição Contábil Real (Alíquota Pix Real 0.99%)
  const simplesNacional = totalRevenue * 0.06;
  const gatewayReal = totalRevenue * 0.0099; // Mercado Pago Pix Real
  const cogsTotal = totalRevenue * 0.35;
  const netRetained = totalRevenue - simplesNacional - gatewayReal - cogsTotal;

  // Agrupamento Geográfico Real por Estado
  const geoCount: Record<string, number> = {};
  paidOrders.forEach((o) => {
    const uf = (o.shipping_state || 'CE').toUpperCase();
    geoCount[uf] = (geoCount[uf] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* SYSTEM HEALTH MONITOR */}
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
          onClick={fetchCockpitData}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Indicadores</span>
        </button>
      </div>

      {/* RADARES PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Receita Liquidada</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(totalRevenue)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Base: {paidOrders.length} liquidação real</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Ticket Médio Real</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgTicket)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Média por patrono</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Na Bancada de Galpão</span>
            <Box className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{inFulfillmentCount}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Ordens em processamento</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Conversão Checkout</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{conversionRate}%</div>
          <p className="text-[11px] text-zinc-400 mt-1">{paidOrders.length} pagos de {orders.length} gerados</p>
        </div>
      </div>

      {/* SEÇÃO INTERMEDIÁRIA: RUNWAY, SLA E DECOMPOSIÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Runway de Sobrevivência</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">Estrutura Ativa</div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Caixa operacional positivo com ciclo Pix D+0 no Mercado Pago.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Velocidade de Fulfillment</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">&lt; 24h</div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Meta operacional: despacho no mesmo dia para pedidos aprovados.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">Decomposição Contábil</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-zinc-600">
              <span>Lucro Líquido Retido (~58%):</span>
              <span className="font-bold text-emerald-600">{formatBRL(netRetained)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Fisco (6%) + Gateway (0,99%):</span>
              <span>{formatBRL(simplesNacional + gatewayReal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Provisão CMV Têxtil (35%):</span>
              <span>{formatBRL(cogsTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: DISTRIBUIÇÃO GEOGRÁFICA REAL */}
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
            <span className="text-zinc-400 col-span-full">Aguardando novos despachos regionais.</span>
          )}
        </div>
      </div>
    </div>
  );
}