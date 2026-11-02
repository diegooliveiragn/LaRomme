'use client';

import React, { useState, useEffect } from 'react';
import { Scale, RefreshCw, ShieldCheck, Database, Globe } from 'lucide-react';

export default function BalancoPatrimonialPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchBalanco = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json);
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
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const grossRevenue = data?.accounting?.grossRevenue || 0;
  const inpiAsset = data?.startupCosts?.inpiIntangible || 500.00;
  const domainsAsset = data?.startupCosts?.domainsInfrastructure || 394.25;

  // Ativo Circulante (Disponível + Despesas Antecipadas de Domínios)
  const ativoCirculante = grossRevenue + domainsAsset;
  // Ativo Não Circulante (Marca Registrada INPI)
  const ativoNaoCirculante = inpiAsset;
  const totalAtivos = ativoCirculante + ativoNaoCirculante;

  // Passivo Circulante (Obrigações Tributárias + Provisão CMV)
  const taxObligations = data?.accounting?.taxSimples || (grossRevenue * 0.06);
  const cogsProvision = data?.accounting?.cogsTextil || (grossRevenue * 0.35);
  const totalPassivo = taxObligations + cogsProvision;

  // Patrimônio Líquido Real (Ativos Totais - Passivos Totais)
  const netWorth = totalAtivos - totalPassivo;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">CONTABILIDADE DE ATIVOS & PASSIVOS</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Balanço Patrimonial Consolidado</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Posição Patrimonial, Ativos Intangíveis (INPI), Domínios e Obrigações Fiscais</p>
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

      {/* CARD PRINCIPAL: PATRIMÔNIO LÍQUIDO */}
      <div className="p-8 rounded-lg bg-zinc-900 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Patrimônio Líquido Apurado (Ativos Totais - Passivos Totais)
          </span>
          <div className="text-4xl font-bold font-mono tracking-tight text-emerald-400">{formatBRL(netWorth)}</div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded font-mono">
              Solvência Estruturada
            </span>
            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono uppercase rounded">
              Base: R$ 894,25 em Ativos de Fundação
            </span>
          </div>
        </div>
        <Scale className="w-12 h-12 text-zinc-600" />
      </div>

      {/* SEÇÃO DE ATIVOS E PASSIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATIVOS */}
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Total de Ativos</h3>
              <span className="text-[10px] text-zinc-400 font-mono">Circulante + Intangíveis</span>
            </div>
            <span className="font-mono font-bold text-emerald-600 text-sm">{formatBRL(totalAtivos)}</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-zinc-700">
              <span className="flex items-center gap-1.5 font-sans font-medium text-zinc-800">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Disponível em Caixa (Liquidações Pix)
              </span>
              <span className="font-bold text-zinc-900">{formatBRL(grossRevenue)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span className="flex items-center gap-1.5 font-sans font-medium text-zinc-800">
                <Globe className="w-3.5 h-3.5 text-indigo-600" /> Domínios GoDaddy (.com.br / .club / .xyz)
              </span>
              <span className="font-bold text-zinc-900">{formatBRL(domainsAsset)}</span>
            </div>

            <div className="flex justify-between text-zinc-700 border-t border-zinc-100 pt-2">
              <span className="flex items-center gap-1.5 font-sans font-medium text-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Registro de Marca INPI (Ativo Intangível)
              </span>
              <span className="font-bold text-purple-600">{formatBRL(ativoNaoCirculante)}</span>
            </div>
          </div>
        </div>

        {/* PASSIVOS */}
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Passivo Circulante</h3>
              <span className="text-[10px] text-zinc-400 font-mono">Obrigações e Provisões de Reposição</span>
            </div>
            <span className="font-mono font-bold text-rose-600 text-sm">{formatBRL(totalPassivo)}</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-zinc-700">
              <span className="font-sans font-medium text-zinc-800">Obrigações Fiscais (Simples ~6%)</span>
              <span className="font-bold text-zinc-900">{formatBRL(taxObligations)}</span>
            </div>

            <div className="flex justify-between text-zinc-700">
              <span className="font-sans font-medium text-zinc-800">Provisão de Reposição Têxtil (CMV ~35%)</span>
              <span className="font-bold text-zinc-900">{formatBRL(cogsProvision)}</span>
            </div>

            <div className="flex justify-between text-zinc-500 border-t border-zinc-100 pt-2">
              <span className="font-sans font-medium text-zinc-700">Taxas Retidas de Gateway Pix (0,99%)</span>
              <span>{formatBRL(data?.accounting?.gatewayPixFee || 0.01)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}