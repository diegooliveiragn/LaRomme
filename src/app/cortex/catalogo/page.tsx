'use client';

import React, { useState } from 'react';
import { 
  PackageSearch, PackageX, AlertTriangle, ShieldCheck, 
  Shirt, RefreshCw, Plus, Minus, DollarSign
} from 'lucide-react';

interface Variant {
  size: string;
  stock: number;
  vipDemand: number;
}

interface ProductWMS {
  id: string;
  name: string;
  category: string;
  status: 'ATIVO' | 'RASCUNHO' | 'ESGOTADO';
  cpv: number; // Custo do Produto Vendido
  variants: Variant[];
}

const INVENTORY: ProductWMS[] = [
  {
    id: 'TENAX-101',
    name: 'TENAX T-SHIRT',
    category: 'PERFORMANCE',
    status: 'ATIVO',
    cpv: 55.00,
    variants: [
      { size: 'P', stock: 12, vipDemand: 2 },
      { size: 'M', stock: 2, vipDemand: 4 }, 
      { size: 'G', stock: 24, vipDemand: 1 },
      { size: 'GG', stock: 0, vipDemand: 0 }, 
    ]
  },
  {
    id: 'VEST-202',
    name: 'VESTIGIUM BOXY',
    category: 'LIFESTYLE',
    status: 'ATIVO',
    cpv: 72.00,
    variants: [
      { size: 'P', stock: 5, vipDemand: 0 },
      { size: 'M', stock: 15, vipDemand: 0 },
      { size: 'G', stock: 8, vipDemand: 2 },
      { size: 'GG', stock: 4, vipDemand: 1 },
    ]
  },
  {
    id: 'UMBRA-303',
    name: 'UMBRA 5-PANEL',
    category: 'PERFORMANCE',
    status: 'RASCUNHO',
    cpv: 45.00,
    variants: [
      { size: 'ÚNICO', stock: 0, vipDemand: 0 },
    ]
  }
];

export default function CatalogoPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductWMS | null>(INVENTORY[0]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Cálculos de Vitrine & Valuation
  const totalFisico = INVENTORY.reduce((acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stock, 0), 0);
  const rupturas = INVENTORY.flatMap(p => p.variants).filter(v => v.stock === 0).length;
  
  // Cálculo de Capital Imobilizado (Estoque * Custo)
  const capitalImobilizado = INVENTORY.reduce((totalValor, produto) => {
    const totalPecasProduto = produto.variants.reduce((sum, v) => sum + v.stock, 0);
    return totalValor + (totalPecasProduto * produto.cpv);
  }, 0);

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-2">
            Catálogo & WMS
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Gestão de Acervo, Valuation e Cobertura</p>
        </div>
                <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            className="px-4 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> PDV
          </button>
          <a
            href="/cortex/catalogo/novo"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Artefato
          </a>
        </div>
      </div>

      {/* PAINEL DE ALERTAS & VALUATION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* CARD VALUATION DE ESTOQUE (CAPITAL IMOBILIZADO) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Capital Imobilizado
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-white leading-none">{formatBRL(capitalImobilizado)}</span>
            <span className="text-[10px] text-zinc-500 font-mono pb-0.5 uppercase tracking-wider">em Prateleira</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Estoque Físico Total</span>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-zinc-900 leading-none">{totalFisico}</span>
            <span className="text-xs text-zinc-400 font-mono pb-0.5">unidades</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Grade Crítica
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-amber-600 leading-none">1</span>
            <span className="text-xs text-amber-600/70 font-mono pb-0.5">SKU em risco</span>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-mono tracking-widest text-rose-700 uppercase flex items-center gap-1">
            <PackageX className="w-3 h-3" /> Ruptura (Esgotados)
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-bold text-rose-600 leading-none">{rupturas}</span>
            <span className="text-xs text-rose-600/70 font-mono pb-0.5">Tamanhos zerados</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: LISTA DE PRODUTOS */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
            <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Shirt className="w-4 h-4 text-zinc-500" />
              Acervo LaRomme
            </h2>
          </div>
          
          <div className="divide-y divide-zinc-100 overflow-y-auto max-h-[500px]">
            {INVENTORY.map((product) => {
              const isSelected = selectedProduct?.id === product.id;
              const hasCritical = product.variants.some(v => v.stock > 0 && v.stock <= 4);
              const isOut = product.variants.every(v => v.stock === 0);

              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full text-left px-5 py-4 transition-all hover:bg-zinc-50 ${
                    isSelected ? 'bg-zinc-50 border-l-2 border-l-zinc-900' : 'border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider">{product.name}</span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      product.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      product.status === 'RASCUNHO' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-mono mt-2">
                    <span className="text-zinc-500">{formatBRL(product.cpv)}/un</span>
                    <span className="text-zinc-300">•</span>
                    {isOut ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1"><PackageX className="w-3 h-3" /> Esgotado</span>
                    ) : hasCritical ? (
                      <span className="text-amber-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Atenção</span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Regular</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: GESTÃO DE GRADE DO PRODUTO */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          
          {!selectedProduct ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <PackageSearch className="w-8 h-8 opacity-20" />
              <span className="text-xs font-mono uppercase tracking-widest">Selecione um artefato à esquerda</span>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase mb-0.5">
                    {selectedProduct.name}
                  </h2>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Custo Base: {formatBRL(selectedProduct.cpv)} | Imobilizado neste SKU: {formatBRL(selectedProduct.variants.reduce((s, v) => s + v.stock, 0) * selectedProduct.cpv)}
                  </span>
                </div>
              </div>

              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[10px] text-zinc-500 font-mono uppercase tracking-widest bg-white">
                      <th className="py-3 px-3 font-bold">Tamanho</th>
                      <th className="py-3 px-3 font-bold text-center">Prateleira</th>
                      <th className="py-3 px-3 font-bold text-center">Senado VIP</th>
                      <th className="py-3 px-3 font-bold">Cobertura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {selectedProduct.variants.map((variant) => {
                      const deficit = variant.vipDemand > variant.stock;
                      const isZero = variant.stock === 0;
                      const isCritical = variant.stock > 0 && variant.stock <= 4;
                      
                      return (
                        <tr key={variant.size} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3 px-3">
                            <span className="inline-block bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono font-bold px-2 py-1 rounded w-8 text-center">
                              {variant.size}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`text-sm font-bold font-mono ${isZero ? 'text-rose-600' : isCritical ? 'text-amber-600' : 'text-zinc-900'}`}>
                              {variant.stock}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {variant.vipDemand > 0 ? (
                              <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                                {variant.vipDemand} un
                              </span>
                            ) : (
                              <span className="text-zinc-300 font-mono">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {deficit ? (
                              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Déficit
                              </span>
                            ) : isZero ? (
                              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                                Esgotado
                              </span>
                            ) : isCritical ? (
                              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">
                                Crítico
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                                Coberto
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}