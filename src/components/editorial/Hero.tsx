'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { EASINGS, DURATIONS, staggerContainerVariants, fadeInUpVariants } from '@/config/motion';

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center bg-brand-black text-brand-offwhite pt-24 pb-16 overflow-hidden">
      {/* Background Cinematográfico - Efeito de grão/textura e gradiente suave */}
      <motion.div 
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: EASINGS.cinematic }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=3433&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale" 
      />
      
      {/* Overlay Escuro para Legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/60 to-brand-black z-0" />

      <motion.div 
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-10"
      >
        {/* Subtítulo Reveal */}
        <motion.div variants={fadeInUpVariants} className="inline-block border-y border-brand-red/40 py-2 px-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-editorial font-bold text-brand-red">
            Drop 01 — Origo
          </span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1 
          variants={fadeInUpVariants}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.95]"
        >
          {siteConfig.slogans.hero.split('. ').map((part, index, array) => (
            <span key={index} className="block">
              {part}{index !== array.length - 1 ? '.' : ''}
            </span>
          ))}
        </motion.h1>

        {/* Parágrafo Narrativo */}
        <motion.p 
          variants={fadeInUpVariants}
          className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-300 uppercase tracking-widest leading-relaxed opacity-90"
        >
          Inspirada na força dos guerreiros de Roma e na energia das praias. Nasceu para ser a sua casa. Seu território. Sua identidade.
        </motion.p>

        {/* CTA (Call to Action) */}
        <motion.div variants={fadeInUpVariants} className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/colecao/origo"
            className="w-full sm:w-auto bg-brand-red text-white text-xs font-bold uppercase tracking-editorial px-10 py-5 hover:bg-red-700 transition-all shadow-xl"
          >
            Explorar O Capítulo
          </Link>
        </motion.div>

        {/* Pilares da Marca */}
        <motion.div 
          variants={fadeInUpVariants} 
          className="pt-16 flex justify-center items-center gap-8 text-[10px] text-zinc-500 uppercase tracking-widest font-mono"
        >
          <span>{siteConfig.slogans.pillars}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}