'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';

export default function JournalPage() {
  const categories = [
    { title: 'MATERIAL', desc: 'Tecidos, texturas, gramaturas e a física por trás do toque.' },
    { title: 'MOVEMENT', desc: 'O corpo no espaço. A roupa em estado de performance e tensão.' },
    { title: 'TERRITORY', desc: 'A arquitetura, a luz e o chão de Fortaleza. Nosso contexto.' },
    { title: 'CULTURE', desc: 'As referências romanas decodificadas para o presente.' },
    { title: 'PROCESS', desc: 'O desenvolvimento, a costura e as decisões de design.' }
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUpVariants}
          className="border-b border-zinc-900 pb-12"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            LaRomme Visual Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Journal
          </h1>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mt-6 max-w-lg leading-relaxed">
            Registros, referências e materialidade. O acervo visual oficial da marca classificado por código de origem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: DURATIONS.slow, ease: EASINGS.cinematic }}
              variants={fadeInUpVariants}
              className="group border border-zinc-900 p-8 hover:border-zinc-700 transition-colors bg-zinc-900/10"
            >
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white mb-4 group-hover:text-brand-red transition-colors">
                {cat.title}
              </h2>
              <p className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                {cat.desc}
              </p>
              <div className="mt-8 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
                [ Arquivos pendentes de liberação ]
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}