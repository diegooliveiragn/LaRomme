'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/FadeIn';

export default function HomePage() {
  return (
    <main className="relative bg-brand-black min-h-screen text-brand-offwhite overflow-hidden flex flex-col justify-between selection:bg-brand-red selection:text-white">
      
      {/* VÍDEO DO MAR EM LOOPING (PRAIA ORIGO) + OVERLAY CINEMÁTICO */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
          alt="Mare Nostrum" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale contrast-125"
        />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-50 filter grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-dramatic-dark-ocean-waves-42867-large.mp4" type="video/mp4" />
        </video>

        {/* Gradiente Brutalista para Leitura Perfeita */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-transparent to-brand-black"></div>
      </div>

      {/* GRAFISMOS ROMANOS // CRUZES DE PRECISÃO NOS CANTOS */}
      <div className="absolute top-8 left-8 z-10 font-mono text-[9px] text-zinc-600 pointer-events-none hidden sm:block">+ 03°44'S 38°31'W</div>
      <div className="absolute top-8 right-8 z-10 font-mono text-[9px] text-zinc-600 pointer-events-none hidden sm:block">ANNO MMXXVI +</div>
      <div className="absolute bottom-8 left-8 z-10 font-mono text-[9px] text-zinc-600 pointer-events-none hidden sm:block">+ OPUS CAEMENTICIUM</div>
      <div className="absolute bottom-8 right-8 z-10 font-mono text-[9px] text-zinc-600 pointer-events-none hidden sm:block">EX NIHILO +</div>

      {/* CONTEÚDO HERO PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-36 pb-16 flex-1 flex flex-col justify-center items-center text-center">
        
        <FadeIn direction="down" duration={1}>
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-3 border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 py-1.5 rounded-full">
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
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest absolute -top-4 right-0 hidden sm:block">
              [ CAPÍTULO I ]
            </span>
          </div>
        </FadeIn>

        <FadeIn direction="up" duration={1} delay={0.4}>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 uppercase tracking-[0.2em] max-w-xl mx-auto mt-4 leading-relaxed font-light">
            A origem do vestuário de alta densidade. Estruturas brutalistas inspiradas na engenharia romana.
          </p>
        </FadeIn>

        {/* BOTÕES COM FEEDBACK TÁTIL MOBILE (whileTap) */}
        <FadeIn direction="up" duration={1} delay={0.6}>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto">
            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link 
                href="/acesso" 
                className="block w-full bg-white text-brand-black px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 shadow-2xl text-center border border-white"
              >
                [ REQUISITAR ACESSO ]
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex-1">
              <Link 
                href="/colecao/origo" 
                className="block w-full bg-zinc-950/80 border border-zinc-800 text-zinc-300 px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300 backdrop-blur-sm text-center"
              >
                [ DOSSIÊ ORIGO ]
              </Link>
            </motion.div>
          </div>
        </FadeIn>

      </div>

      {/* BARRA DE ESPECIFICAÇÕES ROMANAS DA BASE */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-12 border-t border-zinc-900/80 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[9px] text-zinc-400 uppercase tracking-widest text-center sm:text-left">
          <div className="border-l border-zinc-900 pl-3">
            <span className="text-zinc-600 block mb-0.5">ESTRUTURA</span>
            <span className="text-white">400G/M² Heavyweight</span>
          </div>
          <div className="border-l border-zinc-900 pl-3">
            <span className="text-zinc-600 block mb-0.5">MATRIZ</span>
            <span className="text-white">05 Artefatos Exclusivos</span>
          </div>
          <div className="border-l border-zinc-900 pl-3">
            <span className="text-zinc-600 block mb-0.5">ENGENHARIA</span>
            <span className="text-white">Corte Boxy & Athletic</span>
          </div>
          <div className="border-l border-zinc-900 pl-3 sm:text-right">
            <span className="text-zinc-600 block mb-0.5">STATUS</span>
            <span className="text-brand-red">[ COFRE TRANCADO ]</span>
          </div>
        </div>
      </div>

    </main>
  );
}