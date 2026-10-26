'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Package, DollarSign, Layers, ArrowRight,
  RefreshCw, Loader2, TrendingUp, AlertTriangle
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProductValuation {
  id: string;
  name: string;
  category: string;
  price: number;
  cpv: number;
  total_stock: number;
}

export default function ValuationEstoquePage() {
  const [products, setProducts] = useState<ProductValuation[]>([]);
  const [loading, setLoading] = useState(true);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchValuation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const mapped: ProductValuation[] = (data || []).map((p: any) => {
        const total = (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0) + (p.stock_tu || 0);
        const preco = Number(p.price || 0);
        return {
          id: p.id,
          name: p.name,
          category: p.category || 'TOPWEAR',
          price: preco,
          cpv: preco * 0.35, // Custo de confecção padrão LaRomme
          total_stock: total
        };
      });

      setProducts(mapped);
    } catch (err: any) {
      console.error('Erro ao consultar valuation:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  }, []);

  const totalPecas = products.reduce((acc, p) => acc + p.total_stock, 0);
  const custoAdquirido = products.reduce((acc, p) => acc + (p.cpv * p.total_stock), 0);
  const vgvTotal = products.reduce((acc, p) => acc + (p.price * p.total_stock), 0);
  const potencialMargem = vgvTotal - custoAdquirido;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Qualidade Operacional & Métricas de Ativos
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Valuation de Acervo Físico
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Capital Imobilizado vs Potencial de Faturamento Bruto (VGV)
          </p>
        </div>

        <button
          onClick={fetchValuation}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Valuation</span>
        </button>
      </div>

      {/* KPIS REAIS DE VALUATION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Custo Imobilizado (CPV)
            </span>
            <Package className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(custoAdquirido)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Capital investido nas {totalPecas} peças
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800">
              Valor Geral de Vendas (VGV)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-700 tabular-nums tracking-tight block font-mono">
            {formatBRL(vgvTotal)}
          </span>
          <span className="text-xs font-bold text-emerald-800/80 mt-2 block">
            Potencial bruto em prateleira
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Potencial de Margem Bruta
            </span>
            <TrendingUp className="w-4 h-4 text-zinc-700" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(potencialMargem)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Spread bruto antes de tributos
          </span>
        </div>

      </div>

      {/* TABELA DE VALUATION POR PEÇA */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Detalhamento por Artefato do Primeiro Lote
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold tabular-nums">
            {products.length} modelos
          </span>
        </div>

        <div className="divide-y divide-zinc-100 font-mono text-xs">
          {products.map(p => (
            <div key={p.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50/60 transition-colors">
              <div>
                <span className="font-bold text-zinc-900 text-sm block font-sans">{p.name}</span>
                <span className="text-[11px] text-zinc-400 uppercase">{p.category} • Saldo: {p.total_stock} unidades</span>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Custo Unitário</span>
                  <span className="font-bold text-zinc-600">{formatBRL(p.cpv)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Preço Venda</span>
                  <span className="font-bold text-zinc-900">{formatBRL(p.price)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block uppercase font-bold">VGV Total</span>
                  <span className="font-black text-emerald-800 text-sm">{formatBRL(p.price * p.total_stock)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}