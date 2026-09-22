'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Esconde o menu ao dar scroll down, revela ao dar scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); // Descendo a tela
    } else {
      setHidden(false); // Subindo a tela
    }
  });

  const menuLinks = [
    { label: 'Drop 01 — Origo', href: '/colecao/origo' },
    { label: 'A Marca', href: '/sobre' },
    { label: 'Archive', href: '/journal' },
    { label: 'Medidas', href: '/tamanho' },
    { label: 'FAQ', href: '/faq' },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-40 bg-brand-black/95 backdrop-blur-md border-b border-zinc-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="font-serif text-2xl tracking-widest text-white z-50">
          LR
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-[10px] uppercase tracking-widest font-bold">
          {menuLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-400 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/acesso" className="text-brand-red border border-zinc-800 px-4 py-2 hover:border-brand-red transition-all">
            [ Lote Zero ]
          </Link>
        </nav>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-white z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
        className="fixed inset-0 bg-brand-black z-40 flex flex-col justify-center items-center"
      >
        <nav className="flex flex-col items-center gap-8 font-serif text-2xl uppercase tracking-widest">
          {menuLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/acesso" 
            className="mt-8 text-brand-red font-mono text-sm border border-zinc-800 px-8 py-4"
            onClick={() => setIsOpen(false)}
          >
            [ Acessar Lote Zero ]
          </Link>
        </nav>
        
        <div className="absolute bottom-10 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
          {siteConfig.coordinates}
        </div>
      </motion.div>
    </motion.header>
  );
}