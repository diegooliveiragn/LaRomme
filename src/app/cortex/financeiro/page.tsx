'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, RefreshCw, FileText, PieChart } from 'lucide-react';

export default function DreResultadosPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchDre = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Erro ao buscar DRE:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDre();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const acc = data?.accounting || {
    grossRevenue: 0,
    taxSimples: 0,
    gatewayPixFee: 0,
    netRevenue: 0,
    cogsTextil: 0,
    contributionMargin: 0,
    opexFixo: 0,
    netProfitEbitda: 0,
    splitReinvestimento: 0,
    splitProLabore: 0
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CONTROLADORIA & GOVERNANÇA FINANCEIRA</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Tesouraria & Demonstração de Resultados (DRE)</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Apuração Contábil, Margem de Contribuição e Provisão Societária (70/30)</p>
        </div>

        <button
          onClick={fetchDre}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Livro-Razão</span>
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">Receita Bruta</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(acc.grossRevenue)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Base: {data?.orders?.length || 0} ordens homologadas</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 block mb-2">Deduções Tributárias & Gateway</span>
          <div className="text-3xl font-bold text-rose-600 font-mono tracking-tight">
            {formatBRL(acc.taxSimples + acc.gatewayPixFee)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">6,0% Fisco + 0,99% Pix Mercado Pago</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">Margem de Contribuição</span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">{formatBRL(acc.contributionMargin)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Receita Líquida após CMV Têxtil (~35%)</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">Custódia Mercado Pago</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(data?.mpBalance?.total || acc.grossRevenue)}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Sincronizado com liquidação</p>
        </div>
      </div>

      {/* CASCATA DRE E SPLIT 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DRE DETALHADA */}
        <div className="lg:col-span-8 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" /> Demonstração Contábil Sintética
            </h3>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">ANO-BASE 2026</span>
          </div>

          <div className="divide-y divide-zinc-100 text-xs font-mono">
            <div className="py-2.5 flex justify-between font-bold text-zinc-900">
              <span>(+) Receita Operacional Bruta de Vendas</span>
              <span>{formatBRL(acc.grossRevenue)}</span>
            </div>

            <div className="py-2 flex justify-between text-rose-600">
              <span className="pl-4">(-) Deduções Tributárias (Simples Nacional ~6%)</span>
              <span>- {formatBRL(acc.taxSimples)}</span>
            </div>

            <div className="py-2 flex justify-between text-rose-600">
              <span className="pl-4">(-) Custos de Intermediação & Gateway Pix (0,99%)</span>
              <span>- {formatBRL(acc.gatewayPixFee)}</span>
            </div>

            <div className="py-2.5 flex justify-between font-bold text-zinc-800 bg-zinc-50 px-2 rounded">
              <span>(=) Receita Operacional Líquida</span>
              <span>{formatBRL(acc.netRevenue)}</span>
            </div>

            <div className="py-2 flex justify-between text-rose-600">
              <span className="pl-4">(-) Custo das Mercadorias Vendidas (CMV Têxtil ~35%)</span>
              <span>- {formatBRL(acc.cogsTextil)}</span>
            </div>

            <div className="py-2.5 flex justify-between font-bold text-indigo-700 bg-indigo-50/50 px-2 rounded">
              <span>(=) Lucro Bruto Operacional (Margem de Contribuição)</span>
              <span>{formatBRL(acc.contributionMargin)}</span>
            </div>

            <div className="py-2 flex justify-between text-rose-600">
              <span className="pl-4">(-) Despesas Operacionais Fixas & Nuvem (~12%)</span>
              <span>- {formatBRL(acc.opexFixo)}</span>
            </div>

            <div className="py-3 flex justify-between font-bold text-emerald-600 text-sm bg-emerald-50/60 px-2 rounded">
              <span>(=) RESULTADO LÍQUIDO DO EXERCÍCIO (EBITDA)</span>
              <span>{formatBRL(acc.netProfitEbitda)}</span>
            </div>
          </div>
        </div>

        {/* GOVERNANÇA SOCIETÁRIA (70/30) */}
        <div className="lg:col-span-4 p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" /> Governança de Capital
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">REGRA 70/30</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              Diretriz societária para sustentabilidade da marca e reinvestimento contínuo em novos lotes físicos.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded border border-zinc-200 bg-zinc-50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Reinvestimento em Acervo (70%)
                </span>
                <span className="text-xl font-bold text-zinc-900 block">{formatBRL(acc.splitReinvestimento)}</span>
                <p className="text-[10px] text-zinc-400 mt-1">Garante compra de malharia nobre e produção</p>
              </div>

              <div className="p-4 rounded border border-zinc-200 bg-zinc-50">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Reserva Estratégica / Pró-Labore (30%)
                </span>
                <span className="text-xl font-bold text-zinc-900 block">{formatBRL(acc.splitProLabore)}</span>
                <p className="text-[10px] text-zinc-400 mt-1">Distribuição livre de tributos para os sócios</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-[10px] font-mono text-zinc-400 text-center">
            Amortização pré-operacional de R$ 894,25 registrada no Balanço.
          </div>
        </div>
      </div>
    </div>
  );
}