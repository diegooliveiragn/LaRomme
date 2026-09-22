'use client';

import { motion } from 'framer-motion';
import { PRODUCTS_ORIGO } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ArchitectureOfMovement } from '@/components/collection/ArchitectureOfMovement';
import { EASINGS, DURATIONS } from '@/config/motion';
import { siteConfig } from '@/config/site';

export default function OrigoCollectionPage() {
  return (
    <div className="bg-brand-black min-h-screen">
      
      {/* Editorial Header */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
              Coleção // Lote Zero
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold uppercase tracking-wider text-white">
              Drop 01<br />
              <span className="text-zinc-600">Origo</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATIONS.slow, delay: 0.2, ease: EASINGS.cinematic }}
            className="lg:col-span-5 font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed"
          >
            <p>
              A gênese do ecossistema LaRomme. Quatro artefatos projetados na interseção exata entre a disciplina milenar e a liberdade litorânea. O primeiro passo da nossa construção.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTS_ORIGO.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* The Architecture of Movement Matrix */}
      <ArchitectureOfMovement />

      {/* Bottom Padding */}
      <div className="py-12 bg-brand-black flex justify-center border-t border-zinc-900">
         <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
           {siteConfig.coordinates}
         </span>
      </div>

    </div>
  );
}