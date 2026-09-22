'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';

export default function TamanhoPage() {
  const tables = [
    {
      title: 'VESTIGIUM',
      subtitle: 'Camiseta Algodão (Modelagem Boxy / Oversized)',
      description: 'Caimento estruturado com ombros deslocados. Medidas de peça final.',
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento (cm)', 'Manga (cm)'],
      rows: [
        ['P', '108', '72', '22'],
        ['M', '114', '75', '23'],
        ['G', '128*', '78', '24'],
        ['GG', '126*', '81', '25'],
      ],
      note: '* Gradação de tórax entre G e GG sob validação física final de amostragem.'
    },
    {
      title: 'FORZA',
      subtitle: 'Camiseta Sport (Relaxed Performance)',
      description: 'Caimento anatômico livre para mobilidade corporal.',
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento (cm)'],
      rows: [
        ['P', '104', '70'],
        ['M', '110', '73'],
        ['G', '116', '76'],
        ['GG', '122', '79'],
      ]
    },
    {
      title: 'LIBERTAS',
      subtitle: 'Regata Performance (Loose / Cava Profunda)',
      description: 'Projetada para amplitude total de movimento sem restrições.',
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento (cm)'],
      rows: [
        ['P', '102', '71'],
        ['M', '108', '74'],
        ['G', '114', '77'],
        ['GG', '120', '80'],
      ]
    }
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            Especificações de Peça
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Estrutura & Medidas
          </h1>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
            Consulte a tabela abaixo para identificar as proporções exatas de cada artefato.
          </p>
        </motion.div>

        <div className="space-y-12">
          {tables.map((table, index) => (
            <motion.div 
              key={table.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATIONS.medium, delay: index * 0.1, ease: EASINGS.cinematic }}
              className="border border-zinc-800 p-6 md:p-10 bg-zinc-900/20"
            >
              <div className="mb-8">
                <h2 className="font-serif text-2xl uppercase tracking-wider text-white mb-2">{table.title}</h2>
                <p className="font-mono text-[10px] text-brand-red uppercase tracking-widest mb-2">{table.subtitle}</p>
                <p className="font-sans text-[10px] uppercase text-zinc-500">{table.description}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] uppercase tracking-widest min-w-[500px]">
                  <thead className="text-zinc-500 border-b border-zinc-800">
                    <tr>
                      {table.headers.map(h => (
                        <th key={h} className="pb-4 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    {table.rows.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="py-4">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {table.note && (
                <p className="font-sans text-[9px] text-zinc-500 uppercase tracking-widest mt-4">
                  {table.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}