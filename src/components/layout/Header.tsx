'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING: LOGO EM BRANCO + WORDMARK PNG DO LAROMME */}
        <Link href="/" className="flex items-center gap-3.5 group cursor-pointer select-none">
          {/* Logo do Elmo em Branco */}
          <img 
            src="/logo-branca.png" 
            alt="LaRomme Logo" 
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Nome LaRomme na tipografia oficial (Invertido para branco puro) */}
          <img 
            src="/laromme-wordmark.png" 
            alt="LaRomme" 
            className="h-6 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>

        {/* NAVEGAÇÃO CENTRAL */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/colecao/origo" className="text-zinc-400 hover:text-white transition-colors">ORIGO</Link>
          <Link href="/journal" className="text-zinc-400 hover:text-white transition-colors">JOURNAL</Link>
          <Link href="/sobre" className="text-zinc-400 hover:text-white transition-colors">MANIFESTO</Link>
        </nav>

        {/* BOTAO SENADO VIP */}
        <div className="flex items-center gap-4">
          <Link 
            href="/acesso" 
            className="text-white bg-zinc-950 hover:bg-brand-red border border-zinc-800 hover:border-brand-red px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            [ SENADO VIP ]
          </Link>
        </div>

      </div>
    </header>
  );
}