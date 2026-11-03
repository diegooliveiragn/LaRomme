'use client';

import FadeIn from '@/components/FadeIn';

export default function AMarcaPage() {
  return (
    <div className="pt-32 md:pt-40 pb-28 px-6 md:px-12 max-w-5xl mx-auto space-y-20 font-sans relative selection:bg-zinc-800">
      
      {/* Camada Subliminar */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <div className="absolute right-4 top-1/3 -rotate-90 origin-right text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase">
          03°44' S  38°31' W // LA ROMME
        </div>
      </div>

      <div className="relative z-10 space-y-20">
        
        {/* Título & Manifesto Central */}
        <FadeIn>
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              Origem & Princípios
            </span>
            <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">
              A MARCA.
            </h1>
            <p className="text-xs font-mono tracking-[0.35em] text-zinc-400 uppercase">
              Força em Movimento.
            </p>
          </div>
        </FadeIn>

        {/* Coordenadas e Território */}
        <FadeIn delay={100}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-12 text-center space-y-3 rounded-sm">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              Ancoragem Geográfica
            </span>
            <p className="font-mono text-base md:text-xl text-white tracking-widest font-semibold">
              03°44' S &nbsp; 38°31' W — FORTALEZA, BRASIL
            </p>
            <p className="text-[11px] font-mono text-zinc-500 tracking-wider">
              Clima litorâneo, vento contínuo e intensidade atlética.
            </p>
          </div>
        </FadeIn>

        {/* Pilares: Fortaleza (Prática Diária) vs. Roma (Arquitetura & Proporção) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4 text-sm md:text-base leading-relaxed tracking-wider font-light text-zinc-300">
          
          <FadeIn delay={150}>
            <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
              <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">
                O TERRITÓRIO & O SUOR
              </h2>
              <p>
                A LaRomme nasce sob a temperatura alta, o sol incisivo e o vento constante do litoral cearense. Não desenhamos roupas para o repouso passivo. Nascemos para quem coloca o corpo à prova todos os dias — seja na corrida contra a brisa da orla, nas quadras de areia ou na disciplina silenciosa do treino de força.
              </p>
              <p>
                O suor e a rotina exigem tecidos que dissipem calor, malhas que não pesem no corpo e costuras anatômicas que respeitem a rotação dos músculos sem atrito desnecessário.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={250}>
            <div className="space-y-6 border-l border-zinc-800 pl-6 md:pl-8">
              <h2 className="text-white text-base md:text-lg tracking-widest font-serif font-bold uppercase">
                O CÓDIGO & A PROPORÇÃO
              </h2>
              <p>
                Nossa inspiração arquitetônica vem da permanência das formas puras e da sobriedade clássica. Rejeitamos logos estridentes, adereços frágeis e o ciclo de obsolescência rápida. 
              </p>
              <p>
                Acreditamos na elegância de uma gola em ribana fechada, no caimento limpo de uma modelagem bem estruturada e na firmeza de uma malha encorpada. A roupa existe para servir à postura de quem a veste, conferindo presença sem precisar gritar por atenção.
              </p>
            </div>
          </FadeIn>

        </div>

        {/* A Síntese */}
        <FadeIn delay={350}>
          <div className="border-t border-zinc-900 pt-16 text-center space-y-6 max-w-3xl mx-auto">
            <h3 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-white uppercase font-bold">
              FORÇA EM MOVIMENTO.
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
              A união entre a precisão da alfaiataria e a exigência física do atleta contemporâneo. Vestuário desenvolvido para treinar, transitar e permanecer, mantendo o mesmo rigor estético dentro e fora da prática esportiva.
            </p>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}