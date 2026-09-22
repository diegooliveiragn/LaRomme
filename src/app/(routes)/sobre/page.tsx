'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EASINGS, DURATIONS } from '@/config/motion';
import { siteConfig } from '@/config/site';

export default function SobrePage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 selection:bg-brand-red selection:text-white">
      
      {/* 1. HERO - Abertura Monumental */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-24 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="space-y-6"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            {siteConfig.coordinates}
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wide leading-none">
            A Sua Casa.<br />
            <span className="text-zinc-600">A Sua Força.</span>
          </h1>
        </motion.div>
      </section>

      {/* 2. CAPÍTULO I - ROMA */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="md:col-span-5 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            [ Capítulo 01 ]
            <h2 className="font-serif text-3xl sm:text-4xl text-white mt-4 tracking-wider leading-tight">
              A Disciplina<br />de Roma
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic, delay: 0.1 }}
            className="md:col-span-7 space-y-6 font-sans text-xs uppercase tracking-widest leading-relaxed text-zinc-400"
          >
            <p>
              Não olhamos para a antiguidade como um museu, mas como um código de conduta. A grandiosidade romana não estava apenas no mármore, mas na fundação de um império construído sobre a ordem, o estoicismo e a permanência.
            </p>
            <p>
              A LaRomme extrai essa solidez arquitetônica e a transforma em vestuário. Nossas peças são projetadas com o rigor de quem constrói monumentos: cortes exatos, costuras que resistem ao tempo e tecidos pesados que funcionam como uma armadura urbana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PAUSA VISUAL 1 - Placeholder de Imagem */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="w-full aspect-[21/9] bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <span className="font-serif text-5xl text-zinc-800 opacity-30">LR</span>
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-4">
            [ Arquivo Visual: Cultura & Geometria ]
          </span>
        </motion.div>
      </section>

      {/* 3. CAPÍTULO II - FORTALEZA */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-zinc-900 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="md:col-span-5 font-mono text-[10px] uppercase tracking-widest text-zinc-500"
          >
            [ Capítulo 02 ]
            <h2 className="font-serif text-3xl sm:text-4xl text-white mt-4 tracking-wider leading-tight">
              O Movimento<br />de Fortaleza
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic, delay: 0.1 }}
            className="md:col-span-7 space-y-6 font-sans text-xs uppercase tracking-widest leading-relaxed text-zinc-400"
          >
            <p>
              Onde há estrutura, é preciso haver vida. Fortaleza é o nosso território, nosso vento e nosso sol inclemente. É a cidade que exige mobilidade, respiração e adaptação constante.
            </p>
            <p>
              A energia costeira e o ritmo do esporte ditam a performance das nossas linhas dinâmicas. Tecidos ultraleves, cavas profundas e tecnologia de evaporação rápida garantem que o corpo não tenha restrições, seja na areia, no asfalto ou na arena.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PAUSA VISUAL 2 - Placeholder de Imagem */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="w-full aspect-[21/9] bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <span className="font-serif text-5xl text-zinc-800 opacity-30">LR</span>
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-4">
            [ Arquivo Visual: Território & Mar ]
          </span>
        </motion.div>
      </section>

      {/* 4. OS PILARES (Manifesto) */}
      <section className="max-w-4xl mx-auto px-6 py-24 mt-12 text-center border-t border-zinc-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
        >
          <h2 className="font-mono text-[10px] text-brand-red uppercase tracking-widest mb-12">
            Os Pilares
          </h2>
          <div className="space-y-16">
            <div>
              <h3 className="font-serif text-3xl font-bold uppercase tracking-widest text-white mb-4">Disciplina</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-zinc-500 max-w-md mx-auto">
                A fundação do progresso. A ordem que antecede a genialidade. O compromisso silencioso com a evolução diária.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-3xl font-bold uppercase tracking-widest text-white mb-4">Liberdade</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-zinc-500 max-w-md mx-auto">
                O prêmio da disciplina. A mobilidade absoluta. A quebra das restrições corporais e geográficas.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-3xl font-bold uppercase tracking-widest text-white mb-4">Permanência</h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-zinc-500 max-w-md mx-auto">
                O rechaço ao efêmero. O que é construído para durar — no guarda-roupa, na mente e na cultura.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. CALL TO ACTION FINAL */}
      <section className="max-w-xl mx-auto px-6 pt-12 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
          className="flex flex-col items-center space-y-8"
        >
          <p className="font-serif text-xl italic text-zinc-400">
            "Disciplina também é liberdade."
          </p>
          <Link 
            href="/acesso" 
            className="font-mono text-[10px] uppercase tracking-widest text-brand-black bg-white px-8 py-4 hover:bg-brand-red hover:text-white transition-colors duration-300"
          >
            [ Solicitar Acesso ao Arquivo ]
          </Link>
        </motion.div>
      </section>

    </div>
  );
}