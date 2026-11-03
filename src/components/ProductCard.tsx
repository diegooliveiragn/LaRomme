'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = product.defaultImages && product.defaultImages.length > 0
    ? product.defaultImages
    : [];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      // Inicia a transição sequencial após pequena pausa de confirmação
      const startTimer = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setActiveImageIndex((prev) => (prev + 1) % images.length);
        }, 1600);
      }, 700);

      return () => {
        clearTimeout(startTimer);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveImageIndex(0);
    }
  }, [isHovered, images.length]);

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group bg-[#080808] border border-zinc-900 hover:border-zinc-700 p-5 transition-all duration-500 rounded-sm flex flex-col justify-between block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Topo do Card */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
          {product.category}
        </span>
        {images.length > 1 && (
          <span className={`text-[8px] font-mono tracking-widest text-zinc-600 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            0{activeImageIndex + 1} / 0{images.length}
          </span>
        )}
      </div>

      {/* Container Fotográfico com Iluminação Cinza de Estúdio e Transição */}
      <div className="relative aspect-[4/5] w-full bg-[#18181b]/30 rounded-sm overflow-hidden mb-5 border border-zinc-900/50">
        {images.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              activeImageIndex === idx
                ? 'opacity-100 scale-[1.03]'
                : 'opacity-0 scale-100 pointer-events-none'
            }`}
          >
            <Image
              src={src}
              alt={`${product.name} perspec ${idx + 1}`}
              fill
              className={`object-cover transition-all duration-500 ${
                isHovered
                  ? 'grayscale-0 contrast-100 brightness-100'
                  : 'grayscale-[35%] contrast-95 brightness-90'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Identificação, Preço & Detalhes */}
      <div className="space-y-2 pt-2 border-t border-zinc-900/80">
        <div className="flex justify-between items-baseline">
          <h3 className="font-serif text-lg tracking-wider text-white font-bold uppercase transition-colors group-hover:text-zinc-100">
            {product.name}
          </h3>
          <span className="text-xs font-mono text-zinc-300 font-semibold">
            {product.price}
          </span>
        </div>

        <p className="text-[11px] text-zinc-500 font-light line-clamp-2 leading-relaxed">
          {product.description}
        </p>

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