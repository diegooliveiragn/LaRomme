'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EASINGS, DURATIONS } from '@/config/motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  // Travar o scroll da página de fundo quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const tables = [
    {
      title: 'VESTIGIUM',
      subtitle: 'Camiseta Algodão (Modelagem Boxy / Oversized)',
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento', 'Manga'],
      rows: [
        ['P', '108', '72', '22'],
        ['M', '114', '75', '23'],
        ['G', '128*', '78', '24'],
        ['GG', '126*', '81', '25'],
      ],
      note: '* Gradação G e GG sob validação física final.'
    },
    {
      title: 'FORZA',
      subtitle: 'Camiseta Sport (Relaxed Performance)',
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento'],
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
      headers: ['Tamanho', 'Tórax (cm)', 'Comprimento'],
      rows: [
        ['P', '102', '71'],
        ['M', '108', '74'],
        ['G', '114', '77'],
        ['GG', '120', '80'],
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop escuro clicável */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm cursor-pointer"
          />
          
          {/* Caixa do Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: DURATIONS.fast, ease: EASINGS.smooth }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-brand-black border border-zinc-800 shadow-2xl flex flex-col z-10"
          >
            {/* Header Fixo do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-brand-black sticky top-0 z-20">
              <div>
                <h2 className="font-serif text-xl uppercase tracking-widest text-white">Guia de Medidas</h2>
                <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block mt-1">Especificações Técnicas</span>
              </div>
              <button 
                onClick={onClose} 
                className="text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-full border border-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Área Rolável Interna */}
            <div className="p-6 overflow-y-auto space-y-12">
              {tables.map((table) => (
                <div key={table.title} className="space-y-4">
                  <div>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-white">{table.title}</h3>
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{table.subtitle}</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[10px] uppercase tracking-widest min-w-[400px]">
                      <thead className="text-zinc-500 border-b border-zinc-800">
                        <tr>
                          {table.headers.map(h => (
                            <th key={h} className="pb-3 font-normal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-zinc-300">
                        {table.rows.map((row, i) => (
                          <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-900/50 transition-colors">
                            {row.map((cell, j) => (
                              <td key={j} className="py-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {table.note && (
                    <p className="font-sans text-[9px] text-brand-red uppercase tracking-widest">
                      {table.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}