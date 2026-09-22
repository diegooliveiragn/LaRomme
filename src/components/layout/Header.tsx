'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCart } from '@/context/CartContext';

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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-black/95 text-brand-offwhite backdrop-blur-md py-4 shadow-md'
          : 'bg-transparent text-brand-black py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:opacity-70 transition"
          aria-label="Abrir menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
          <Link href="/colecao/origo" className="hover:text-brand-red transition-colors">
            Drop 01 — Origo
          </Link>
          <Link href="/sobre" className="hover:text-brand-red transition-colors">
            Sobre
          </Link>
          <Link href="/journal" className="hover:text-brand-red transition-colors">
            Journal
          </Link>
        </nav>

        {/* Logo Central */}
        <Link href="/" className="text-center group">
          <span className="font-serif text-2xl lg:text-3xl tracking-widest font-bold block uppercase">
            {siteConfig.name}
          </span>
          <span className="text-[9px] tracking-editorial uppercase opacity-70 block -mt-1 group-hover:text-brand-red transition-colors">
            Estilo • Performance
          </span>
        </Link>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <button
            className="p-2 hover:opacity-70 transition-opacity"
            aria-label="Buscar produtos"
          >
            <Search size={20} />
          </button>
          <button
            onClick={openCart}
            className="p-2 relative hover:opacity-70 transition-opacity flex items-center"
            aria-label="Carrinho de compras"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-black text-brand-offwhite border-t border-zinc-800 p-6 space-y-6 flex flex-col uppercase text-sm font-medium tracking-widest animate-fadeIn">
          <Link
            href="/colecao/origo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-red transition"
          >
            Drop 01 — Origo
          </Link>
          <Link
            href="/sobre"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-red transition"
          >
            Sobre A Marca
          </Link>
          <Link
            href="/journal"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-red transition"
          >
            Journal
          </Link>
          <Link
            href="/contato"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-brand-red transition"
          >
            Contato
          </Link>
        </div>
      )}
    </header>
  );
}
