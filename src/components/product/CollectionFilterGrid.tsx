'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';

interface CollectionFilterGridProps {
  products: Product[];
}

type FilterCategory = 'todos' | 'lifestyle' | 'performance';

export function CollectionFilterGrid({ products }: CollectionFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');

  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'todos') return true;
    return product.category === activeFilter;
  });

  return (
    <div className="space-y-8">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-300 pb-4">
        <div className="flex items-center gap-6 text-xs uppercase font-bold tracking-widest">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`pb-1 transition-all ${
              activeFilter === 'todos'
                ? 'text-brand-red border-b-2 border-brand-red'
                : 'text-zinc-500 hover:text-brand-black'
            }`}
          >
            Todos ({products.length})
          </button>
          <button
            onClick={() => setActiveFilter('lifestyle')}
            className={`pb-1 transition-all ${
              activeFilter === 'lifestyle'
                ? 'text-brand-red border-b-2 border-brand-red'
                : 'text-zinc-500 hover:text-brand-black'
            }`}
          >
            Lifestyle ({products.filter((p) => p.category === 'lifestyle').length})
          </button>
          <button
            onClick={() => setActiveFilter('performance')}
            className={`pb-1 transition-all ${
              activeFilter === 'performance'
                ? 'text-brand-red border-b-2 border-brand-red'
                : 'text-zinc-500 hover:text-brand-black'
            }`}
          >
            Performance ({products.filter((p) => p.category === 'performance').length})
          </button>
        </div>

        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
          Exibindo {filteredProducts.length} itens
        </span>
      </div>

      {/* Grade de Produtos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-zinc-200">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      )}
    </div>
  );
}
