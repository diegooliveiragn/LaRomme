'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-700 ${
        isScrolled
          ? 'bg-brand-black/95 text-brand-offwhite backdrop-blur-md py-3 shadow-xl border-b border-zinc-800/80'
          : 'bg-gradient-to-b from-brand-black/90 via-brand-black/40 to-transparent text-brand-offwhite py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:text-brand-red transition-colors -ml-2"
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-semibold tracking-editorial uppercase text-zinc-300 font-sans">
          <Link href="/colecao/origo" className="hover:text-white transition-colors">
            Drop 01 — Origo
          </Link>
          <Link href="/sobre" className="hover:text-white transition-colors">
            A Marca
          </Link>
        </nav>

        {/* Center Logo Area - Emblema Oficial */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 mb-1.5 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-zinc-700 transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src="/assets/brand/logo.jpg"
              alt="LaRomme Logo"
              fill
              className="object-contain scale-90"
              priority
            />
          </div>
          <span className="font-serif text-lg sm:text-xl tracking-widest font-bold uppercase transition-colors duration-300 group-hover:text-brand-red">
            LaRomme
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Link href="/journal" className="hidden lg:block text-[11px] font-semibold tracking-editorial uppercase text-zinc-300 hover:text-white transition-colors font-sans">
            Archive
          </Link>
          {/* O botão do carrinho dá lugar ao botão de Acesso VIP no pré-lançamento */}
          <Link href="/acesso" className="font-mono text-[9px] uppercase tracking-widest text-brand-red border border-brand-red/30 px-4 py-2 hover:bg-brand-red hover:text-white transition-all rounded-sm hidden sm:block">
            [ Acesso VIP ]
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="lg:hidden bg-brand-black text-brand-offwhite border-t border-zinc-900 px-6 py-8 space-y-6 flex flex-col uppercase text-[11px] font-semibold tracking-editorial overflow-hidden font-sans"
          >
            <Link href="/colecao/origo" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-red transition-colors py-2 border-b border-zinc-900/50">
              Drop 01 — Origo
            </Link>
            <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-red transition-colors py-2 border-b border-zinc-900/50">
              A Marca
            </Link>
            <Link href="/journal" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-red transition-colors py-2 border-b border-zinc-900/50">
              Archive
            </Link>
            <Link href="/acesso" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-red hover:text-white transition-colors pt-4 font-mono text-[10px] tracking-widest block">
              [ Solicitar Acesso VIP ]
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}