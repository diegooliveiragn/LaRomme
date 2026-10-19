'use client';

import FadeIn from '@/components/FadeIn';

export default function EditorialPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-6xl mx-auto space-y-20 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">MATÉRIA-PRIMA & ENGENHARIA TÊXTIL</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">EDITORIAL.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">DROP 01 / SISTEMA ORIGO.</p>
        </div>
      </FadeIn>

      {/* DETALHAMENTO DOS 4 ARTEFATOS OFICIAIS */}
      <div className="space-y-8">
        
        {/* VESTIGIUM */}
        <FadeIn delay={100}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-2">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">VESTIGIUM.</h2>
                <span className="text-[10px] md:text-xs font-mono text-zinc-400">LIFESTYLE / ALGODÃO BOXY BORDÔ</span>
              </div>
              <span className="font-serif text-lg text-white font-bold whitespace-nowrap md:ml-4">R$ 229,90</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              100% Algodão Penteado de fiação nobre com toque fresco, alta respirabilidade e caimento Boxy alinhado ao clima litorâneo. Possui ombros deslocados (*drop shoulder*), gola estruturada em ribana encorpada e acabamento discreto com etiqueta emborrachada.
            </p>
          </div>
        </FadeIn>

        {/* TENAX */}
        <FadeIn delay={140}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-2">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">TENAX.</h2>
                <span className="text-[10px] md:text-xs font-mono text-zinc-400">PERFORMANCE / T-SHIRT PRETA</span>
              </div>
              <span className="font-serif text-lg text-white font-bold whitespace-nowrap md:ml-4">R$ 189,90</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Blend nobre de poliamida com elastano de toque gelado e dispersão contínua de calor. Desenvolvida para secagem ultrarrápida durante a prática esportiva, com aplicação do símbolo tom sobre tom no peito e detalhes em transfer refletivo para treinos ao entardecer ou à noite.
            </p>
          </div>
        </FadeIn>

        {/* LIBERTAS */}
        <FadeIn delay={180}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-2">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">LIBERTAS.</h2>
                <span className="text-[10px] md:text-xs font-mono text-zinc-400">PERFORMANCE / REGATA PRETA</span>
              </div>
              <span className="font-serif text-lg text-white font-bold whitespace-nowrap md:ml-4">R$ 149,90</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Regata em malha microperfurada ultraleve com cavas profundas, desenhadas para garantir amplitude completa e evitar atrito nos movimentos dos esportes de areia. Respirabilidade elevada, secagem instantânea e detalhes refletivos na nuca com coordenadas de Fortaleza.
            </p>
          </div>
        </FadeIn>

        {/* UMBRA */}
        <FadeIn delay={220}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-2">
              <div>
                <h2 className="font-serif text-xl md:text-2xl text-white font-bold tracking-wider mb-1">UMBRA.</h2>
                <span className="text-[10px] md:text-xs font-mono text-zinc-400">PERFORMANCE / BONÉ 5-PANEL PRETO</span>
              </div>
              <span className="font-serif text-lg text-white font-bold whitespace-nowrap md:ml-4">R$ 169,90</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Boné 5-Panel ultraleve em poliamida ripstop com perfurações laterais cortadas a laser para ventilação contínua. Equipado com fivela de perfil baixo e ajuste rápido, aba maleável e etiqueta com contraste sutil para acompanhar treinos e jogos sob o sol.
            </p>
          </div>
        </FadeIn>

      </div>

      {/* GUIA DE CONSERVAÇÃO */}
      <FadeIn delay={260}>
        <div className="border-t border-zinc-900 pt-12 space-y-6">
          <h3 className="font-serif text-xl tracking-wider text-white font-bold uppercase">CUIDADOS & CONSERVAÇÃO.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 font-mono">
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">01 // LAVAGEM</span>
              Lavar à mão ou em ciclo delicado em água fria com sabão neutro. Não usar amaciante em tecidos técnicos.
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">02 // SECAGEM</span>
              Secar à sombra em local arejado. Não usar secadora para preservar as fibras elásticas e os refletivos.
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">03 // PASSAGEM</span>
              Passar pelo avesso em temperatura branda. Evitar passar o ferro diretamente sobre etiquetas e transferências.
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
