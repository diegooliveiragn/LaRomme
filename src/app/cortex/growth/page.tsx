'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrendingUp, Users, RefreshCw, Loader2, Award, ArrowUpRight } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PatronSummary {
  email: string;
  name: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
}

export default function GrowthPage() {
  const [patrons, setPatrons] = useState<PatronSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('customer_name, customer_email, total_amount, status, created_at')
        .in('status', ['paid', 'shipped', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const patronMap: Record<string, PatronSummary> = {};
      (orders || []).forEach(o => {
        const email = o.customer_email || 'patrono@laromme.com.br';
        if (!patronMap[email]) {
          patronMap[email] = {
            email,
            name: o.customer_name || 'Patrono Oficial',
            totalSpent: 0,
            ordersCount: 0,
            lastOrderDate: o.created_at,
          };
        }
        patronMap[email].totalSpent += Number(o.total_amount || 0);
        patronMap[email].ordersCount += 1;
      });

      setPatrons(Object.values(patronMap).sort((a, b) => b.totalSpent - a.totalSpent));
    } catch (err: any) {
      console.error('Erro ao buscar dados de Growth:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const totalPatronos = patrons.length;
  const ltvMedio = totalPatronos > 0 ? patrons.reduce((acc, p) => acc + p.totalSpent, 0) / totalPatronos : 0;
  const recompras = patrons.filter(p => p.ordersCount > 1).length;
  const taxaRetencao = totalPatronos > 0 ? Math.round((recompras / totalPatronos) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Retenção & Análise RFM
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Growth & LTV de Patronos
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Métricas de Ciclo de Vida, Recompra e Ranking de Clientes
          </p>
        </div>

        <button
          onClick={fetchGrowthData}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar LTV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Base Ativa de Patronos
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {totalPatronos}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Patronos com liquidações confirmadas
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            LTV Médio (Valor Vitalício)
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(ltvMedio)}
          </span>
          <span className="text-xs font-bold text-emerald-700 mt-2 block">
            Gasto médio acumulado por patrono
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Taxa de Recompra
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {taxaRetencao}%
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            {recompras} patronos com múltiplos pedidos
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-600" /> Ranking de Patronos por Volume Financeiro
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">
            {patrons.length} perfis consolidados
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            Consolidando base de patronos...
          </div>
        ) : patrons.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500">
            Nenhuma transação liquidada para cálculo de LTV.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 font-mono text-xs">
            {patrons.slice(0, 10).map((p, idx) => (
              <div key={p.email} className="p-5 flex justify-between items-center hover:bg-zinc-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-400 w-6">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-zinc-900 text-sm block font-sans">{p.name}</span>
                    <span className="text-[11px] text-zinc-400">{p.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-right">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Pedidos</span>
                    <span className="font-bold text-zinc-700">{p.ordersCount}x</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">LTV Total</span>
                    <span className="font-black text-emerald-800 text-sm">{formatBRL(p.totalSpent)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}