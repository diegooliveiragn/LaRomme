'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  AlertTriangle, RefreshCw, Clock, Send, MessageCircle,
  ShieldCheck, DollarSign
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AbandonosPage() {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingOrders(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar reservas pendentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const totalValueAtRisk = pendingOrders.reduce(
    (acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0),
    0
  );

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            QUALIDADE OPERACIONAL & RETENÇÃO
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Gargalos & Reservas Retidas
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitoramento de atrito no checkout e recuperação proativa de receita
          </p>
        </div>

        <button
          onClick={fetchPending}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Reservas</span>
        </button>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
            Receita Retida no Checkout
          </span>
          <span className="text-3xl font-bold text-rose-600 font-mono tracking-tight my-2">
            {formatBRL(totalValueAtRisk)}
          </span>
          <span className="text-[11px] text-zinc-400">Pix gerados aguardando confirmação</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
            Reservas Pendentes
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            {pendingOrders.length}
          </span>
          <span className="text-[11px] text-zinc-400">Total de carrinhos com chave emitida</span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            SLA de Recuperação
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            45 min
          </span>
          <span className="text-[11px] text-zinc-400">Janela ideal para abordagem cortês</span>
        </div>
      </div>

      {/* FILA DE ABORDAGEM */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
            Fila de Reservas em Aberto
          </h3>
          <span className="text-[10px] font-mono text-zinc-400">
            {pendingOrders.length} {pendingOrders.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-400">
            Nenhuma reserva retida no momento. Operação em dia.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 font-mono text-xs">
            {pendingOrders.map((ord) => (
              <div key={ord.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-zinc-50 transition-colors">
                <div>
                  <div className="font-bold text-zinc-900 font-sans text-sm">
                    {ord.customer_name || 'Patrono Anônimo'}
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    Pedido #{ord.short_id || ord.id.slice(0, 8)} • {ord.customer_email || '—'}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-rose-600 font-mono text-sm">
                    {formatBRL(ord.total_amount || ord.subtotal || 0)}
                  </span>
                  <a
                    href={`https://wa.me/55${(ord.customer_phone || '').replace(/\D/g, '')}?text=Olá! Notamos sua reserva na LaRomme. Podemos ajudar a concluir sua aquisição?`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Concierge WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}