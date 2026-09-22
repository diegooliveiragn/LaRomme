'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { EASINGS, DURATIONS } from '@/config/motion';

export function ManifestoSection() {
  return (
    <section className="py-36 sm:py-48 bg-brand-black text-brand-offwhite relative overflow-hidden border-y border-zinc-900">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
        
        {/* Código de Arquivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="font-mono text-[10px] text-brand-red tracking-widest uppercase"
        >
          {siteConfig.coordinates} • {siteConfig.location}
        </motion.div>

        {/* Título do Manifesto */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light italic leading-tight text-zinc-200"
        >
          "{siteConfig.slogans.manifesto}"
        </motion.h2>

        {/* Texto do Manifesto */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic, delay: 0.2 }}
          className="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Não construímos vestuário efêmero. Unimos a rigidez histórica de Roma ao movimento contínuo de Fortaleza. Criado para resistir ao tempo e ao desgaste da arena.
        </motion.p>

        {/* Selo do Código */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic, delay: 0.3 }}
          className="pt-6"
        >
          <span className="inline-block border border-zinc-800 text-zinc-500 font-mono text-[9px] uppercase px-4 py-2 tracking-widest">
            CHAPTER 01 / PERMANENCE
          </span>
        </motion.div>
      </div>
    </section>
  );
}