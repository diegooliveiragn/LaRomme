'use client';

import FadeIn from '@/components/FadeIn';

export default function EditorialPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-6xl mx-auto space-y-20 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">ESPECIFICAÇÃO TÉCNICA & MATERIALIDADE</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">EDITORIAL.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">ARQUITETURA DO DROP 01 / ORIGO.</p>
        </div>
      </FadeIn>

      {/* DETALHAMENTO DOS 5 ARTEFATOS */}
      <div className="space-y-12">
        
        {/* VESTIGIUM */}
        <FadeIn delay={100}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-zinc-800 pb-4 gap-2">
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider">VESTIGIUM.</h2>
              <span className="text-xs font-mono text-zinc-400">ESTRUTURA / ALGODÃO BOXY</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Algodão encorpado de alta gramatura com toque denso. Desenvolvida para manter o caimento pesado e reto no torso, com ombros deslocados (*drop shoulder*) e gola em ribana espessa que preserva a estrutura no pescoço.
            </p>
          </div>
        </FadeIn>

        {/* FORZA */}
        <FadeIn delay={150}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-zinc-800 pb-4 gap-2">
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider">FORZA.</h2>
              <span className="text-xs font-mono text-zinc-400">PERFORMANCE / CAMISETA TÉCNICA</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Malha técnica com tecnologia de rápida dispersão de suor e toque frio. Projetada para garantir troca térmica sob o sol forte de Fortaleza sem perder a elegância da cor cinza sóbria.
            </p>
          </div>
        </FadeIn>

        {/* LIBERTAS */}
        <FadeIn delay={200}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-zinc-800 pb-4 gap-2">
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider">LIBERTAS.</h2>
              <span className="text-xs font-mono text-zinc-400">FREEDOM / REGATA PERFORMANCE (3 CORES)</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Regata com cavas anatômicas profundas que evitam atrito na rotação de braços nos esportes praianos. Disponível nas variações Bordô, Branca e Preta em malha ultraleve de alta respirabilidade.
            </p>
          </div>
        </FadeIn>

        {/* SIGNUM NOCTIS & ALBUS */}
        <FadeIn delay={250}>
          <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-zinc-800 pb-4 gap-2">
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider">SIGNUM / NOCTIS & ALBUS.</h2>
              <span className="text-xs font-mono text-zinc-400">IDENTITY / BONÉS ESTRUTURADOS</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light">
              Bonés construídos em sarja de algodão de copa rígida média e aba anatômica. O modelo Noctis traz o ícone do Capacete bordado em branco sobre o preto profundo; o modelo Albus traz a marca LaRomme. em Off-White.
            </p>
          </div>
        </FadeIn>

      </div>

      {/* GUIA DE CONSERVAÇÃO */}
      <FadeIn delay={300}>
        <div className="border-t border-zinc-900 pt-12 space-y-6">
          <h3 className="font-serif text-xl tracking-wider text-white font-bold uppercase">CUIDADOS & MANUTENÇÃO.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 font-mono">
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">01 // LAVAGEM</span>
              Lavar à mão ou em ciclo delicado com água fria e sabão neutro.
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">02 // SECAGEM</span>
              Secar sempre à sombra. Não utilizar máquina secadora para preservar as fibras.
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900">
              <span className="text-white font-bold block mb-2">03 // PASSAGEM</span>
              PassAR pelo avesso em temperatura média para proteger o toque do algodão e as estampas.
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}