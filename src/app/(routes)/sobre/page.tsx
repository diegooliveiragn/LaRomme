'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SobrePage() {
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-24 sm:space-y-32">
        
        {/* Header Documento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="border-b border-zinc-900 pb-12 sm:pb-16"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-8">
            Documento de Fundação // 001
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl uppercase tracking-wider text-white leading-[1.1]">
            A Estética <br/> da Ordem.
          </h1>
        </motion.div>

        {/* Grid Manifesto 01 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest md:sticky md:top-32">
              01. A Filosofia
            </h2>
          </div>
          <div className="md:col-span-8 space-y-8 font-serif text-xl sm:text-2xl leading-relaxed text-zinc-300">
            <p className="text-white">
              Não seguimos tendências. Construímos monumentos.
            </p>
            <p>
              A LaRomme nasce da intersecção entre a disciplina arquitetônica da Roma Antiga e a frieza utilitária do brutalismo moderno. Nós cortamos os excessos, as cores vívidas e o ruído contemporâneo para manter apenas o estrutural.
            </p>
            <p>
              Rejeitamos o supérfluo. Cada corte, cada costura e cada gramatura de tecido é calculada matematicamente para entregar uma silhueta imponente. O verdadeiro luxo não reside no brilho, mas no peso da ausência.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-900" />

        {/* Grid Manifesto 02 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest md:sticky md:top-32">
              02. Origo (A Gênese)
            </h2>
          </div>
          <div className="md:col-span-8 space-y-8 font-serif text-xl sm:text-2xl leading-relaxed text-zinc-300">
            <p className="text-white">
              A coleção ORIGO é o nosso marco zero.
            </p>
            <p>
              Desenvolvida em confinamento sob premissas estritas, ela foca em proporções <em className="not-italic text-white">oversized</em>, tons profundos de asfalto e materiais de altíssima densidade. Desenhada não para vestir, mas para envolver o corpo como uma armadura urbana.
            </p>
            <p>
              O escuro absoluto (#111111) não é apenas uma paleta cromática de escolha. É um escudo físico e psicológico contra a superficialidade estética.
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-900" />

        {/* Lote Zero (Call to Action) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-4">
            <h2 className="font-mono text-[10px] sm:text-xs text-brand-red uppercase tracking-widest">
              03. Diretriz de Acesso
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden group">
              {/* Marca d'água no fundo */}
              <div className="absolute -top-10 -right-10 opacity-5 grayscale group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                <img src="/logo-white.png" alt="Mark" className="w-64 sm:w-96" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-white">
                  O Lote Zero
                </h3>
                <p className="font-mono text-[10px] sm:text-xs text-zinc-400 leading-loose max-w-md uppercase tracking-widest">
                  A primeira tiragem de artefatos Origo não será aberta ao público. Apenas a lista de fundadores (Early Adopters) possuirá a chave de decodificação para a alocação de peças.
                </p>
                <div className="pt-6">
                  <Link href="/acesso" className="inline-block bg-white text-brand-black px-8 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-500 shadow-xl">
                    [ Solicitar Acesso VIP ]
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}