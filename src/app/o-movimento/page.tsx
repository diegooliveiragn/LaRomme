'use client';

import FadeIn from '@/components/FadeIn';

export default function OMovimentoPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-7xl mx-auto space-y-20 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">LIFESTYLE, ESPORTE & AREIA</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">O MOVIMENTO.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">A VIDA REAL DO VESTUÁRIO.</p>
        </div>
      </FadeIn>

      {/* BLOCO VÍDEO CULTURA E GEOMETRIA */}
      <FadeIn delay={100}>
        <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-900 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter grayscale contrast-125 opacity-40"
          >
            <source src="https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/cultura%20e%20geometria.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <p className="font-serif text-sm md:text-2xl tracking-[0.2em] md:tracking-[0.3em] text-white uppercase text-center px-6 font-bold leading-loose md:leading-normal">
              <span className="block mb-2 md:inline md:mb-0">A AREIA É A ARENA.</span> 
              <span className="hidden md:inline"> </span>
              <span className="block md:inline">A CIDADE É A ESTRUTURA.</span>
            </p>
          </div>
        </div>
      </FadeIn>

      {/* TRÊS PILARES DO MOVIMENTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
        <FadeIn delay={150}>
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full">
            <span className="text-zinc-500 block">01 // AREIA & QUADRA</span>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">MOBILIDADE ABSOLUTA.</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Desenhado para o ritmo intenso do beach tennis, vôlei de praia e futevôlei, garantindo cavas e tecidos que não prendem o movimento.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={250}>
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full">
            <span className="text-zinc-500 block">02 // CONCRETO & CIDADE</span>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">TRANSIÇÃO SEM FRICÇÃO.</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              A modelagem Boxy pesada e os bonés estruturados permitem sair diretamente da quadra para encontros urbanos com presença e postura.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={350}>
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 h-full">
            <span className="text-zinc-500 block">03 // PERMANÊNCIA</span>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-serif">RIGOR DE CONSTRUÇÃO.</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Costuras reforçadas e matérias-primas nobres que resistem ao sol tropical, ao sal do mar e às lavagens contínuas.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* CANAIS SOCIAIS OFICIAIS */}
      <FadeIn delay={400}>
        <div className="border-t border-zinc-900 pt-16 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">CANAL OFICIAL</span>
            <h3 className="font-serif text-xl md:text-3xl tracking-[0.2em] text-white uppercase font-bold">ACOMPANHE O MOVIMENTO.</h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 font-mono text-xs">
            <a
              href="https://instagram.com/uselaromme"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-950 border border-zinc-800 px-8 py-4 text-zinc-300 hover:text-black hover:bg-white transition-all tracking-widest uppercase w-full sm:w-auto"
            >
              INSTAGRAM: @USELAROMME
            </a>
            <a
              href="https://tiktok.com/@laromme"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-950 border border-zinc-800 px-8 py-4 text-zinc-300 hover:text-black hover:bg-white transition-all tracking-widest uppercase w-full sm:w-auto"
            >
              TIKTOK: @LAROMME
            </a>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}