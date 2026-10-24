'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, AlertCircle, RefreshCw, Layers, CheckCircle2, TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock_P: number;
  stock_M: number;
  stock_G: number;
  stock_GG: number;
  stock_TU: number;
  total_stock: number;
}

export default function CortexEstoquePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedInventory: InventoryItem[] = (data || []).map((p: any) => {
        const pStock = p.stock_p !== undefined ? p.stock_p : (p.variants?.P?.stock || 0);
        const mStock = p.stock_m !== undefined ? p.stock_m : (p.variants?.M?.stock || 0);
        const gStock = p.stock_g !== undefined ? p.stock_g : (p.variants?.G?.stock || 0);
        const ggStock = p.stock_gg !== undefined ? p.stock_gg : (p.variants?.GG?.stock || 0);
        const tuStock = p.stock_tu !== undefined ? p.stock_tu : (p.variants?.TU?.stock || 0);
        
        return {
          id: p.id,
          name: p.name,
          category: p.category || 'Sem Categoria',
          price: p.price || 0,
          image: p.images?.[0] || '',
          stock_P: pStock,
          stock_M: mStock,
          stock_G: gStock,
          stock_GG: ggStock,
          stock_TU: tuStock,
          total_stock: pStock + mStock + gStock + ggStock + tuStock,
        };
      });

      setInventory(mappedInventory);
    } catch (err: any) {
      console.error('Erro ao buscar inventário:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalPecasFisicas = inventory.reduce((acc, curr) => acc + curr.total_stock, 0);
  const totalArtefatosCadastrados = inventory.length;
  
  const itensEmRuptura = inventory.filter(i => 
    (i.category !== 'ACESSORIOS' && (i.stock_P < 5 || i.stock_M < 5 || i.stock_G < 5 || i.stock_GG < 5)) ||
    (i.category === 'ACESSORIOS' && i.stock_TU < 10)
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Operação & Logística
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
            WMS & Controle de Estoque
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Gestão Física de Acervo e Previsibilidade de Ruptura
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cortex/catalogo/novo"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Novo Artefato (PIM)
          </Link>
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Saldo</span>
          </button>
        </div>
      </div>

      {/* KPIS DE WMS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Total de Peças Físicas
            </span>
            <Box className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-4xl font-black text-white tabular-nums tracking-tight block">
            {totalPecasFisicas}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Unidades em galpão
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Profundidade do Acervo
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-4xl font-black text-white tabular-nums tracking-tight block">
            {totalArtefatosCadastrados}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Modelos distintos (SKUs Pai)
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-rose-500/10 border-rose-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
              Alerta de Ruptura
            </span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-4xl font-black text-rose-400 tabular-nums tracking-tight block">
            {itensEmRuptura}
          </span>
          <span className="text-[11px] font-bold text-rose-300/80 mt-2 block">
            Itens necessitando reposição urgente
          </span>
        </div>
      </div>

      {/* MATRIZ DE SALDO FÍSICO */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Box className="w-4 h-4 text-slate-400" /> Matriz de Inventário Dimensional
          </h2>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            Mapeando posições no galpão...
          </div>
        ) : inventory.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-500">
            Nenhum produto cadastrado no banco de dados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-bold">Artefato</th>
                  <th className="px-6 py-4 font-bold text-center">P</th>
                  <th className="px-6 py-4 font-bold text-center">M</th>
                  <th className="px-6 py-4 font-bold text-center">G</th>
                  <th className="px-6 py-4 font-bold text-center">GG</th>
                  <th className="px-6 py-4 font-bold text-center">TU</th>
                  <th className="px-6 py-4 font-bold text-right">Saldo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventory.map((item) => {
                  const hasRupture = (item.category !== 'ACESSORIOS' && (item.stock_P < 5 || item.stock_M < 5 || item.stock_G < 5 || item.stock_GG < 5)) || (item.category === 'ACESSORIOS' && item.stock_TU < 10);
                  const isZerado = item.total_stock === 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border border-slate-800 bg-slate-900" />
                          ) : (
                            <div className="w-10 h-10 rounded-md border border-slate-800 bg-slate-900 flex items-center justify-center">
                              <Box className="w-4 h-4 text-slate-700" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block font-sans text-sm">{item.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{item.category}</span>
                              {isZerado ? (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <TrendingDown className="w-2.5 h-2.5"/> Zerado
                                </span>
                              ) : hasRupture ? (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <AlertCircle className="w-2.5 h-2.5"/> Atenção
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5"/> Saudável
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {item.category === 'ACESSORIOS' || item.category === 'HEADWEAR' ? (
                        <>
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">—</td>
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">—</td>
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">—</td>
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">—</td>
                          <td className={`px-6 py-4 text-center font-black font-mono text-sm tabular-nums ${item.stock_TU === 0 ? 'text-rose-500' : item.stock_TU < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.stock_TU}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={`px-6 py-4 text-center font-black font-mono text-sm tabular-nums ${item.stock_P === 0 ? 'text-rose-500' : item.stock_P < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.stock_P}
                          </td>
                          <td className={`px-6 py-4 text-center font-black font-mono text-sm tabular-nums ${item.stock_M === 0 ? 'text-rose-500' : item.stock_M < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.stock_M}
                          </td>
                          <td className={`px-6 py-4 text-center font-black font-mono text-sm tabular-nums ${item.stock_G === 0 ? 'text-rose-500' : item.stock_G < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.stock_G}
                          </td>
                          <td className={`px-6 py-4 text-center font-black font-mono text-sm tabular-nums ${item.stock_GG === 0 ? 'text-rose-500' : item.stock_GG < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {item.stock_GG}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-700 font-mono text-sm">—</td>
                        </>
                      )}

                      <td className="px-6 py-4 text-right font-black font-mono text-base text-white tabular-nums border-l border-slate-800/60 bg-slate-900/20">
                        {item.total_stock}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}