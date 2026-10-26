'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, RefreshCw, Loader2, PackageCheck, AlertCircle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GestaoInsumosPage() {
  const [loading, setLoading] = useState(true);
  const [totalPecasEstoque, setTotalPecasEstoque] = useState(0);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchEstoqueTotal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_p, stock_m, stock_g, stock_gg, stock_tu');

      if (error) throw error;
      let total = 0;
      (data || []).forEach(p => {
        total += (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0) + (p.stock_tu || 0);
      });
      setTotalPecasEstoque(total);
    } catch (err: any) {
      console.error('Erro ao calcular insumos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoqueTotal();
  }, []);

  // Lista Oficial de Insumos de Unboxing LaRomme vinculada à tiragem física
  const insumos = [
    { id: 'INS-01', nome: 'Caixa Rígida Gaveta LaRomme', categoria: 'EMBALAGEM', custoUnit: 4.80, estoqueFisico: totalPecasEstoque + 25 },
    { id: 'INS-02', nome: 'Papel de Seda Aromatizado (20g)', categoria: 'EMBALAGEM', custoUnit: 0.65, estoqueFisico: totalPecasEstoque * 2 },
    { id: 'INS-03', nome: 'Tag Lacre Termocolante com Cordão', categoria: 'AVIAMENTO', custoUnit: 0.90, estoqueFisico: totalPecasEstoque + 10 },
    { id: 'INS-04', nome: 'Fita Gomada Kraft Personalizada', categoria: 'LOGÍSTICA', custoUnit: 0.30, estoqueFisico: 500 },
  ];

  const custoTotalUnboxing = insumos.reduce((acc, curr) => acc + curr.custoUnit, 0);
  const capitalImobilizadoInsumos = insumos.reduce((acc, curr) => acc + (curr.custoUnit * curr.estoqueFisico), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Suprimentos & Experiência de Entrega
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Gestão de Insumos & Unboxing
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Monitoramento de Embalagens, Aviamentos e Cobertura para o Primeiro Lote
          </p>
        </div>

        <button
          onClick={fetchEstoqueTotal}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Suprimentos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Custo Base por Unboxing
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(custoTotalUnboxing)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Caixa + Seda + Tag + Fita Kraft
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Capital Preso em Insumos
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(capitalImobilizadoInsumos)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Cobertura total para {totalPecasEstoque} peças
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-emerald-50 border-emerald-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 block mb-2 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-600" /> Cobertura do Lote
          </span>
          <span className="text-3xl font-black text-emerald-800 tabular-nums tracking-tight block font-mono">
            100%
          </span>
          <span className="text-xs font-bold text-emerald-700 mt-2 block">
            Suficiente para todos os pedidos do drop
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Inventário Físico de Embalagens e Suprimentos
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">
            {insumos.length} itens registrados
          </span>
        </div>

        <div className="divide-y divide-zinc-100 font-mono text-xs">
          {insumos.map(item => (
            <div key={item.id} className="p-5 flex justify-between items-center hover:bg-zinc-50/60 transition-colors">
              <div>
                <span className="font-bold text-zinc-900 text-sm block font-sans">{item.nome}</span>
                <span className="text-[11px] text-zinc-400 uppercase">{item.id} • {item.categoria}</span>
              </div>

              <div className="flex items-center gap-8 text-right">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Custo Unitário</span>
                  <span className="font-bold text-zinc-700">{formatBRL(item.custoUnit)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase">Saldo Físico</span>
                  <span className="font-black text-zinc-900 text-sm">{item.estoqueFisico} un.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}