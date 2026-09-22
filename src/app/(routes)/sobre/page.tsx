'use client';

import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { EASINGS, DURATIONS } from '@/config/motion';

export default function SobrePage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-36 pb-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 space-y-32">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="space-y-6 text-center max-w-3xl mx-auto"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            {siteConfig.coordinates} • {siteConfig.location}
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-bold uppercase tracking-wider">
            A Marca
          </h1>
          <p className="font-serif text-xl italic text-zinc-300">
            "A força de Roma. O movimento de Fortaleza."
          </p>
        </motion.div>

        {/* Bloco 01: Origem */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-zinc-900 pt-16"
        >
          <div className="lg:col-span-4 font-mono text-[11px] text-brand-red uppercase tracking-widest space-y-2">
            <p>[ CAPÍTULO I ]</p>
            <p className="text-zinc-500">TERRITÓRIO & LUZ</p>
          </div>
          <div className="lg:col-span-8 space-y-6 font-sans text-xs sm:text-sm text-zinc-300 uppercase tracking-wider leading-relaxed">
            <p>
              A LaRomme nasceu nas praias de Fortaleza. Não da estética turística, mas da atmosfera real: o sol inclemente, o vento constante, a areia e a cultura esportiva que exige mobilidade e resistência diária.
            </p>
            <p>
              Fortaleza nos deu a fluidez e a necessidade da performance real. Roma nos deu o código de disciplina, permanência e monumentalidade controlada.
            </p>
          </div>
        </motion.div>

        {/* Bloco 02: Tensão de Design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-zinc-900 pt-16"
        >
          <div className="lg:col-span-4 font-mono text-[11px] text-brand-red uppercase tracking-widest space-y-2">
            <p>[ CAPÍTULO II ]</p>
            <p className="text-zinc-500">O MATERIAL & A ARENA</p>
          </div>
          <div className="lg:col-span-8 space-y-6 font-sans text-xs sm:text-sm text-zinc-300 uppercase tracking-wider leading-relaxed">
            <p>
              Recusamos o vestuário descartável. Cada peça do Drop 01 foi projetada a partir da escolha rigorosa de tecidos com alta gramatura para o lifestyle e fios tecnológicos para o esporte de alta intensidade.
            </p>
            <p>
              O vestuário deve agir como uma armadura contemporânea: leve o suficiente para a liberdade de movimento, forte o bastante para durar gerações.
            </p>
          </div>
        </motion.div>

        {/* Fechamento com Coordenadas de Arquivo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center pt-12 border-t border-zinc-900"
        >
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            ARQUIVO OFICIAL LAROMME
          </span>
          <span className="font-serif text-3xl font-bold uppercase tracking-widest text-brand-offwhite">
            ORIGO / ESTILO • PERFORMANCE • PERTENCIMENTO
          </span>
        </motion.div>
      </div>
    </div>
  );
}