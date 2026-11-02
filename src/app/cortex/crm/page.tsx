'use client';

import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, RefreshCw, MessageSquare, MapPin, Mail, Phone } from 'lucide-react';

export default function CrmPatronosPage() {
  const [loading, setLoading] = useState(true);
  const [patronos, setPatronos] = useState<any[]>([]);

  const fetchCrm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/crm', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setPatronos(json.patronos || []);
      }
    } catch (e) {
      console.error('Erro ao carregar CRM:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrm();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalLTV = patronos.reduce((acc, p) => acc + p.total_spent, 0);
  const avgLTV = patronos.length > 0 ? totalLTV / patronos.length : 0;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">RELACIONAMENTO & INTELIGÊNCIA DE PÚBLICO</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Base de Patronos</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Matriz de Clientes, Histórico de Consumo e Perfil de Prática</p>
        </div>

        <button
          onClick={fetchCrm}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Patronos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">Base Cadastrada</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{patronos.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Patronos ativos com compras</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">LTV Médio por Patrono</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgLTV)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Gasto total acumulado por cliente</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">Pedidos Realizados</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {patronos.reduce((acc, p) => acc + p.order_count, 0)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Volume de transações liquidadas</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 block mb-2">Senado VIP Elegíveis</span>
          <div className="text-3xl font-bold text-purple-600 font-mono tracking-tight">{patronos.length}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Com direito a acesso prioritário</p>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Registro Individual de Patronos</h3>
        {patronos.length === 0 ? (
          <p className="text-xs font-mono text-zinc-400 text-center py-8">Nenhum patrono localizado com ordens aprovadas.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {patronos.map((p) => (
              <div key={p.email} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 text-sm capitalize">{p.full_name}</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      Patrono Ativo
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 mt-1 font-mono text-[11px]">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-zinc-400" /> {p.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-400" /> {p.city} - {p.state}</span>
                    {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-zinc-400" /> {p.phone}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">LTV Acumulado</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">{formatBRL(p.total_spent)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}