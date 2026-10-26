'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RotateCcw, AlertTriangle, Truck, RefreshCw, Eye, CheckCircle2, PackageCheck } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReversaPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setTickets([]);
      } else {
        setTickets(data || []);
      }
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const totalCustoReverso = tickets.reduce((acc, curr) => acc + Number(curr.reverse_cost || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Qualidade Operacional & Pós-Venda
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Logística Reversa & Trocas
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Triagem Técnica, Laudo Fotográfico e Autópsia de Modelagem
          </p>
        </div>

        <button
          onClick={fetchReturns}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Fila</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Taxa Real de Trocas
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {tickets.length > 0 ? `${tickets.length}%` : '0.0%'}
          </span>
          <span className="text-xs font-bold text-emerald-700 mt-2 block">
            Índice de conformidade exemplar
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-700 block mb-2">
            Chamados em Triagem
          </span>
          <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tight block font-mono">
            {tickets.length}
          </span>
          <span className="text-xs font-bold text-amber-800/80 mt-2 block">
            Aguardando laudo técnico
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Custo em Fretes Reversos
          </span>
          <span className="text-3xl font-black text-rose-600 tabular-nums tracking-tight block font-mono">
            {formatBRL(totalCustoReverso)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Impacto líquido apurado
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-zinc-600" /> Fila Ativa de Reversa
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">{tickets.length} chamados</span>
        </div>

        {tickets.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <PackageCheck className="w-10 h-10 text-emerald-600" />
            Nenhuma inconformidade ou solicitação de devolução registrada no momento.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {tickets.map(t => (
              <div key={t.id} className="p-5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-zinc-900 text-sm block">{t.customer_name}</span>
                  <span className="text-xs font-mono text-zinc-500">{t.reason}</span>
                </div>
                <span className="font-mono font-bold text-xs">{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}