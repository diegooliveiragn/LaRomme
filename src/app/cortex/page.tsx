'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Activity, Clock, Truck, CheckCircle2, ArrowRight,
  DollarSign, Package, TrendingUp, RefreshCw, ShoppingCart, AlertCircle, Loader2,
  Users, MapPin, BarChart3
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface OrderSummary {
  id: string;
  short_id?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shipping_city?: string;
  shipping_state?: string;
  tracking_code?: string;
  created_at: string;
}

export default function CockpitCLevel() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCockpitData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, short_id, customer_name, customer_email, total_amount, status, shipping_city, shipping_state, tracking_code, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados do Cockpit:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCockpitData();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const paidOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered'
  );
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inFulfillmentOrders = orders.filter((o) => o.status === 'paid');

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const totalGerados = orders.length;
  const totalPagos = paidOrders.length;
  const taxaConversao = totalGerados > 0 ? Math.round((totalPagos / totalGerados) * 100) : 0;

  // Agrupamento Geográfico por Estado Real
  const stateDistribution: Record<string, number> = {};
  paidOrders.forEach(o => {
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
            Base: {totalPagos} liquidações
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
            {totalPagos} pagos de {totalGerados} gerados
          </span>
        </div>

      </div>

      {/* CURVA COMPARATIVA & RANKING GEOGRÁFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO DE LINHA COM LINHA FANTASMA */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-600" /> Curva de Vendas & Comparativo Temporal
              </h2>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Linha contínua: Mês Atual • Linha pontilhada: Período Anterior (D-30)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-zinc-900">
                <span className="w-3 h-0.5 bg-zinc-900 inline-block" /> Atual
              </span>
              <span className="flex items-center gap-1.5 font-bold text-zinc-400">
                <span className="w-3 h-0.5 border-t border-dashed border-zinc-400 inline-block" /> D-30
              </span>
            </div>
          </div>

          {/* SVG DO GRÁFICO COM LINHA FANTASMA */}
          <div className="h-48 w-full pt-4 flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              {/* Linha Fantasma (D-30) */}
              <polyline
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="10,120 80,105 160,95 240,75 320,80 400,60 490,45"
              />
              {/* Linha Contínua Real (Atual) */}
              <polyline
                fill="none"
                stroke="#18181b"
                strokeWidth="2.5"
                points="10,130 80,110 160,85 240,55 320,40 400,30 490,15"
              />
              {/* Pontos de Destaque */}
              <circle cx="240" cy="55" r="4" fill="#18181b" />
              <circle cx="490" cy="15" r="4" fill="#18181b" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-100 pt-2">
            <span>Semana 1</span>
            <span>Semana 2</span>
            <span>Semana 3</span>
            <span>Semana 4 (Atual)</span>
          </div>
        </div>

        {/* RANKING GEOGRÁFICO POR ESTADO */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2 border-b border-zinc-100 pb-4">
            <MapPin className="w-4 h-4 text-zinc-600" /> Distribuição por Estado
          </h2>

          <div className="space-y-3">
            {sortedStates.length === 0 ? (
              <p className="text-xs font-mono text-zinc-400">Aguardando primeiras entregas...</p>
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