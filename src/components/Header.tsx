'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

// Voltando para a logo original, mas usando CSS para cortar o texto
const HELMET_LOGO_URL = "/logo-branca.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();

  const isCortexRoute = pathname?.startsWith('/cortex');
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isCortexRoute) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans border-b ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-md border-zinc-900 py-3' 
            : 'bg-black/40 backdrop-blur-sm border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* LOGO CORTADA (Apenas a metade esquerda da imagem onde está o capacete) */}
          <Link href="/" className="flex items-center group overflow-hidden w-8 h-8 md:w-10 md:h-10 relative">
            <div className={`absolute top-0 left-0 w-[250%] h-full transition-all duration-300 filter brightness-0 invert group-hover:opacity-70`}>
              <Image 
                src={HELMET_LOGO_URL} 
                alt="LaRomme" 
                fill 
                className="object-cover object-left" 
                priority 
              />
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#origo" className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400 hover:text-white uppercase transition-colors">Acervo</Link>
            <Link href="/senado-vip" className="text-[10px] tracking-[0.2em] font-semibold text-zinc-400 hover:text-white uppercase transition-colors">Senado VIP</Link>
          </nav>

          {/* CARRINHO DE COMPRAS */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-2 border border-zinc-800 bg-black/50 hover:bg-white hover:text-black hover:border-white transition-all px-4 py-2"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${cartItemsCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-zinc-600'}`}></div>
              <span className="text-[10px] font-mono tracking-[0.2em] font-bold uppercase pt-0.5">
                Sacola ({cartItemsCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* DRAWER DO CARRINHO */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}