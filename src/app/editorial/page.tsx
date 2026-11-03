'use client';

import FadeIn from '@/components/FadeIn';

export default function EditorialPage() {
  return (
    <div className="pt-32 md:pt-40 pb-28 px-6 md:px-12 max-w-6xl mx-auto space-y-20 font-sans relative selection:bg-zinc-800">
      
      {/* Camada Subliminar */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <div className="absolute right-4 top-1/3 -rotate-90 origin-right text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase">
          ESPECIFICAÇÃO & MATERIALIDADE // 03°44'S 38°31'W
        </div>
      </div>

      <div className="relative z-10 space-y-20">

        {/* Título Superior */}
        <FadeIn>
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
              Matéria-Prima & Engenharia Têxtil
            </span>
            <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">
              EDITORIAL.
            </h1>
            <p className="text-xs font-mono tracking-[0.35em] text-zinc-400 uppercase">
              O Acervo Essencial / Sistema Origo.
            </p>
          </div>
        </FadeIn>

        {/* Detalhamento dos 4 Artefatos Oficiais */}
        <div className="space-y-6">
          
          {/* VESTIGIUM */}
          <FadeIn delay={100}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4 rounded-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800/80 pb-4 gap-2">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">
                    VESTIGIUM.
                  </h2>
                  <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase">
                    Alfaiataria Cotidiana / Algodão Encorpado Bordô
                  </span>
                </div>
                <span className="font-mono text-lg text-white font-semibold whitespace-nowrap md:ml-4">
                  R$ 229,90
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                Confeccionada em 100% algodão de fiação nobre com acabamento estonado e toque macio. A modelagem Boxy estruturada com ombros caídos e gola fechada em ribana densa confere postura geométrica sóbria, sendo a peça de transição perfeita entre a prática física e o repouso urbano.
              </p>
            </div>
          </FadeIn>

          {/* TENAX */}
          <FadeIn delay={140}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4 rounded-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800/80 pb-4 gap-2">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">
                    TENAX.
                  </h2>
                  <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase">
                    Performance Aerodinâmica / Malha Técnica Preta
                  </span>
                </div>
                <span className="font-mono text-lg text-white font-semibold whitespace-nowrap md:ml-4">
                  R$ 189,90
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                Malha de poliamida com elastano de toque fresco contínuo e dispersão acelerada de transpiração. O corte ergonômico raglan acompanha a mobilidade dos ombros sem atrito. Apresenta símbolo fosco tom sobre tom no peito e detalhe com reflexo sutil nas costas para treinos ao entardecer.
              </p>
            </div>
          </FadeIn>

          {/* LIBERTAS */}
          <FadeIn delay={180}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4 rounded-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800/80 pb-4 gap-2">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">
                    LIBERTAS.
                  </h2>
                  <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase">
                    Alta Respirabilidade / Regata Microperfurada Preta
                  </span>
                </div>
                <span className="font-mono text-lg text-white font-semibold whitespace-nowrap md:ml-4">
                  R$ 149,90
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                Regata técnica em malha microperfurada de alta ventilação, com secagem quase imediata. Suas cavas laterais profundas oferecem amplitude desimpedida para esportes de areia, com as coordenadas geográficas de Fortaleza aplicadas na parte posterior da gola.
              </p>
            </div>
          </FadeIn>

          {/* UMBRA */}
          <FadeIn delay={220}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4 rounded-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800/80 pb-4 gap-2">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">
                    UMBRA.
                  </h2>
                  <span className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase">
                    Acessório Estruturado / Boné 5-Panel Preto
                  </span>
                </div>
                <span className="font-mono text-lg text-white font-semibold whitespace-nowrap md:ml-4">
                  R$ 169,90
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                Construído em ripstop de poliamida ultraleve e resistente à água e ao salitre. Possui perfurações laterais cortadas a laser para fluxo de ar constante, aba anatômica maleável e fecho de ajuste funcional em fita de nylon com etiqueta de assinatura.
              </p>
            </div>
          </FadeIn>

        </div>

        {/* Guia de Conservação & Longevidade */}
        <FadeIn delay={260}>
          <div className="border-t border-zinc-900 pt-14 space-y-6">
            <h3 className="font-serif text-lg tracking-wider text-white font-bold uppercase">
              CUIDADOS & CONSERVAÇÃO TÊXTIL.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 font-mono">
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-sm space-y-2">
                <span className="text-white font-bold block uppercase text-[11px]">01 // LAVAGEM</span>
                <p className="font-sans font-light leading-relaxed">
                  Lavar à mão ou em ciclo suave com água fria e sabão neutro. Não usar amaciadores para manter as propriedades térmicas das fibras técnicas.
                </p>
              </div>
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-sm space-y-2">
                <span className="text-white font-bold block uppercase text-[11px]">02 // SECAGEM</span>
                <p className="font-sans font-light leading-relaxed">
                  Secar à sombra em local ventilado. Evitar máquinas de secar para preservar os filamentos elásticos e os acabamentos termocolantes.
                </p>
              </div>
              <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-sm space-y-2">
                <span className="text-white font-bold block uppercase text-[11px]">03 // PASSAGEM</span>
                <p className="font-sans font-light leading-relaxed">
                  Passar pelo avesso em temperatura reduzida. Não encostar ferro quente diretamente sobre etiquetas, estampas ou detalhes refletores.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}