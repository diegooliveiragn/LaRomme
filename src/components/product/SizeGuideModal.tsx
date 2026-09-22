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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/90 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-brand-black border border-zinc-800 z-50 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-brand-black border-b border-zinc-800 px-6 py-4 flex justify-between items-center z-10">
              <span className="font-serif text-lg uppercase tracking-widest text-white">Guia de Medidas</span>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-10">
              {/* Boxy Matrix */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-mono text-[11px] text-brand-red uppercase tracking-widest mb-1">VESTIGIUM</h3>
                  <p className="font-sans text-[10px] text-zinc-500 uppercase">Camiseta de Algodão (Oversized / Boxy)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px] uppercase text-zinc-300">
                    <thead className="text-zinc-500 border-b border-zinc-800">
                      <tr><th className="pb-2 font-normal">Tamanho</th><th className="pb-2 font-normal">Tórax</th><th className="pb-2 font-normal">Comprimento</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-900"><td className="py-3">P</td><td className="py-3">108 cm</td><td className="py-3">72 cm</td></tr>
                      <tr className="border-b border-zinc-900"><td className="py-3">M</td><td className="py-3">114 cm</td><td className="py-3">75 cm</td></tr>
                      <tr className="border-b border-zinc-900"><td className="py-3">G</td><td className="py-3">128 cm</td><td className="py-3">78 cm</td></tr>
                      <tr><td className="py-3">GG</td><td className="py-3">126 cm</td><td className="py-3">81 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Matrix */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-mono text-[11px] text-brand-red uppercase tracking-widest mb-1">FORZA & LIBERTAS</h3>
                  <p className="font-sans text-[10px] text-zinc-500 uppercase">Performance (Relaxed / Cava Profunda)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px] uppercase text-zinc-300">
                    <thead className="text-zinc-500 border-b border-zinc-800">
                      <tr><th className="pb-2 font-normal">Tamanho</th><th className="pb-2 font-normal">Tórax (Forza)</th><th className="pb-2 font-normal">Comprimento</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-900"><td className="py-3">P</td><td className="py-3">104 cm</td><td className="py-3">70 cm</td></tr>
                      <tr className="border-b border-zinc-900"><td className="py-3">M</td><td className="py-3">110 cm</td><td className="py-3">73 cm</td></tr>
                      <tr className="border-b border-zinc-900"><td className="py-3">G</td><td className="py-3">116 cm</td><td className="py-3">76 cm</td></tr>
                      <tr><td className="py-3">GG</td><td className="py-3">122 cm</td><td className="py-3">79 cm</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 border border-zinc-800">
                <p className="font-sans text-[9px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                  As medidas podem variar em até 2cm para mais ou para menos devido ao processo de corte e costura artesanal. Recomendamos medir uma peça de seu uso contínuo para comparação.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}