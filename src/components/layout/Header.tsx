'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { useCart } from '@/context/CartContext';
import { EASINGS, DURATIONS } from '@/config/motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-brand-black/95 text-brand-offwhite backdrop-blur-md py-4 shadow-xl border-b border-zinc-800/80'
          : 'bg-gradient-to-b from-brand-black/80 via-brand-black/30 to-transparent text-brand-offwhite py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Botão Menu Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:text-brand-red transition-colors"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
          <Link href="/colecao/origo" className="relative group py-1">
            <span className="group-hover:text-brand-red transition-colors">Drop 01 — Origo</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-red transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/sobre" className="relative group py-1">
            <span className="group-hover:text-brand-red transition-colors">Sobre</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-red transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/journal" className="relative group py-1">
            <span className="group-hover:text-brand-red transition-colors">Journal</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-red transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Logotipo Central */}
        <Link href="/" className="text-center group block">
          <span className="font-serif text-2xl lg:text-3xl tracking-widest font-bold block uppercase transition-transform duration-300 group-hover:scale-105">
            {siteConfig.name}
          </span>
          <span className="text-[9px] tracking-editorial uppercase opacity-70 block -mt-1 group-hover:text-brand-red transition-colors">
            Estilo • Performance
          </span>
        </Link>

        {/* Ações / Carrinho */}
        <div className="flex items-center gap-5">
          <button
            className="p-2 hover:text-brand-red transition-colors"
            aria-label="Buscar produtos"
          >
            <Search size={20} />
          </button>
          <button
            onClick={openCart}
            className="p-2 relative hover:text-brand-red transition-colors flex items-center"
            aria-label="Carrinho de compras"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Drawer do Menu Mobile Animado */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="lg:hidden bg-brand-black text-brand-offwhite border-t border-zinc-800/80 px-6 py-8 space-y-6 flex flex-col uppercase text-xs font-semibold tracking-widest overflow-hidden"
          >
            <Link
              href="/colecao/origo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-red transition-colors py-1 border-b border-zinc-900"
            >
              Drop 01 — Origo
            </Link>
            <Link
              href="/sobre"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-red transition-colors py-1 border-b border-zinc-900"
            >
              Sobre A Marca
            </Link>
            <Link
              href="/journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-red transition-colors py-1 border-b border-zinc-900"
            >
              Journal
            </Link>
            <Link
              href="/contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-brand-red transition-colors py-1"
            >
              Contato
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}