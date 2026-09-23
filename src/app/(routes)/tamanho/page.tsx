'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TamanhoPage() {
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-b border-zinc-900 pb-12"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            Especificações de Caimento // Fit Matrix
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Guia de Dimensões
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-xl mt-4 leading-relaxed">
            As peças da coleção Origo possuem corte Boxy Oversized com Ombros Caídos. Consulte a matriz estrutural abaixo antes da alocação.
          </p>
        </motion.div>

        {/* Tabela T-Shirt Boxy */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-zinc-900 pb-4">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-white">01. Heavyweight Boxy Tee</h2>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Medidas em centímetros (cm)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-widest">
                  <th className="py-4 px-4 bg-zinc-950">Tamanho</th>
                  <th className="py-4 px-4 bg-zinc-950">Tórax (A)</th>
                  <th className="py-4 px-4 bg-zinc-950">Comprimento (B)</th>
                  <th className="py-4 px-4 bg-zinc-950">Ombro a Ombro (C)</th>
                  <th className="py-4 px-4 bg-zinc-950">Manga (D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                <tr className="hover:bg-zinc-950/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">P</td>
                  <td className="py-4 px-4">58 cm</td>
                  <td className="py-4 px-4">72 cm</td>
                  <td className="py-4 px-4">56 cm</td>
                  <td className="py-4 px-4">23 cm</td>
                </tr>
                <tr className="hover:bg-zinc-950/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">M</td>
                  <td className="py-4 px-4">61 cm</td>
                  <td className="py-4 px-4">75 cm</td>
                  <td className="py-4 px-4">59 cm</td>
                  <td className="py-4 px-4">24 cm</td>
                </tr>
                <tr className="hover:bg-zinc-950/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">G</td>
                  <td className="py-4 px-4">64 cm</td>
                  <td className="py-4 px-4">78 cm</td>
                  <td className="py-4 px-4">62 cm</td>
                  <td className="py-4 px-4">25 cm</td>
                </tr>
                <tr className="hover:bg-zinc-950/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">GG</td>
                  <td className="py-4 px-4">67 cm</td>
                  <td className="py-4 px-4">81 cm</td>
                  <td className="py-4 px-4">65 cm</td>
                  <td className="py-4 px-4">26 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Instruções de Medição */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">Diretriz // 01</span>
            <h3 className="font-serif text-lg uppercase text-white">Recomendação de Tamanho</h3>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              Para o caimento exato concebido pelos nossos designers (Oversized), escolha o seu tamanho habitual. Se deseja um visual ajustado ao corpo, selecione um tamanho menor.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">Diretriz // 02</span>
            <h3 className="font-serif text-lg uppercase text-white">Encolhimento Nulo</h3>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              Todos os tecidos passam por pré-encolhimento térmico e lavagem industrial com amaciante de silicone antes do corte. As dimensões da tabela são permanentes.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">Diretriz // 03</span>
            <h3 className="font-serif text-lg uppercase text-white">Ainda com Dúvidas?</h3>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              Nossa equipe oferece consultoria de caimento em tempo real pelo canal oficial de suporte do Lote Zero.
            </p>
            <div className="pt-2">
              <Link href="/contato" className="font-mono text-[10px] text-white hover:text-brand-red uppercase tracking-widest transition-colors">
                [ Falar com Concierge ]
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}