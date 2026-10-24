'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import {
  Package, Search, RefreshCw, AlertCircle, CheckCircle2,
  TrendingDown, Plus, ExternalLink, Layers, Box, DollarSign, Loader2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  total_stock: number;
  status: 'ATIVO' | 'ATENÇÃO' | 'ESGOTADO';
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: CatalogProduct[] = (data || []).map((p: any) => {
        const pStock = p.stock_p ?? (p.variants?.P?.stock || 0);
        const mStock = p.stock_m ?? (p.variants?.M?.stock || 0);
        const gStock = p.stock_g ?? (p.variants?.G?.stock || 0);
        const ggStock = p.stock_gg ?? (p.variants?.GG?.stock || 0);
        const tuStock = p.stock_tu ?? (p.variants?.TU?.stock || 0);
        const total = pStock + mStock + gStock + ggStock + tuStock;

        let status: CatalogProduct['status'] = 'ATIVO';
        if (total === 0) status = 'ESGOTADO';
        else if (pStock < 5 || mStock < 5 || gStock < 5 || ggStock < 5 || tuStock < 5) status = 'ATENÇÃO';

        return {
          id: p.id,
          name: p.name,
          category: p.category || 'Geral',
          price: Number(p.price || 0),
          image: p.images?.[0] || '',
          total_stock: total,
          status,
        };
      });

      setProducts(mapped);
    } catch (err: any) {
      console.error('Erro ao consultar catálogo:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const categories = ['TODOS', 'TOPWEAR', 'BOTTOMWEAR', 'HEADWEAR', 'ACESSORIOS'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'TODOS' || p.category.toUpperCase() === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPecas = products.reduce((acc, p) => acc + p.total_stock, 0);
  const totalModelos = products.length;
  const itensRuptura = products.filter((p) => p.status !== 'ATIVO').length;
  const valuationAcervo = products.reduce((acc, p) => acc + (p.price * p.total_stock), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold block mb-1">
            Gestão de Coleções & Vitrine
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            Catálogo de Artefatos
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Disponibilidade, Engenharia de Preços e SKUs Oficiais
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cortex/catalogo/novo"
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Novo Artefato (PIM)
          </Link>

          <button
            onClick={fetchCatalogData}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Acervo</span>
          </button>
        </div>
      </div>

      {/* KPIS DE ACERVO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Total em Estoque
            </span>
            <Box className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block">
            {totalPecas}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Peças físicas no galpão
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Modelos Registrados
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-black text-white tabular-nums tracking-tight block">
            {totalModelos}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            SKUs pai ativos
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-rose-500/10 border-rose-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
              Rupturas / Atenção
            </span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-black text-rose-400 tabular-nums tracking-tight block">
            {itensRuptura}
          </span>
          <span className="text-[11px] font-bold text-rose-300/80 mt-2 block">
            Modelos com grade crítica
          </span>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
              Valuation de Vitrine
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400 tabular-nums tracking-tight block font-mono">
            {formatBRL(valuationAcervo)}
          </span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Potencial bruto de faturamento
          </span>
        </div>

      </div>

      {/* FILTROS E BUSCA */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-white text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 font-sans"
          />
        </div>
      </div>

      {/* TABELA DE ARTEFATOS */}
      <div className="bg-slate-950/60 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Package className="w-4 h-4 text-slate-400" /> Acervo Oficial LaRomme
          </h2>
          <span className="text-[11px] font-mono text-slate-400 font-bold tabular-nums">
            {filteredProducts.length} itens listados
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            Consultando acervo no banco de dados...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-slate-500">
            Nenhum artefato localizado com os filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-bold">Artefato</th>
                  <th className="px-6 py-4 font-bold">Categoria</th>
                  <th className="px-6 py-4 font-bold text-right">Preço Oficial</th>
                  <th className="px-6 py-4 font-bold text-center">Saldo Físico</th>
                  <th className="px-6 py-4 font-bold text-center">Disponibilidade</th>
                  <th className="px-6 py-4 font-bold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-slate-800 bg-slate-900" />
                        ) : (
                          <div className="w-10 h-10 rounded-md border border-slate-800 bg-slate-900 flex items-center justify-center">
                            <Package className="w-4 h-4 text-slate-700" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block font-sans text-sm">{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{p.id.slice(0, 12)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                      {p.category}
                    </td>

                    <td className="px-6 py-4 text-right font-black font-mono text-white tabular-nums text-sm">
                      {formatBRL(p.price)}
                    </td>

                    <td className="px-6 py-4 text-center font-black font-mono text-white tabular-nums text-sm">
                      {p.total_stock} un.
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 border ${
                          p.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                          p.status === 'ATENÇÃO' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}>
                          {p.status === 'ATIVO' && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {p.status === 'ATENÇÃO' && <AlertCircle className="w-2.5 h-2.5" />}
                          {p.status === 'ESGOTADO' && <TrendingDown className="w-2.5 h-2.5" />}
                          {p.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/cortex/estoque"
                        className="text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider inline-flex items-center gap-1"
                      >
                        Ver WMS <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}