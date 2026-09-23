'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING: SÍMBOLO + NOME LAROMME (LINK PARA A HOME) */}
        <Link 
          href="/" 
          className="group flex items-center gap-3.5 cursor-pointer select-none"
        >
          {/* Símbolo do Elmo */}
          <div className="w-8 h-8 border border-zinc-800 bg-zinc-950 flex items-center justify-center rounded-sm group-hover:border-brand-red transition-colors duration-300">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-4 h-4 text-white group-hover:text-brand-red transition-colors duration-300"
              strokeWidth="1.5"
            >
              <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
              <path d="M12 6v10M8 10h8" />
            </svg>
          </div>

          {/* Nome de Marca LaRomme em destaque */}
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-[0.2em] uppercase text-white font-bold group-hover:text-zinc-300 transition-colors duration-300 leading-none">
              LaRomme
            </span>
            <span className="font-mono text-[8px] text-zinc-500 tracking-[0.25em] uppercase mt-1">
              Opus Caementicium
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO CENTRAL & ACESSO */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/colecao/origo" className="text-zinc-400 hover:text-white transition-colors">
            ORIGO
          </Link>
          <Link href="/journal" className="text-zinc-400 hover:text-white transition-colors">
            JOURNAL
          </Link>
          <Link href="/sobre" className="text-zinc-400 hover:text-white transition-colors">
            MANIFESTO
          </Link>
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