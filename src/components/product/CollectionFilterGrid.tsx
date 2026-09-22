'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { EASINGS, DURATIONS } from '@/config/motion';

interface CollectionFilterGridProps {
  products: Product[];
}

export function CollectionFilterGrid({ products }: CollectionFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Artefatos' },
    { id: 'Lifestyle', label: 'Lifestyle' },
    { id: 'Performance', label: 'Performance' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-12">
      {/* Filtros em Pílulas Editoriais */}
      <div className="flex flex-wrap justify-center items-center gap-3 border-b border-zinc-800 pb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-brand-offwhite text-brand-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Produtos com Motion Presence */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}