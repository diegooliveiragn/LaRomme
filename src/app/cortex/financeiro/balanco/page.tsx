'use client';

import React, { useState, useEffect } from 'react';
import { Scale, RefreshCw } from 'lucide-react';

export default function BalancoPatrimonialPage() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchBalanco = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        const total = (json.orders || []).reduce((acc: number, curr: any) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
        setTotalRevenue(total);
      }
    } catch (e) {
      console.error('Erro ao buscar balanço:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanco();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const taxObligations = totalRevenue * 0.06;
  const cogsProvision = totalRevenue * 0.35;
  const totalPassivo = taxObligations + cogsProvision;
  const netWorth = totalRevenue - totalPassivo;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CONTABILIDADE DE ATIVOS & PASSIVOS</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Balanço Patrimonial Consolidado</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Posição de Liquidez, Estoque Valorizado a Custo e Obrigações Fiscais</p>
        </div>

        <button
          onClick={fetchBalanco}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Balanço</span>
        </button>
      </div>

      <div className="p-8 rounded-lg bg-zinc-900 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Patrimônio Líquido Apurado (Ativos - Passivos)
          </span>
          <div className="text-4xl font-bold font-mono tracking-tight">{formatBRL(netWorth)}</div>
          <span className="inline-block mt-3 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
            Estrutura Ativa • Liquidez Operacional
          </span>
        </div>
        <Scale className="w-12 h-12 text-zinc-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Ativo Circulante</h3>
            <span className="font-mono font-bold text-emerald-600 text-sm">{formatBRL(totalRevenue)}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-600">
              <span>Disponível em Caixa (Liquidações)</span>
              <span className="font-bold text-zinc-900">{formatBRL(totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>A Compensar (Reservas e Gateways)</span>
              <span>R$ 0,00</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Passivo Circulante</h3>
            <span className="font-mono font-bold text-rose-600 text-sm">{formatBRL(totalPassivo)}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-600">
              <span>Obrigações Tributárias (Simples ~6%)</span>
              <span className="font-bold text-zinc-900">{formatBRL(taxObligations)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Provisão de Reposição & Insumos (~35%)</span>
              <span className="font-bold text-zinc-900">{formatBRL(cogsProvision)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}