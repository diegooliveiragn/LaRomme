'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';

export default function HomePage() {
  return (
    <main className="relative bg-brand-black min-h-screen text-brand-offwhite overflow-hidden flex flex-col justify-between">
      
      {/* VÍDEO DO MAR EM LOOPING COM OVERLAY SOMBRIO */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-105 opacity-30 filter grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-dramatic-dark-ocean-waves-42867-large.mp4" type="video/mp4" />
        </video>
        {/* Gradiante Brutalista escurecendo o topo e a base */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/60 to-brand-black"></div>
      </div>

      {/* CONTEÚDO HERO PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-40 pb-20 flex-1 flex flex-col justify-center items-center text-center">
        
        <FadeIn direction="down" duration={1}>
          <div className="space-y-3 mb-6">
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-[0.3em] block">
              Anno MMXXVI // Acesso Privado
            </span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
              Opus Caementicium // Capítulo I
            </span>
          </div>
        </FadeIn>

        <FadeIn duration={1.2} delay={0.2}>
          <h1 className="font-serif text-7xl sm:text-9xl md:text-[140px] uppercase tracking-wider text-white leading-none select-none my-4">
            Origo
          </h1>
        </FadeIn>

        <FadeIn direction="up" duration={1} delay={0.4}>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 uppercase tracking-widest max-w-xl mx-auto mt-4 leading-relaxed">
            A origem do vestuário de alta densidade. Estruturas brutalistas inspiradas na engenharia romana.
          </p>
        </FadeIn>

        <FadeIn direction="up" duration={1} delay={0.6}>
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/acesso" 
              className="w-full sm:w-auto bg-white text-brand-black px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-500 shadow-2xl"
            >
              [ REQUISITAR ACESSO // LOTE ZERO ]
            </Link>
            <Link 
              href="/colecao/origo" 
              className="w-full sm:w-auto bg-zinc-950/80 border border-zinc-800 text-zinc-300 px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              [ DOSSIÊ DA COLEÇÃO ]
            </Link>
          </div>
        </FadeIn>

      </div>

      {/* RODAPÉ DO HERO (MICRO-COPY ROMANO) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-12 border-t border-zinc-900/60 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-[9px] text-zinc-600 uppercase tracking-widest text-center sm:text-left">
          <div>
            <span className="text-zinc-400 block mb-1">PROTOCOLO</span>
            <span>Edição Limitada // Lote Zero</span>
          </div>
          <div className="sm:text-center">
            <span className="text-zinc-400 block mb-1">ENGENHARIA</span>
            <span>400G/M² Heavyweight & Performance</span>
          </div>
          <div className="sm:text-right">
            <span className="text-zinc-400 block mb-1">STATUS</span>
            <span className="text-brand-red">[ COFRE TRANCADO ]</span>
          </div>
        </div>
      </div>

    </main>
  );
}