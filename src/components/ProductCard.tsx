'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleQuickAdd = () => {
    const defaultSize = product.sizes.find((s) => s.available)?.size || product.sizes[0].size;
    addItem(product, defaultSize);
  };

  return (
    <div 
      className="group flex flex-col relative font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Container de Imagem com Proporção Fixa (aspect-square garante quadros exatos) */}
      <Link href={`/produto/${product.id}`} className="block relative w-full aspect-square bg-[#0a0a0a] overflow-hidden p-6 md:p-10 flex items-center justify-center border border-zinc-900 group-hover:border-zinc-800 transition-colors">
        
        {/* TAG SUPERIOR */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase border border-zinc-800 px-2 py-1 bg-black/80 backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* IMAGEM PRIMÁRIA */}
        <div className={`absolute inset-8 md:inset-12 transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100 z-10'}`}>
          <Image
            src={product.imagePrimary}
            alt={product.name}
            fill
            className="object-contain filter contrast-125"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        {/* IMAGEM SECUNDÁRIA (HOVER) */}
        <div className={`absolute inset-8 md:inset-12 transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100 z-10' : 'opacity-0'}`}>
          <Image
            src={product.imageSecondary}
            alt={product.name}
            fill
            className="object-contain filter contrast-125"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        {/* QUICK ADD BUTTON */}
        <div className={`absolute bottom-0 left-0 w-full p-4 z-30 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
           <button 
             onClick={(e) => { e.preventDefault(); handleQuickAdd(); }}
             className="w-full bg-white text-black font-bold text-[10px] tracking-[0.2em] uppercase py-3 shadow-xl hover:bg-zinc-200 transition-colors"
           >
             Quick Add +
           </button>
        </div>
      </Link>

      {/* INFORMAÇÕES DO PRODUTO */}
      <div className="pt-5 space-y-3">
        <div className="flex justify-between items-baseline gap-2 border-b border-zinc-900 pb-3">
          <Link href={`/produto/${product.id}`} className="group-hover:text-zinc-300 transition-colors">
            <h3 className="font-serif text-lg tracking-widest uppercase font-bold text-white">{product.name}.</h3>
          </Link>
          <span className="text-[11px] font-mono text-zinc-300 font-bold tracking-wider">{formatPrice(product.price)}</span>
        </div>
        <p className="text-[11px] text-zinc-500 font-light leading-relaxed max-w-[90%] font-sans">
          {product.description}
        </p>
      </div>

    </div>
  );
}