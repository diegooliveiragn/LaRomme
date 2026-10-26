'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Scale, RefreshCw, Loader2, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BalancoPatrimonialPage() {
  const [loading, setLoading] = useState(true);
  const [caixaLiquido, setCaixaLiquido] = useState(0);
  const [valorEstoqueCusto, setValorEstoqueCusto] = useState(0);
  const [recebiveisPendentes, setRecebiveisPendentes] = useState(0);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchBalanco = async () => {
    setLoading(true);
    try {
      // 1. Consulta Pedidos Pagos (Caixa Real)
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status');

      const pagos = (orders || []).filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
      const totalReceita = pagos.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      
      const simplesNacional = totalReceita * 0.06;
      const taxasGateway = totalReceita * 0.0499;
      setCaixaLiquido(totalReceita - simplesNacional - taxasGateway);

      const pendentes = (orders || []).filter(o => o.status === 'pending');
      const totalPendentes = pendentes.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      setRecebiveisPendentes(totalPendentes);

      // 2. Consulta Produtos para Valuation de Estoque
      const { data: prods } = await supabase
        .from('products')
        .select('price, stock_p, stock_m, stock_g, stock_gg, stock_tu');

      let custoTotalEstoque = 0;
      (prods || []).forEach(p => {
        const totalPecas = (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0) + (p.stock_tu || 0);
        const custoUnitario = Number(p.price || 0) * 0.35; // Custo base de 35%
        custoTotalEstoque += totalPecas * custoUnitario;
      });

      setValorEstoqueCusto(custoTotalEstoque);
    } catch (err: any) {
      console.error('Erro ao calcular Balanço Patrimonial:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanco();
  }, []);

  const totalAtivoCirculante = caixaLiquido + recebiveisPendentes + valorEstoqueCusto;
  const obrigacoesFiscais = caixaLiquido * 0.06;
  const fornecedoresProvisao = valorEstoqueCusto * 0.40;
  const totalPassivo = obrigacoesFiscais + fornecedoresProvisao;
  const patrimonioLiquido = totalAtivoCirculante - totalPassivo;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Contabilidade de Ativos & Passivos
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-3">
            Balanço Patrimonial Consolidado
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Posição de Liquidez, Estoque Valorizado a Custo e Obrigações Fiscais
          </p>
        </div>

        <button
          onClick={fetchBalanco}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Balanço</span>
        </button>
      </div>

      {/* QUADRO DO PATRIMÔNIO LÍQUIDO */}
      <div className="p-8 rounded-2xl bg-zinc-900 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2">
            Patrimônio Líquido Apurado (Ativos - Passivos)
          </span>
          <span className="text-4xl lg:text-5xl font-black font-mono tracking-tight tabular-nums block">
            {formatBRL(patrimonioLiquido)}
          </span>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
              Estrutura Saudável
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Ativos cobrem passivos em {(totalPassivo > 0 ? (totalAtivoCirculante / totalPassivo).toFixed(1) : '∞')}x
            </span>
          </div>
        </div>
        <Scale className="w-16 h-16 text-zinc-700 hidden md:block" />
      </div>

      {/* GRADE DE ATIVOS E PASSIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ATIVOS */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" /> Ativo Circulante
            </h2>
            <span className="text-base font-black font-mono text-emerald-700 tabular-nums">
              {formatBRL(totalAtivoCirculante)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-600">Disponível em Caixa (Liquidações)</span>
              <span className="font-bold text-zinc-900">{formatBRL(caixaLiquido)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-600">A Compensar (Reservas e Gateways)</span>
              <span className="font-bold text-zinc-900">{formatBRL(recebiveisPendentes)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-600">Acervo Físico (Valor de Custo dos 4 SKUs)</span>
              <span className="font-bold text-zinc-900">{formatBRL(valorEstoqueCusto)}</span>
            </div>
          </div>
        </div>

        {/* PASSIVOS */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-rose-600" /> Passivo Circulante
            </h2>
            <span className="text-base font-black font-mono text-rose-700 tabular-nums">
              {formatBRL(totalPassivo)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-600">Obrigações Tributárias (Simples 6%)</span>
              <span className="font-bold text-zinc-900">{formatBRL(obrigacoesFiscais)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-600">Provisão de Reposição & Insumos</span>
              <span className="font-bold text-zinc-900">{formatBRL(fornecedoresProvisao)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}