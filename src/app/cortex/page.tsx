'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Activity, Clock, Truck, CheckCircle2, ArrowRight,
  DollarSign, Package, TrendingUp, RefreshCw, ShoppingCart, AlertCircle, Loader2
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
  const dispatchedOrders = orders.filter(
    (o) => o.status === 'shipped' || o.status === 'delivered'
  );

  const totalRevenue = paidOrders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const avgTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const totalGerados = orders.length;
  const totalPagos = paidOrders.length;
  const taxaConversao = totalGerados > 0 ? Math.round((totalPagos / totalGerados) * 100) : 0;

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
            Monitoramento em Tempo Real de Receita, Pedidos e Fulfillment
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

      {/* KPIS REAIS CONECTADOS AO SUPABASE */}
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
            Base: {totalPagos} pedidos pagos
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
            Média por patrono liquidado
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-700">
              Na Esteira de Galpão
            </span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tight block font-mono">
            {inFulfillmentOrders.length}
          </span>
          <span className="text-xs font-bold text-amber-800/80 mt-2 block">
            Pedidos pagos aguardando envio
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

      {/* SEÇÃO PRINCIPAL: ÚLTIMAS TRANSAÇÕES E ATIVIDADES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TABELA DE PEDIDOS RECENTES */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-zinc-600" /> Últimas Atividades no Checkout
            </h2>
            <Link
              href="/cortex/pedidos"
              className="text-xs font-bold text-zinc-600 hover:text-zinc-900 uppercase tracking-wider flex items-center gap-1"
            >
              Ver Esteira Completa <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              Sincronizando livro de pedidos em tempo real...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500">
              Nenhuma transação registrada no banco até o momento.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {orders.slice(0, 6).map((ord) => (
                <div key={ord.id} className="p-5 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-zinc-900">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </span>
                      <span className="text-sm font-bold text-zinc-800">{ord.customer_name || 'Patrono'}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        ord.status === 'paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        ord.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        ord.status === 'shipped' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}>
                        {ord.status === 'paid' ? 'Pago' : ord.status === 'pending' ? 'Pendente Pix' : ord.status === 'shipped' ? 'Despachado' : ord.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-500">{ord.customer_email || '—'}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-zinc-900 tabular-nums block">
                      {formatBRL(Number(ord.total_amount || 0))}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {new Date(ord.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA LATERAL DE OPERAÇÃO RÁPIDA */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-4">
            <h3 className="text-xs font-black text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-3">
              Acesso Rápido às Frentes
            </h3>

            <div className="space-y-2">
              <Link
                href="/cortex/pedidos"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-bold text-zinc-900"
              >
                <span>Esteira Operacional de Galpão</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/cortex/estoque"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-bold text-zinc-900"
              >
                <span>Matriz de Estoque (WMS)</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/cortex/financeiro"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-bold text-zinc-900"
              >
                <span>DRE & Resultados Contábeis</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/cortex/qualidade/abandonos"
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-xs font-bold text-zinc-900"
              >
                <span>Fila de Recuperação de Reservas</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-3">
            <h3 className="text-xs font-black text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Saúde do Galpão
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pedidos pagos são movidos automaticamente para a esteira com micro-status. Os disparos de rastreio são autenticados pelo Resend.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}