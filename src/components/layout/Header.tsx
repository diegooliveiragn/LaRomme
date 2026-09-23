'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-black/85 backdrop-blur-md border-b border-zinc-900/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO SUTIL + WORDMARK LAROMME (RETORNO À HOME) */}
        <Link 
          href="/" 
          className="group flex items-center gap-3.5 cursor-pointer select-none"
        >
          {/* Símbolo Gráfico Sutil (Elmo / Escudo Romano em Vetor) */}
          <div className="w-7 h-7 border border-zinc-800 bg-zinc-950 flex items-center justify-center rounded-sm group-hover:border-brand-red/60 transition-colors duration-300">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              className="w-4 h-4 text-zinc-400 group-hover:text-brand-red transition-colors duration-300"
              strokeWidth="1.5"
            >
              <path d="M12 2L4 7v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
              <path d="M12 6v10M8 10h8" />
            </svg>
          </div>

          {/* Wordmark Tipográfico em Libre Baskerville */}
          <div className="flex flex-col">
            <span className="font-serif text-base tracking-[0.25em] uppercase text-white group-hover:text-zinc-300 transition-colors duration-300">
              LaRomme
            </span>
            <span className="font-mono text-[8px] text-zinc-600 tracking-widest uppercase -mt-1 hidden sm:block">
              Opus Caementicium
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO & ATALHOS */}
        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest">
          <Link 
            href="/colecao/origo" 
            className="text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            [ DOSSIÊ ORIGO ]
          </Link>
          <Link 
            href="/acesso" 
            className="text-white bg-zinc-900 hover:bg-brand-red border border-zinc-800 px-4 py-2 transition-all duration-300 shadow-lg"
          >
            [ SENADO VIP ]
          </Link>
        </div>

      </div>
    </header>
  );
}