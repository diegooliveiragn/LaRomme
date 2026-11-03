'use client';

import FadeIn from '@/components/FadeIn';

export default function OMovimentoPage() {
  return (
    <div className="pt-32 md:pt-40 pb-28 px-6 md:px-12 max-w-7xl mx-auto space-y-20 font-sans relative selection:bg-zinc-800">
      
      {/* Camada Subliminar */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <div className="absolute right-4 top-1/3 -rotate-90 origin-right text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase">
          COMUNIDADE & DISCIPLINA // LA ROMME
        </div>
      </div>

      <div className="relative z-10 space-y-20">

        {/* Título Superior */}
        <FadeIn>
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              Rotina, Esporte & Disciplina
            </span>
            <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">
              O MOVIMENTO.
            </h1>
            <p className="text-xs font-mono tracking-[0.35em] text-zinc-400 uppercase">
              A Prática Real do Vestuário.
            </p>
          </div>
        </FadeIn>

        {/* Bloco de Vídeo Atmosférico */}
        <FadeIn delay={100}>
          <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-900 overflow-hidden rounded-sm">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter grayscale contrast-125 opacity-35"
            >
              <source src="https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/cultura%20e%20geometria.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="font-serif text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.3em] text-white uppercase text-center px-6 font-bold leading-loose md:leading-normal">
                <span className="block mb-2 md:inline md:mb-0">A AREIA É O PONTO DE PARTIDA.</span> 
                <span className="hidden md:inline"> </span>
                <span className="block md:inline">A CIDADE É O CAMINHO.</span>
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Três Dimensões da Prática Atlética */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
          
          <FadeIn delay={150}>
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full rounded-sm">
              <span className="text-zinc-500 block text-[10px]">01 // AREIA & CALOR</span>
              <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">
                LIBERDADE TÉRMICA.
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-light">
                Desenvolvido para os treinos funcionais sob sol intenso, beach tennis e corrida no litoral. Cavas anatômicas e tecidos microperfurados que eliminam o peso do suor e respeitam a mecânica muscular.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={250}>
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full rounded-sm">
              <span className="text-zinc-500 block text-[10px]">02 // TRANSIÇÃO URBANA</span>
              <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">
                POSTURA SEM FRICÇÃO.
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-light">
                A modelagem Boxy e as linhas puras asseguram a passagem natural da quadra para o café, o trabalho ou o convívio. Uma estética silenciosa que mantém a elegância fora do ambiente desportivo.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={350}>
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full rounded-sm">
              <span className="text-zinc-500 block text-[10px]">03 // CONSTÂNCIA</span>
              <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">
                DISCIPLINA SILENCIOSA.
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-light">
                Não acreditamos em motivação passageira ou slogans ruidosos. Criamos para quem repete o processo diariamente, valorizando a firmeza das costuras e a durabilidade da matéria-prima.
              </p>
            </div>
          </FadeIn>

        </div>

        {/* Canais Oficiais de Acompanhamento */}
        <FadeIn delay={400}>
          <div className="border-t border-zinc-900 pt-16 text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
                Comunidade & Registro
              </span>
              <h3 className="font-serif text-xl md:text-3xl tracking-[0.2em] text-white uppercase font-bold">
                ACOMPANHE O MOVIMENTO.
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 font-mono text-xs">
              <a
                href="https://instagram.com/uselaromme"
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-950 border border-zinc-800 px-8 py-4 text-zinc-300 hover:text-black hover:bg-white transition-all tracking-widest uppercase w-full sm:w-auto rounded-sm"
              >
                INSTAGRAM: @USELAROMME
              </a>
              <a
                href="https://tiktok.com/@laromme"
                target="_blank"
                rel="noreferrer"
                className="bg-zinc-950 border border-zinc-800 px-8 py-4 text-zinc-300 hover:text-black hover:bg-white transition-all tracking-widest uppercase w-full sm:w-auto rounded-sm"
              >
                TIKTOK: @LAROMME
              </a>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}