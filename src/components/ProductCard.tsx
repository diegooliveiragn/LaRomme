'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const imagesSet = product.colors.length > 0 
    ? product.colors[activeColorIndex].images 
    : product.defaultImages;
    
  const frontImage = imagesSet[0];
  const backImage = imagesSet.length > 1 ? imagesSet[1] : frontImage;

  return (
    <div className="group flex flex-col justify-between transition-all duration-500 h-full relative">
      <div className="space-y-6">
        <Link href={`/produto/${product.id}`} className="block relative">
          
          {/* Efeito Spotlight e Moldura Ampla */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm transition-all duration-500
                          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_75%)] 
                          group-hover:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09)_0%,rgba(0,0,0,0)_85%)]">
            
            {/* Tag Categoria */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/5 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                {product.category}
              </span>
            </div>

            {/* Imagem Frontal (Ampla e com Fade no Hover) */}
            <div className="absolute inset-0 p-3 sm:p-4 flex items-center justify-center transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-105">
              <div className="relative w-full h-full">
                <Image 
                  src={frontImage} 
                  alt={`${product.name} Frente`} 
                  fill 
                  className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)]"
                />
              </div>
            </div>

            {/* Imagem Costas (Surge no Hover) */}
            <div className="absolute inset-0 p-3 sm:p-4 flex items-center justify-center opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105">
              <div className="relative w-full h-full">
                <Image 
                  src={backImage} 
                  alt={`${product.name} Costas`} 
                  fill 
                  className="object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Informações Textuais */}
        <div className="px-1">
          <div className="flex justify-between items-baseline gap-4 border-b border-zinc-900 pb-3">
            <h3 className="font-serif text-lg tracking-widest text-white font-bold">{product.name}</h3>
            <span className="text-[11px] md:text-xs font-mono text-zinc-300 font-bold whitespace-nowrap">{product.price}</span>
          </div>
          <p className="text-[11px] text-zinc-500 tracking-wider mt-3 line-clamp-2 font-sans leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="pt-6 mt-6 font-sans px-1 flex justify-between items-center border-t border-zinc-900/60">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">COR:</span>
          <div className="flex gap-2">
            {product.colors.map((c, i) => (
              <button 
                key={i} 
                onMouseEnter={() => setActiveColorIndex(i)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${activeColorIndex === i ? 'border-white scale-125' : 'border-zinc-800 hover:border-zinc-500'}`} 
                style={{ backgroundColor: c.hex }} 
                title={c.name} 
                aria-label={`Cor ${c.name}`}
              />
            ))}
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase">{product.colors[activeColorIndex]?.name}</span>
        </div>
        
        <Link
          href={`/produto/${product.id}`}
          className="text-[9px] md:text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase hover:text-white border-b border-transparent hover:border-white transition-all duration-300 pb-0.5"
        >
          VER ARTEFATO
        </Link>
      </div>
    </div>
  );
}