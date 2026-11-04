'use client';

import React, { useState, useEffect } from 'react';
import { Scale, RefreshCw, ShieldCheck, Database, Globe, Landmark } from 'lucide-react';

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

  const orders = data?.orders || [];
  const grossRevenue = orders.reduce((acc: number, curr: any) => acc + Number(curr.total_amount || 0), 0);
  
  // Ativos de Fundação Reais (Registro INPI + Registro de Domínios)
  const inpiAsset = 500.00; // Registro de Marca INPI
  const domainsAsset = 394.25; // Domínios Próprios GoDaddy (.com.br 3 anos + proteções)
  const cashAsset = grossRevenue * (1 - 0.0099); // Caixa Líquido Disponível após taxa Pix

  // Ativo Circulante (Disponível em Caixa + Despesas Pré-Pagas de Infraestrutura)
  const ativoCirculante = cashAsset + domainsAsset;
  // Ativo Não Circulante (Intangível: Marca Registrada INPI)
  const ativoNaoCirculante = inpiAsset;
  const totalAtivos = ativoCirculante + ativoNaoCirculante;

  // Passivo Circulante Real (Obrigações Exigíveis: Fornecedores a Pagar + Impostos Declarados)
  // Como a marca ainda não possui duplicatas a pagar lançadas, o passivo reflete a posição real
  const totalPassivo = 0.00;

  // Patrimônio Líquido (Ativos Totais - Passivos Reais)
  const netWorth = totalAtivos - totalPassivo;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            CONTABILIDADE DE ATIVOS & CAPITAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Balanço Patrimonial Consolidado
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Posição Patrimonial, Ativos Intangíveis (INPI), Domínios e Caixa Disponível
          </p>
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
            Patrimônio Líquido Apurado (Ativos Totais - Passivos Reais)
          </span>
          <div className="text-4xl font-bold font-mono tracking-tight text-emerald-400">
            {formatBRL(netWorth)}
          </div>
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
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Total de Ativos
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">Circulante + Intangíveis</span>
            </div>
            <span className="font-mono font-bold text-emerald-600 text-sm">
              {formatBRL(totalAtivos)}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-zinc-400" /> Caixa & Disponibilidades
              </span>
              <span className="font-bold text-zinc-900">{formatBRL(cashAsset)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" /> Ativo Pré-Pago: Domínios (36m)
              </span>
              <span className="font-bold text-zinc-900">{formatBRL(domainsAsset)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Ativo Intangível: Marca INPI
              </span>
              <span className="font-bold text-zinc-900">{formatBRL(inpiAsset)}</span>
            </div>
          </div>
        </div>

        {/* PASSIVOS & OBRIGAÇÕES */}
        <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Total de Passivos
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">Obrigações Exigíveis</span>
            </div>
            <span className="font-mono font-bold text-zinc-900 text-sm">
              {formatBRL(totalPassivo)}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Fornecedores & Facções a Pagar</span>
              <span className="font-bold text-zinc-900">R$ 0,00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Empréstimos / Financiamentos</span>
              <span className="font-bold text-zinc-900">R$ 0,00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-100">
              <span className="text-zinc-600">Obrigações Vencidas</span>
              <span className="font-bold text-emerald-600">Nenhuma</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}