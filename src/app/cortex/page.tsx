'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { 
  Activity, 
  Clock, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard,
  Package,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Users
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

  // Segmentação e Métricas
  const paidOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered'
  );
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inFulfillmentOrders = orders.filter((o) => o.status === 'paid');
  const dispatchedOrders = orders.filter(
    (o) => o.status === 'shipped' || o.status === 'delivered'
  );

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const totalGerados = orders.length;
  const totalPagos = paidOrders.length;
  const totalPendentes = pendingOrders.length;

  const taxaConversao = totalGerados > 0 ? Math.round((totalPagos / totalGerados) * 100) : 0;
  const taxaFuga = totalGerados > 0 ? Math.round((totalPendentes / totalGerados) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* SYSTEM HEALTH MONITOR */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl shadow-sm">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 border-r border-slate-800 pr-4">
          <Activity className="w-4 h-4 text-emerald-400" /> Infraestrutura
        </span>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Supabase DB</span>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Resend Mail</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Mercado Pago Pix</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Vercel Edge</span>
        </div>
      </div>

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Centro de Comando • Visão Consolidada
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            Cockpit Executivo
          </h1>
        </div>

        <button
          onClick={fetchCockpitData}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar Métricas
        </button>
      </div>

      {/* KPIS EXECUTIVOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Receita Total */}
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Receita Liquidada
            </span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl lg:text-4xl font-black text-emerald-400 tabular-nums tracking-tight block font-mono">
            {formatBRL(totalRevenue)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block tabular-nums">
            {totalPagos} pedidos aprovados
          </span>
        </div>

        {/* Funil PIX / Conversão */}
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Conversão PIX
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl lg:text-4xl font-black text-white tabular-nums tracking-tight block">
            {taxaConversao}%
          </span>
          <span className="text-[11px] font-bold text-amber-400 mt-2 block tabular-nums">
            Taxa de fuga (pendentes): {taxaFuga}%
          </span>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Ticket Médio
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl lg:text-4xl font-black text-white tabular-nums tracking-tight block font-mono">
            {formatBRL(avgTicket)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block tabular-nums">
            Média por pedido concluído
          </span>
        </div>

        {/* Esteira de Despacho */}
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              Em Separação
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl lg:text-4xl font-black text-amber-400 tabular-nums tracking-tight block">
            {inFulfillmentOrders.length}
          </span>
          <span className="text-[11px] font-bold text-slate-400 mt-2 block tabular-nums">
            {dispatchedOrders.length} pacotes despachados
          </span>
        </div>

      </div>

      {/* FUNIL VISUAL DE RESERVAS */}
      <div className="p-6 rounded-xl border bg-slate-950/60 border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Fluxo Operacional de Checkout (Base Consolidada)
          </span>
          <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
            Total Gerado: {totalGerados}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-xs">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Pedidos Criados</span>
            <span className="text-2xl font-black text-white tabular-nums">{totalGerados}</span>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <span className="text-[10px] text-amber-300 uppercase font-bold block mb-1">Aguardando PIX / Retidos</span>
            <span className="text-2xl font-black text-amber-400 tabular-nums">{totalPendentes}</span>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block mb-1">Pagamentos Confirmados</span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums">{totalPagos}</span>
          </div>
        </div>
      </div>

      {/* LOGÍSTICA & AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabela de Envio Recente */}
        <div className="lg:col-span-2 bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-400" /> Movimentação Recente de Pedidos
            </h2>
            <Link
              href="/cortex/pedidos"
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Ver Esteira Completa <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono font-bold text-slate-500">
                Nenhum pedido registrado no banco de dados.
              </div>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          #{ord.short_id || ord.id.slice(0, 8)}
                        </span>
                        <span className="text-xs font-bold text-slate-300">• {ord.customer_name || 'Patrono'}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {ord.shipping_city ? `${ord.shipping_city}, ${ord.shipping_state || ''}` : 'Local não especificado'}
                        {' '}• {new Date(ord.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-black font-mono text-emerald-400 tabular-nums">
                      {formatBRL(Number(ord.total_amount || 0))}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                      ord.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : ord.status === 'shipped' || ord.status === 'delivered'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {ord.status === 'paid' ? 'Pago' : ord.status === 'shipped' ? 'Despachado' : ord.status === 'delivered' ? 'Entregue' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atalhos Operacionais do Cortex */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" /> Módulos Operacionais
            </h2>
            
            <div className="space-y-3">
              <Link
                href="/cortex/crm"
                className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between block"
              >
                <div>
                  <span className="text-xs font-bold text-white block">CRM & Matriz RFM</span>
                  <span className="text-[11px] text-slate-400">Patronos, LTV e Concierge</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/cortex/pedidos"
                className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between block"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Esteira de Fulfillment</span>
                  <span className="text-[11px] text-slate-400">Separação, etiquetas e rastreio</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/cortex/estoque"
                className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between block"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Controle de Estoque</span>
                  <span className="text-[11px] text-slate-400">Variantes e saldo físico</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 text-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold">
              LaRomme Operating System
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}