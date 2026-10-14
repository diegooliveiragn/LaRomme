'use client';

import FadeIn from '@/components/FadeIn';

export default function AMarcaPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-5xl mx-auto space-y-20 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">MANIFESTO & ORIGEM</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">A MARCA.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">PROPORÇÃO, MOVIMENTO E PERMANÊNCIA.</p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="bg-[#080808] border border-zinc-900 p-8 md:p-12 text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">TERRITÓRIO DE ORIGEM</span>
          <p className="font-mono text-base md:text-xl text-white tracking-widest">03°43'16"S &nbsp; 38°32'41"W — FORTALEZA, BRASIL</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4 text-sm md:text-base leading-relaxed tracking-wider font-light text-zinc-300">
        <FadeIn delay={150}>
          <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
            <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">FORTALEZA — A LUZ E O CLIMA</h2>
            <p>
              A LaRomme nasce do litoral cearense. Nossa inspiração começa na intensidade da luz solar, no vento constante que atravessa a cidade e no movimento diário de quem vive ao ar livre.
            </p>
            <p>
              A praia não é apenas um cenário contemplativo: é o espaço da prática, da corrida, da quadra e da convivência. É o ambiente real que exige tecidos respiráveis, caimento leve e conforto térmico sob o calor.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={250}>
          <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
            <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">ROMA — A PROPORÇÃO E O DESENHO</h2>
            <p>
              Roma não é um personagem de fantasia histórica, mas um repertório estético de arquitetura, geometria e permanência. 
            </p>
            <p>
              Buscamos a beleza das formas limpas, o equilíbrio visual das proporções monumentais e a convicção de que peças bem construídas não precisam gritar para serem notadas. O essencial permanece.
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={350}>
        <div className="border-t border-zinc-900 pt-16 text-center space-y-6 max-w-3xl mx-auto">
          <h3 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-white uppercase font-bold">FORÇA COM ELEGÂNCIA. DISCIPLINA COM LIBERDADE.</h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
            Construímos roupas que transitam sem esforço entre o treino e a rotina da cidade. Uma identidade criada para quem valoriza escolhas conscientes, presença discreta e um ritmo próprio de viver.
          </p>
        </div>
      </FadeIn>

    </div>
  );
}
