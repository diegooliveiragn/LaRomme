'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { EASINGS, DURATIONS } from '@/config/motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || '/assets/brand/logo.jpg';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
      className="group flex flex-col justify-between h-full bg-white p-4 transition-all duration-700 hover:shadow-2xl hover:shadow-brand-black/5"
    >
      <Link href={`/produto/${product.slug}`} className="block relative overflow-hidden aspect-[3/4] bg-zinc-900 mb-6">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 bg-brand-black/90 backdrop-blur-sm text-white text-[9px] uppercase font-mono tracking-widest px-3 py-1.5 shadow-sm z-10">
          {product.category}
        </div>
      </Link>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-brand-black group-hover:text-brand-red transition-colors duration-500">
              <Link href={`/produto/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <p className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest">
              {product.subtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-black tracking-tight font-mono whitespace-nowrap">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Cores disponíveis:</span>
          <div className="flex gap-2">
            {product.availableColors.map((color) => (
              <span
                key={color.slug}
                title={color.name}
                className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-sm transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}