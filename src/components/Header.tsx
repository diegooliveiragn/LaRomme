'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const HELMET_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png";
const WORDMARK_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/fcfc607a-ba81-4ff7-998e-2df1f0697b81-removebg-preview.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, isLoaded } = useCart();

  const count = isLoaded ? totalItems : 0;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7 filter brightness-0 invert">
            <Image src={HELMET_LOGO_URL} alt="LaRomme Capacete" fill className="object-contain" priority />
          </div>
          <div className="relative w-28 h-6 filter brightness-0 invert">
            <Image src={WORDMARK_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.25em] uppercase text-zinc-300 font-sans">
          <Link href="/" className="hover:text-white transition-colors">ORIGO / 01.</Link>
          <Link href="/a-marca" className="hover:text-white transition-colors">A MARCA.</Link>
          <Link href="/o-movimento" className="hover:text-white transition-colors">O MOVIMENTO.</Link>
          <Link href="/editorial" className="hover:text-white transition-colors">EDITORIAL.</Link>
          <Link href="/senado-vip" className="hover:text-white transition-colors">SENADO VIP.</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all font-sans">
            CARRINHO ({count}).
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 focus:outline-none"
            aria-label="Abrir Menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center px-10 space-y-6 text-sm tracking-[0.3em] uppercase font-medium border-b border-white/10 lg:hidden font-sans">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-white">ORIGO / 01.</Link>
          <Link href="/a-marca" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">A MARCA.</Link>
          <Link href="/o-movimento" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">O MOVIMENTO.</Link>
          <Link href="/editorial" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">EDITORIAL.</Link>
          <Link href="/senado-vip" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">SENADO VIP.</Link>
        </div>
      )}
    </>
  );
}