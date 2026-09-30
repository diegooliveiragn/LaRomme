'use client';

import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function CarrinhoPage() {
  return (
    <div className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto text-center space-y-8 min-h-[70vh] flex flex-col items-center justify-center">
      <FadeIn>
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">SACOLA DE COMPRAS</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase font-bold">SUA SACOLA ESTÁ VAZIA.</h1>
          <p className="text-xs text-zinc-400 tracking-wider max-w-md mx-auto font-light pt-2 font-sans">
            Nenhum artefato foi adicionado à sua seleção até o momento.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="pt-4">
          <Link
            href="/#origo"
            className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-zinc-200 transition-all shadow-xl font-sans"
          >
            EXPLORAR COLEÇÃO ORIGO.
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}