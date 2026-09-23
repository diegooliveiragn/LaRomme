'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  // Sua logomarca original convertida em alta definição (Branco Puro)
  const logoBase64 = "data:image/png;base64,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";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* BRANDING: SÍMBOLO ORIGINAL + NOME LaRomme */}
        <Link 
          href="/" 
          className="group flex items-center gap-4 cursor-pointer select-none"
        >
          {/* Logo Original (Branca) */}
          <div className="relative w-12 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Image src={logoBase64} alt="LaRomme Logo" fill className="object-contain" unoptimized />
          </div>

          {/* Nome de Marca LaRomme (Respeitando a caixa exata) */}
          <div className="flex flex-col">
            <span className="font-serif text-[22px] tracking-[0.15em] text-white font-bold group-hover:text-zinc-300 transition-colors duration-300 leading-none">
              LaRomme
            </span>
            <span className="font-mono text-[8px] text-zinc-500 tracking-[0.25em] uppercase mt-1">
              Opus Caementicium
            </span>
          </div>
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