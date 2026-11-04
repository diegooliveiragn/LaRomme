'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Box, Layers, RefreshCw, Plus, Minus, CheckCircle2, 
  AlertCircle, PackagePlus, DollarSign, ArrowUpRight 
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: string;
  isOneSize?: boolean;
  costEstimate: number; // Custo médio de confecção
  stock: {
    P: number;
    M: number;
    G: number;
    GG: number;
    TU: number;
  };
}

export default function CortexEstoquePage() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [entrySize, setEntrySize] = useState<string>('M');
  const [entryQuantity, setEntryQuantity] = useState<number>(10);

  // Inicializa o inventário oficial dos 4 artefatos com saldo 0
  const initializeInventory = async () => {
    setLoading(true);
    try {
      // Tenta buscar saldos customizados caso existam na tabela products/inventory do Supabase
      const { data: dbProducts } = await supabase
        .from('products')
        .select('*');

      const items: InventoryItem[] = PRODUCTS.map((prod) => {
        const dbMatch = dbProducts?.find((p: any) => p.id === prod.id || p.name?.toLowerCase().includes(prod.id));
        
        const cost = prod.id === 'vestigium' ? 68.00 :
                     prod.id === 'tenax' ? 52.00 :
                     prod.id === 'libertas' ? 42.00 : 45.00;

        return {
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          isOneSize: prod.isOneSize || false,
          costEstimate: cost,
          stock: {
            P: Number(dbMatch?.stock_p ?? 0),
            M: Number(dbMatch?.stock_m ?? 0),
            G: Number(dbMatch?.stock_g ?? 0),
            GG: Number(dbMatch?.stock_gg ?? 0),
            TU: Number(dbMatch?.stock_tu ?? 0),
          }
        };
      });

      setInventory(items);
    } catch (e) {
      console.error('Erro ao mapear estoque:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeInventory();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Totais do Galpão
  const totalUnits = inventory.reduce((acc, curr) => {
    if (curr.isOneSize) return acc + curr.stock.TU;
    return acc + curr.stock.P + curr.stock.M + curr.stock.G + curr.stock.GG;
  }, 0);

  const totalCostValuation = inventory.reduce((acc, curr) => {
    const units = curr.isOneSize 
      ? curr.stock.TU 
      : (curr.stock.P + curr.stock.M + curr.stock.G + curr.stock.GG);
    return acc + (units * curr.costEstimate);
  }, 0);

  const totalMarketValuation = inventory.reduce((acc, curr) => {
    const units = curr.isOneSize 
      ? curr.stock.TU 
      : (curr.stock.P + curr.stock.M + curr.stock.G + curr.stock.GG);
    const cleanPrice = Number(curr.price.replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0;
    return acc + (units * cleanPrice);
  }, 0);

  const handleOpenEntry = (item: InventoryItem) => {
    setSelectedProduct(item);
    setEntrySize(item.isOneSize ? 'TU' : 'M');
    setEntryQuantity(10);
    setEntryModalOpen(true);
  };

  const handleApplyEntry = () => {
    if (!selectedProduct) return;

    setInventory(prev => prev.map(item => {
      if (item.id === selectedProduct.id) {
        return {
          ...item,
          stock: {
            ...item.stock,
            [entrySize]: Math.max(0, item.stock[entrySize as keyof typeof item.stock] + Number(entryQuantity))
          }
        };
      }
      return item;
    }));

    setEntryModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            OPERACIONAL & WMS • GALPÃO DE FORTALEZA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Matriz de Saldo & Estoque Físico
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Controle de Grades (P / M / G / GG / TU) e Valuation de Acervo Físico
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={initializeInventory}
            disabled={loading}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar WMS</span>
          </button>
        </div>
      </div>

      {/* KPIS DE VALUATION E VOLUME */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Volume Físico Total
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {totalUnits} <span className="text-base font-normal text-zinc-400">unidades</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {totalUnits === 0 ? 'Aguardando entrega do 1º lote' : 'Saldos aptos para expedição'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Capital Imobilizado (Custo)
          </span>
          <div className="text-3xl font-bold text-zinc-700 font-mono tracking-tight">
            {formatBRL(totalCostValuation)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Base: Custo de fabricação e malharia
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            Potencial de Faturamento (VGV)
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {formatBRL(totalMarketValuation)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Valor bruto de prateleira na vitrine
          </p>
        </div>

      </div>

      {/* MATRIZ DE SALDOS POR GRADE DOS 4 ARTEFATOS */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Box className="w-4 h-4 text-zinc-500" /> Saldo Dimensional de Prateleira
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Drop 01 // Sistema Origo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">Artefato</th>
                <th className="px-6 py-3 font-bold">Categoria</th>
                <th className="px-4 py-3 font-bold text-center">P</th>
                <th className="px-4 py-3 font-bold text-center">M</th>
                <th className="px-4 py-3 font-bold text-center">G</th>
                <th className="px-4 py-3 font-bold text-center">GG</th>
                <th className="px-4 py-3 font-bold text-center">TU</th>
                <th className="px-6 py-3 font-bold text-right">Saldo Físico</th>
                <th className="px-6 py-3 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {inventory.map((item) => {
                const totalItem = item.isOneSize 
                  ? item.stock.TU 
                  : (item.stock.P + item.stock.M + item.stock.G + item.stock.GG);

                return (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold font-sans text-sm text-zinc-900 block uppercase">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {item.price} • Custo Est.: {formatBRL(item.costEstimate)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[10px] text-zinc-500 uppercase">
                      {item.category}
                    </td>

                    {item.isOneSize ? (
                      <>
                        <td className="px-4 py-4 text-center text-zinc-300">—</td>
                        <td className="px-4 py-4 text-center text-zinc-300">—</td>
                        <td className="px-4 py-4 text-center text-zinc-300">—</td>
                        <td className="px-4 py-4 text-center text-zinc-300">—</td>
                        <td className="px-4 py-4 text-center font-bold text-zinc-900">
                          {item.stock.TU}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 text-center font-bold text-zinc-900">
                          {item.stock.P}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-zinc-900">
                          {item.stock.M}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-zinc-900">
                          {item.stock.G}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-zinc-900">
                          {item.stock.GG}
                        </td>
                        <td className="px-4 py-4 text-center text-zinc-300">—</td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right font-black text-sm text-zinc-900">
                      {totalItem} un.
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEntry(item)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <PackagePlus className="w-3 h-3 text-zinc-600" />
                        <span>Ajustar Saldo</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE ENTRADA / AJUSTE RÁPIDO DE ESTOQUE */}
      {entryModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold uppercase text-zinc-900">
                  Ajuste de Estoque • {selectedProduct.name}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">Entrada ou Retirada de Peças no Galpão</span>
              </div>
              <button onClick={() => setEntryModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 font-mono text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-600 mb-1.5 uppercase font-bold">Grade / Tamanho:</label>
                {selectedProduct.isOneSize ? (
                  <div className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold rounded">
                    TAMANHO ÚNICO (TU)
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {['P', 'M', 'G', 'GG'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setEntrySize(sz)}
                        className={`py-2 text-center rounded border font-bold transition-all ${
                          entrySize === sz 
                            ? 'bg-zinc-900 text-white border-zinc-900' 
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-zinc-600 mb-1.5 uppercase font-bold">Quantidade a Adicionar (+ / -):</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEntryQuantity(prev => prev - 5)}
                    className="p-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded font-bold"
                  >
                    -5
                  </button>
                  <input
                    type="number"
                    value={entryQuantity}
                    onChange={(e) => setEntryQuantity(Number(e.target.value))}
                    className="flex-1 p-2.5 bg-zinc-50 border border-zinc-200 rounded font-bold text-center text-sm focus:outline-none focus:border-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={() => setEntryQuantity(prev => prev + 5)}
                    className="p-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded font-bold"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEntryModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyEntry}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Confirmar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}