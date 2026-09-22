'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';

export function ArchitectureOfMovement() {
  const artifacts = [
    {
      id: '01',
      name: 'VESTIGIUM',
      category: 'Lifestyle',
      attributes: [
        { label: 'Matéria', value: 'Algodão Heavyweight 300g' },
        { label: 'Modelagem', value: 'Boxy / Oversized' },
        { label: 'Foco', value: 'Estrutura & Permanência' }
      ]
    },
    {
      id: '02',
      name: 'FORZA',
      category: 'Performance',
      attributes: [
        { label: 'Matéria', value: 'Fiação Tech Dry (Proteção UV)' },
        { label: 'Modelagem', value: 'Relaxed Anatômica' },
        { label: 'Foco', value: 'Respirabilidade & Intensidade' }
      ]
    },
    {
      id: '03',
      name: 'LIBERTAS',
      category: 'Performance',
      attributes: [
        { label: 'Matéria', value: 'Tecido Microperfurado Ultraleve' },
        { label: 'Modelagem', value: 'Cava Profunda S/ Fricção' },
        { label: 'Foco', value: 'Amplitude & Liberdade' }
      ]
    },
    {
      id: '04',
      name: 'SIGNUM',
      category: 'Acessório',
      attributes: [
        { label: 'Matéria', value: 'Sarja Encorpada 100% Algodão' },
        { label: 'Construção', value: 'Seis Gomos & Fivela Metálica' },
        { label: 'Foco', value: 'Identificação & Código Visual' }
      ]
    }
  ];

  return (
    <section className="py-24 border-t border-zinc-900 bg-brand-black">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
              [ O Sistema ]
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
              A Arquitetura<br />do Movimento
            </h2>
          </div>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed max-w-sm">
            Nossos artefatos não são apenas tecidos costurados. Eles são máquinas projetadas para funções específicas no ecossistema LaRomme.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artifacts.map((artifact, i) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: DURATIONS.medium, delay: i * 0.1, ease: EASINGS.cinematic }}
              className="border border-zinc-800 p-6 md:p-8 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors group flex flex-col justify-between"
            >
              <div className="mb-12">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-serif text-2xl text-white uppercase tracking-wider group-hover:text-brand-red transition-colors">{artifact.name}</span>
                  <span className="font-mono text-[9px] text-zinc-600">[{artifact.id}]</span>
                </div>
                <span className="inline-block px-2 py-1 border border-brand-red/30 text-brand-red font-mono text-[9px] uppercase tracking-widest bg-brand-red/5">
                  {artifact.category}
                </span>
              </div>

              <div className="space-y-4">
                {artifact.attributes.map((attr, j) => (
                  <div key={j} className="border-t border-zinc-800/50 pt-3">
                    <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">{attr.label}</span>
                    <span className="block font-sans text-xs text-zinc-300 uppercase tracking-wider">{attr.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}