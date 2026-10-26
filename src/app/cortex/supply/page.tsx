'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Factory, Calculator, DollarSign, RefreshCw, Loader2, ArrowRight } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProductSupply {
  id: string;
  name: string;
  category: string;
  price: number;
}

export default function SupplyPage() {
  const [products, setProducts] = useState<ProductSupply[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  
  // Variáveis do Simulador de Precificação
  const [custoMaoObra, setCustoMaoObra] = useState<number>(45);
  const [custoTecido, setCustoTecido] = useState<number>(28);
  const [custoInsumos, setCustoInsumos] = useState<number>(7.5);
  const [margemAlvo, setMargemAlvo] = useState<number>(45); // 45%

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price')
        .order('price', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      if (data && data.length > 0) {
        setSelectedProductId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erro ao consultar produtos em Supply:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Cálculo da Engenharia de Preços
  const custoDiretoTotal = custoMaoObra + custoTecido + custoInsumos;
  const taxaImpostoGateway = 0.06 + 0.0499; // 10.99% (Simples + Gateway)
  const precoSugerido = custoDiretoTotal / (1 - (margemAlvo / 100) - taxaImpostoGateway);
  const markupMultiplicador = custoDiretoTotal > 0 ? precoSugerido / custoDiretoTotal : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Engenharia de Produto & Private Label
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-3">
            Supply & Matriz de Produção
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Composição de CPV, Tech Packs Oficiais e Simulador de Markup
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Artefatos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TABELA DE MATRIZ DOS 4 ARTEFATOS */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <Factory className="w-4 h-4 text-zinc-600" /> Acervo em Linha de Produção
            </h2>
            <span className="text-xs font-mono text-zinc-500 font-bold">
              {products.length} modelos ativos
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              Carregando artefatos do banco...
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 font-mono text-xs">
              {products.map(p => {
                const isSelected = p.id === selectedProductId;
                const cpvBase = Number(p.price) * 0.35;
                const margemBruta = Number(p.price) - cpvBase;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${
                      isSelected ? 'bg-zinc-100/70 border-l-4 border-zinc-900' : 'hover:bg-zinc-50/60'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-zinc-900 text-sm block font-sans">{p.name}</span>
                      <span className="text-[11px] text-zinc-400 uppercase">{p.category}</span>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">CPV Base (35%)</span>
                        <span className="font-bold text-zinc-700">{formatBRL(cpvBase)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase">Preço Tabela</span>
                        <span className="font-black text-zinc-900">{formatBRL(p.price)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 block uppercase font-bold">Margem Bruta</span>
                        <span className="font-black text-emerald-800">{formatBRL(margemBruta)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MOTOR DE PRECIFICAÇÃO DINÂMICO */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase flex items-center gap-2">
              <Calculator className="w-4 h-4 text-zinc-600" /> Motor de Precificação (Markup)
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Simulando: <span className="font-bold text-zinc-900">{selectedProduct?.name}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-zinc-600 block mb-1">Mão de Obra / Facção (R$)</label>
              <input
                type="number"
                value={custoMaoObra}
                onChange={(e) => setCustoMaoObra(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Tecido / Malharia Nobre (R$)</label>
              <input
                type="number"
                value={custoTecido}
                onChange={(e) => setCustoTecido(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Insumos de Unboxing & Aviamentos (R$)</label>
              <input
                type="number"
                value={custoInsumos}
                onChange={(e) => setCustoInsumos(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-zinc-600 block mb-1">Margem Líquida Alvo (%)</label>
              <input
                type="number"
                value={margemAlvo}
                onChange={(e) => setMargemAlvo(Number(e.target.value))}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-5 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Custo Direto Total (CPV):</span>
              <span className="font-bold text-white">{formatBRL(custoDiretoTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Markup Operacional:</span>
              <span className="font-bold text-emerald-400">{markupMultiplicador.toFixed(2)}x</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between items-baseline">
              <span className="text-xs uppercase font-mono font-bold text-zinc-300">Preço Sugerido:</span>
              <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                {formatBRL(precoSugerido)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}