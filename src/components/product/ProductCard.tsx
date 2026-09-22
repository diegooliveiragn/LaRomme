'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { EASINGS, DURATIONS } from '@/config/motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
      className="group flex flex-col justify-between h-full bg-white border border-zinc-200/80 p-5 transition-all duration-500 hover:border-brand-black hover:shadow-2xl"
    >
      <Link href={`/produto/${product.slug}`} className="block relative overflow-hidden aspect-[3/4] bg-zinc-100 mb-5">
        {/* Placeholder visual editorial com escala no hover */}
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-100 via-zinc-150 to-zinc-200 group-hover:scale-105 transition-transform duration-700 ease-out">
          <span className="text-[9px] uppercase font-bold tracking-editorial text-brand-red mb-2 block">
            {product.subtitle}
          </span>
          <span className="font-serif text-3xl font-bold uppercase tracking-widest text-brand-black block">
            {product.name}
          </span>
          <span className="text-xs text-zinc-500 mt-3 italic font-serif opacity-80 block">
            "{product.concept}"
          </span>
        </div>

        {/* Badge de Categoria */}
        <div className="absolute top-3 left-3 bg-brand-black text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1">
          {product.category}
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-brand-black group-hover:text-brand-red transition-colors duration-300">
              <Link href={`/produto/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {product.subtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-black tracking-tight font-mono">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Swatches de Cores com Microinteração */}
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest mr-1">Cores:</span>
          {product.availableColors.map((color) => (
            <span
              key={color.slug}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-sm transition-transform duration-300 hover:scale-125"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}