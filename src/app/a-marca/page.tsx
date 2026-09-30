'use client';

import FadeIn from '@/components/FadeIn';

export default function AMarcaPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-5xl mx-auto space-y-20 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">O MANIFESTO & ORIGEM</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">A MARCA.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">A ESTÉTICA DA ORDEM.</p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="bg-[#080808] border border-zinc-900 p-8 md:p-12 text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">COORDENADAS DE ORIGEM</span>
          <p className="font-mono text-base md:text-xl text-white tracking-widest">03°43'16"S &nbsp; 38°32'41"W — FORTALEZA, BRASIL</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4 text-sm md:text-base leading-relaxed tracking-wider font-light text-zinc-300">
        <FadeIn delay={150}>
          <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
            <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">FORTALEZA — O TERRITÓRIO</h2>
            <p>
              Nascemos onde a terra encontra o mar. Fortaleza é a nossa origem — o calor da quadra, o vento constante, a luz que recorta a paisagem e o movimento que nunca cessa.
            </p>
            <p>
              A praia não é um refúgio contemplativo de descanso; é uma arena viva de energia, disciplina e presença. É o lugar onde a pele testa a resistência do tecido.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={250}>
          <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
            <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">ROMA — O CÓDIGO</h2>
            <p>
              Roma é o nosso código cultural. Não através de mitos ou fantasias, mas pela linguagem da arquitetura, da proporção lapidar e da permanência.
            </p>
            <p>
              Buscamos a força silenciosa do concreto e da pedra: a ordem rigorosa que resiste ao tempo e a elegância atemporal que não precisa de explicação.
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={350}>
        <div className="border-t border-zinc-900 pt-16 text-center space-y-6 max-w-3xl mx-auto">
          <h3 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-white uppercase font-bold">A SÍNTESE: FORÇA EM MOVIMENTO.</h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
            A LaRomme existe na transição perfeita entre a areia e a cidade. Construímos um sistema de vestuário feito para jogar, circular e viver. A roupa projetada como arquitetura viva do corpo.
          </p>
        </div>
      </FadeIn>

    </div>
  );
}