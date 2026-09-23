'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-black/95 backdrop-blur-md border-b border-zinc-900 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO TRANSPARENTE COM TRATAMENTO DE BLEND MODE CONTRA FUNDO BRANCO */}
          <Link href="/" className="relative z-50 flex items-center">
            <div className="h-9 w-auto overflow-hidden flex items-center justify-center">
              <img 
                src="/logo-white.png" 
                alt="LaRomme" 
                className="h-9 w-auto object-contain mix-blend-screen hover:opacity-80 transition-opacity" 
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 items-center font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            <Link href="/colecao/origo" className="hover:text-white transition-colors">Origo</Link>
            <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
            <Link href="/sobre" className="hover:text-white transition-colors">Manifesto</Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-6 relative z-50">
            <button 
              onClick={openCart}
              className="font-mono text-[10px] uppercase tracking-widest text-white hover:text-brand-red transition-colors flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 px-3 py-2 rounded-none"
            >
              <span>Sacola</span>
              <span className="text-brand-red font-bold">[{totalItems}]</span>
            </button>
            
            {/* HAMBURGER */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden font-mono text-[10px] uppercase tracking-widest text-white hover:text-brand-red transition-colors"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-brand-black w-full h-[100dvh] flex flex-col"
          >
            {/* Top Bar Interna */}
            <div className="flex justify-between items-center px-6 py-6 border-b border-zinc-900">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative z-50 flex items-center">
                <img 
                  src="/logo-white.png" 
                  alt="LaRomme" 
                  className="h-9 w-auto object-contain mix-blend-screen" 
                  style={{ mixBlendMode: 'screen' }}
                />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-white hover:text-brand-red transition-colors p-2"
              >
                [ FECHAR ]
              </button>
            </div>

            {/* Links Editoriais */}
            <div className="flex-1 flex flex-col justify-center px-6 gap-8">
              <Link href="/colecao/origo" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-4xl uppercase tracking-wider text-white hover:text-brand-red transition-colors">
                Origo
              </Link>
              <Link href="/journal" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-4xl uppercase tracking-wider text-white hover:text-brand-red transition-colors">
                Journal
              </Link>
              <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-4xl uppercase tracking-wider text-white hover:text-brand-red transition-colors">
                Manifesto
              </Link>
              
              <div className="w-12 h-[1px] bg-zinc-800 my-4" />
              
              <Link href="/tamanho" onClick={() => setIsMobileMenuOpen(false)} className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                Guia de Medidas
              </Link>
              <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                Diretrizes & FAQ
              </Link>
            </div>

            {/* Call to Action Final */}
            <div className="px-6 pb-12 mt-auto">
              <Link href="/acesso" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors shadow-2xl">
                [ Acessar Lote Zero ]
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}