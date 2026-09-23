'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';

export default function HomePage() {
  return (
    <main className="relative bg-brand-black min-h-screen text-brand-offwhite overflow-hidden flex flex-col justify-between pt-24 selection:bg-brand-red selection:text-white">
      
      {/* VÍDEO DO MAR LOCAL (praialandscape.mov) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-60 filter grayscale contrast-125"
        >
          <source src="/praialandscape.mov" type="video/quicktime" />
          <source src="/praialandscape.mov" type="video/mp4" />
        </video>

        {/* Camada sutil de escurecimento para garantir contraste */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-transparent to-brand-black"></div>
      </div>

      {/* COORDENADAS SUPERIORES */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex justify-between font-mono text-[9px] text-zinc-500 pointer-events-none hidden sm:flex">
        <span>+ 03°44'S 38°31'W</span>
        <span>ANNO MMXXVI +</span>
      </div>

      {/* CONTEÚDO HERO CENTRAL */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-12 pb-16 flex-1 flex flex-col justify-center items-center text-center">
        
        <FadeIn direction="down" duration={1}>
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-3 border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
              <span className="font-mono text-[9px] text-brand-offwhite uppercase tracking-[0.25em]">
                Senado Privado // Lote Zero
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn duration={1.2} delay={0.2}>
          <div className="relative inline-block my-2">
            <h1 className="font-serif text-7xl sm:text-9xl md:text-[150px] uppercase tracking-wider text-white leading-none select-none drop-shadow-2xl">
              Origo
            </h1>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest absolute -top-4 right-0 hidden sm:block whitespace-nowrap">
              [ CAPÍTULO I ]
            </span>
          </div>
        </FadeIn>

        <FadeIn direction="up" duration={1} delay={0.4}>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 uppercase tracking-[0.2em] max-w-xl mx-auto mt-4 leading-relaxed font-light">
            A origem do vestuário de alta densidade. Estruturas brutalistas inspiradas na engenharia romana.
          </p>
        </FadeIn>

        {/* BOTÕES BLINDADOS COM WHITESPACE-NOWRAP */}
        <FadeIn direction="up" duration={1} delay={0.6}>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto">
            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link 
                href="/acesso" 
                className="block w-full bg-white text-brand-black px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 shadow-2xl text-center border border-white whitespace-nowrap"
              >
                [ REQUISITAR ACESSO ]
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link 
                href="/colecao/origo" 
                className="block w-full bg-zinc-950/80 border border-zinc-800 text-zinc-300 px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300 backdrop-blur-sm text-center whitespace-nowrap"
              >
                [ DOSSIÊ ORIGO ]
              </Link>
            </motion.div>
          </div>
        </FadeIn>

      </div>

      {/* PAINEL TÉCNICO INFERIOR (TEXTOS BLINDADOS COM WHITESPACE-NOWRAP) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-10 pt-6 border-t border-zinc-900/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[9px] uppercase tracking-widest">
          
          <div className="border-l border-zinc-800 pl-4 space-y-1 overflow-hidden">
            <span className="text-zinc-600 block whitespace-nowrap">ESTRUTURA</span>
            <span className="text-white font-bold block whitespace-nowrap">400G/M² HEAVYWEIGHT</span>
            <span className="text-zinc-600 text-[8px] block pt-1 whitespace-nowrap">+ OPUS CAEMENTICIUM</span>
          </div>

          <div className="border-l border-zinc-800 pl-4 space-y-1 overflow-hidden">
            <span className="text-zinc-600 block whitespace-nowrap">MATRIZ</span>
            <span className="text-white font-bold block whitespace-nowrap">05 ARTEFATOS EXCLUSIVOS</span>
            <span className="text-zinc-600 text-[8px] block pt-1 whitespace-nowrap">+ LOTE ZERO</span>
          </div>

          <div className="border-l border-zinc-800 pl-4 space-y-1 overflow-hidden">
            <span className="text-zinc-600 block whitespace-nowrap">ENGENHARIA</span>
            <span className="text-white font-bold block whitespace-nowrap">CORTE BOXY & ATHLETIC</span>
            <span className="text-zinc-600 text-[8px] block pt-1 whitespace-nowrap">+ RIGID FIT</span>
          </div>

          <div className="border-l border-zinc-800 pl-4 space-y-1 overflow-hidden">
            <span className="text-zinc-600 block whitespace-nowrap">STATUS</span>
            <span className="text-brand-red font-bold block whitespace-nowrap">[ COFRE TRANCADO ]</span>
            <span className="text-zinc-600 text-[8px] block pt-1 whitespace-nowrap">EX NIHILO +</span>
          </div>

        </div>
      </div>

    </main>
  );
}