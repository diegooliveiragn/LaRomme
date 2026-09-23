'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-[2px] transition-all duration-300 pointer-events-auto">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING: LOGO BRANCA + NOME LAROMME */}
        <Link href="/" className="flex items-center gap-3.5 group cursor-pointer select-none">
          <img 
            src="/logo-branca.png" 
            alt="LaRomme Logo" 
            className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <img 
            src="/laromme-wordmark.png" 
            alt="LaRomme" 
            className="h-5 sm:h-6 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/colecao/origo" className="text-zinc-400 hover:text-white transition-colors">ORIGO</Link>
          <Link href="/journal" className="text-zinc-400 hover:text-white transition-colors">JOURNAL</Link>
          <Link href="/sobre" className="text-zinc-400 hover:text-white transition-colors">MANIFESTO</Link>
        </nav>

        {/* BOTÃO SENADO VIP */}
        <div className="flex items-center gap-4">
          <Link 
            href="/acesso" 
            className="text-white bg-black/60 hover:bg-brand-red border border-zinc-800/80 hover:border-brand-red px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 backdrop-blur-md"
          >
            [ SENADO VIP ]
          </Link>
        </div>

      </div>
    </header>
  );
}