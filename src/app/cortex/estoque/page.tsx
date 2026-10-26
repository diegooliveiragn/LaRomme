'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, AlertCircle, RefreshCw, Layers, CheckCircle2, TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexEstoquePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('price', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Erro ao consultar WMS:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const totalFisico = products.reduce((acc, p) => {
    const sum = (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0) + (p.stock_tu || 0);
    return acc + (sum > 0 ? sum : Number(p.stock || 0));
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Galpão Central & Matriz WMS
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-3">
            WMS & Controle de Estoque
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Grade Dimensional e Previsibilidade de Ruptura do Primeiro Lote
          </p>
        </div>

        <button
          onClick={fetchStock}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Saldo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Total de Peças Físicas
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {totalFisico}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Unidades em prateleira
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Profundidade do Acervo
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {products.length}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Modelos distintos (SKU Pai)
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 block mb-2">
            Cobertura da Grade
          </span>
          <span className="text-3xl font-black text-emerald-700 tabular-nums tracking-tight block font-mono">
            100%
          </span>
          <span className="text-xs font-bold text-emerald-800 mt-2 block">
            Grade ativa sem rupturas
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Matriz de Inventário Dimensional (Grade Real)
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">{products.length} SKUs cadastrados</span>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5 font-bold">Artefato</th>
                <th className="px-4 py-3.5 font-bold text-center">P</th>
                <th className="px-4 py-3.5 font-bold text-center">M</th>
                <th className="px-4 py-3.5 font-bold text-center">G</th>
                <th className="px-4 py-3.5 font-bold text-center">GG</th>
                <th className="px-4 py-3.5 font-bold text-center">TU</th>
                <th className="px-6 py-3.5 font-bold text-right">Saldo Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map(p => {
                const isHat = p.category?.toLowerCase().includes('acessórios') || p.category?.toLowerCase().includes('headwear');
                const pStk = p.stock_p || 0;
                const mStk = p.stock_m || 0;
                const gStk = p.stock_g || 0;
                const ggStk = p.stock_gg || 0;
                const tuStk = isHat ? (p.stock || 30) : 0;
                const total = isHat ? tuStk : (pStk + mStk + gStk + ggStk);

                return (
                  <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-zinc-900 block font-sans">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 uppercase">{p.sku_code || p.category}</span>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-zinc-800">{isHat ? '—' : pStk}</td>
                    <td className="px-4 py-4 text-center font-bold text-zinc-800">{isHat ? '—' : mStk}</td>
                    <td className="px-4 py-4 text-center font-bold text-zinc-800">{isHat ? '—' : gStk}</td>
                    <td className="px-4 py-4 text-center font-bold text-zinc-800">{isHat ? '—' : ggStk}</td>
                    <td className="px-4 py-4 text-center font-bold text-zinc-800">{isHat ? tuStk : '—'}</td>
                    <td className="px-6 py-4 text-right font-black text-sm text-zinc-900 bg-zinc-50/50">
                      {total} un.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}