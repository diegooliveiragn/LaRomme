'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  // Imagem 1 (Frente) e Imagem 2 (Costas ou Detalhe no hover)
  const frontImage = product.defaultImages && product.defaultImages.length > 0
    ? product.defaultImages[0]
    : '';
  const hoverImage = product.defaultImages && product.defaultImages.length > 1
    ? product.defaultImages[1]
    : frontImage;

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group bg-[#080808] border border-zinc-900 hover:border-zinc-700 p-5 transition-all duration-300 rounded-sm flex flex-col justify-between block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Categoria Superior */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
          {product.category}
        </span>
      </div>

      {/* Container de Imagem em object-contain (Sem rebarbas) */}
      <div className="relative aspect-[4/5] w-full bg-[#050505] rounded-sm overflow-hidden mb-5">
        <Image
          src={isHovered ? hoverImage : frontImage}
          alt={product.name}
          fill
          className="object-contain p-3 transition-all duration-700 group-hover:scale-105"
        />
      </div>

      {/* Identificação & Valor */}
      <div className="space-y-2 pt-2 border-t border-zinc-900/80">
        <div className="flex justify-between items-baseline">
          <h3 className="font-serif text-lg tracking-wider text-white font-bold uppercase">
            {product.name}
          </h3>
          <span className="text-xs font-mono text-zinc-300 font-semibold">
            {product.price}
          </span>
        </div>

        <p className="text-[11px] text-zinc-500 font-light line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Cores / Detalhe Sutil */}
        <div className="flex justify-between items-center pt-2 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
          <span>{product.colors && product.colors[0]?.name ? product.colors[0].name : 'ORIGINAL'}</span>
          <span className="text-zinc-400 group-hover:text-white transition-colors">
            Explorar Peça →
          </span>
        </div>
      </div>
    </Link>
  );
}