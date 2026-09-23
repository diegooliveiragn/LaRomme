'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';

export default function SobrePage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-5xl mx-auto space-y-40">
        
        {/* INTRODUÇÃO / MANIFESTO */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUpVariants} className="space-y-8 text-center max-w-3xl mx-auto border-b border-zinc-900 pb-20">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">O Manifesto</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider text-white">
            Disciplina e Liberdade.
          </h1>
          <p className="font-sans text-sm text-zinc-400 uppercase tracking-widest leading-loose">
            A LaRomme nasce da intersecção exata entre a engenharia atemporal de Roma e a fluidez incansável da costa de Fortaleza. Não somos uma marca de roupas. Somos um estúdio de design focado na estrutura, no movimento e na permanência do código.
          </p>
        </motion.div>

        {/* BLOCO 1: TERRITÓRIO E MAR */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUpVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">01 // O Chão</span>
            <h2 className="font-serif text-3xl uppercase tracking-wider text-white">Território e Mar</h2>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              A nossa base tátil. Onde a cidade encontra o oceano, nós encontramos a nossa textura. O sal, a pedra, o vento constante. A roupa deve ser desenhada para resistir, proteger e performar no nosso ambiente natural.
            </p>
          </div>
          
          <div className="order-1 md:order-2 relative aspect-[4/5] bg-zinc-950 overflow-hidden border border-zinc-900 group">
            {/* VÍDEO EM LOOP AUTORAL */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-70 transition-opacity duration-1000 scale-105 group-hover:scale-100 ease-out">
              <source src="/territorio-mar.mp4" type="video/mp4" />
              <source src="/territorio-mar.mov" type="video/quicktime" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest bg-brand-black/90 px-3 py-2 border border-zinc-800">
                [ Arquivo Visual ] // 03°43'16"S
              </span>
            </div>
          </div>
        </motion.div>

        {/* BLOCO 2: CULTURA E GEOMETRIA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUpVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden border border-zinc-900 group">
             {/* VÍDEO EM LOOP AUTORAL */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-70 transition-opacity duration-1000 scale-105 group-hover:scale-100 ease-out">
              <source src="/cultura-geometria.mp4" type="video/mp4" />
              <source src="/cultura-geometria.mov" type="video/quicktime" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 right-6">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest bg-brand-black/90 px-3 py-2 border border-zinc-800">
                [ Arquivo Visual ] // A Forma
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">02 // A Estrutura</span>
            <h2 className="font-serif text-3xl uppercase tracking-wider text-white">Geometria e Cultura</h2>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              O pilar mental da LaRomme. Utilizamos a simetria imperial e a escultura clássica como parâmetros de alfaiataria. Peças que não gritam, mas que dominam o espaço pela silhueta exata e pelo corte intransigente.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}