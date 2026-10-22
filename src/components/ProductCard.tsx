'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const currentImage = product.colors.length > 0 
    ? product.colors[activeColorIndex].images[0] 
    : product.defaultImages[0];

  // APLICANDO ZOOM MATEMÁTICO VIA CSS INLINE DE FORMA SEGURA
  const isSmall = product.id === 'umbra' || product.id === 'signum' || product.id === 'titulus';
  const isMedium = product.id === 'vestigium';
  const scaleClass = isSmall ? 'scale-[1.8]' : isMedium ? 'scale-[1.3]' : 'scale-100';

  return (
    <div className="group bg-[#080808] border border-zinc-900 p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-500 h-full">
      <div className="space-y-6">
        <Link href={`/produto/${product.id}`} className="block">
          <div className="relative aspect-square md:aspect-[3/4] w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
            
            <Image 
              src={currentImage} 
              alt={product.name} 
              fill 
              className={`object-contain p-4 filter contrast-125 grayscale md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-90 ${scaleClass}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300 z-10">
              {product.category}
            </div>
          </div>
        </Link>

        <div>
          <div className="flex justify-between items-baseline gap-4">
            <h3 className="font-serif text-lg md:text-xl tracking-wider text-white font-bold">{product.name}</h3>
            <span className="text-[11px] md:text-xs font-mono text-zinc-300 font-bold whitespace-nowrap">{product.price}</span>
          </div>
          <p className="text-[11px] text-zinc-500 tracking-wider mt-3 line-clamp-2 font-sans leading-relaxed">{product.description}</p>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-900 mt-8 space-y-6 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">CORES:</span>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button 
                  key={i} 
                  onMouseEnter={() => setActiveColorIndex(i)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${activeColorIndex === i ? 'border-white scale-125' : 'border-zinc-700 hover:border-zinc-400'}`} 
                  style={{ backgroundColor: c.hex }} 
                  title={c.name} 
                  aria-label={`Mudar para cor ${c.name}`}
                />
              ))}
            </div>
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase">{product.colors[activeColorIndex]?.name}</span>
        </div>

        <Link
          href={`/produto/${product.id}`}
          className="block w-full text-center bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black font-bold text-[10px] md:text-[11px] tracking-[0.25em] uppercase py-4 border border-zinc-800 transition-all duration-300"
        >
          VER ARTEFATO.
        </Link>
      </div>
    </div>
  );
}