'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EASINGS, DURATIONS } from '@/config/motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="relative z-10 w-full max-w-2xl bg-brand-black text-brand-offwhite border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
                  LR / FIT GUIDE
                </span>
                <h3 className="font-serif text-2xl font-bold uppercase tracking-wider mt-1">
                  Guia de Medidas & Caimento
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:text-brand-red transition-colors text-zinc-400"
                aria-label="Fechar guia"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 text-xs uppercase tracking-wider text-zinc-300">
              <p className="normal-case text-zinc-400 leading-relaxed font-sans text-xs">
                As peças da LaRomme possuem duas modelagens exclusivas: <strong className="text-white">Boxy/Oversized</strong> (corte amplo e caimento estruturado) e <strong className="text-white">Performance Fit</strong> (ajuste anatômico de alta mobilidade).
              </p>

              {/* Tabela de Medidas */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="py-2 pr-4 font-normal">Tamanho</th>
                      <th className="py-2 px-4 font-normal">Tórax (cm)</th>
                      <th className="py-2 px-4 font-normal">Comprimento (cm)</th>
                      <th className="py-2 pl-4 font-normal">Ombro (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    <tr>
                      <td className="py-3 pr-4 font-bold text-brand-red">P</td>
                      <td className="py-3 px-4">102 - 108</td>
                      <td className="py-3 px-4">71</td>
                      <td className="py-3 pl-4">52</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-brand-red">M</td>
                      <td className="py-3 px-4">108 - 114</td>
                      <td className="py-3 px-4">73</td>
                      <td className="py-3 pl-4">54</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-brand-red">G</td>
                      <td className="py-3 px-4">114 - 120</td>
                      <td className="py-3 px-4">75</td>
                      <td className="py-3 pl-4">56</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-bold text-brand-red">GG</td>
                      <td className="py-3 px-4">120 - 126</td>
                      <td className="py-3 px-4">77</td>
                      <td className="py-3 pl-4">58</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>Coordenadas: 03°43'16"S 38°32'41"W</span>
              <button
                onClick={onClose}
                className="bg-brand-offwhite text-brand-black px-6 py-2 font-bold hover:bg-brand-red hover:text-white transition-colors"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}