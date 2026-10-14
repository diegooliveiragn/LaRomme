'use client';

import Link from 'next/link';
import FadeIn from '@/components/FadeIn';

export default function EditorialPage() {
  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-6xl mx-auto space-y-24 font-sans">
      
      {/* CABEÇALHO EDITORIAL */}
      <FadeIn>
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase block">
            NOTAS DE CAMPO & TERRITÓRIO // DROP 01
          </span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">
            EDITORIAL.
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed pt-2">
            O Sistema Origo nasce da fricção entre duas realidades: a luz cortante e o vento de Fortaleza, ancorados no rigor e na simetria arquitetônica de Roma. Cada peça é um estudo sobre densidade, corte e transição funcional.
          </p>
        </div>
      </FadeIn>

      {/* SEÇÃO 01: NOTAS DE FORTALEZA (O TERRITÓRIO) */}
      <FadeIn delay={100}>
        <div className="space-y-8 border-t border-zinc-900 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
                01 // GEOGRAFIA & CLIMA
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-white font-bold tracking-wider uppercase">
                NOTAS DE FORTALEZA
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400 tracking-widest">
              03°43&apos;16&quot;S 38°32&apos;41&quot;W
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">A FÍSICA DO VENTO</span>
              <h3 className="font-serif text-lg text-white font-bold tracking-wide">16 A 22 NÓS CONSTANTES</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                O vento leste/sudeste dita o ritmo dos esportes na orla cearense. Tecidos convencionais colam ao corpo ou deformam com o atrito da maresia. Nossa matéria técnica foi selecionada para dissipar a umidade imediatamente enquanto o ar circula.
              </p>
            </div>

            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">A TRANSIÇÃO</span>
              <h3 className="font-serif text-lg text-white font-bold tracking-wide">AREIA &amp; ASFALTO</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                A rotina em Fortaleza não é dividida em blocos isolados. O praticante sai da quadra na Beira-Mar e senta para um café ou reunião no Meireles. A modelagem boxy e os cortes retos eliminam o aspecto de &quot;roupa de academia&quot;, garantindo presença discreta em qualquer mesa.
              </p>
            </div>

            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">A LUZ EQUATORIAL</span>
              <h3 className="font-serif text-lg text-white font-bold tracking-wide">SOMBRA &amp; ESTRUTURA</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Sob a luminosidade de Fortaleza, acabamentos reflexivos de baixa qualidade denunciam costuras tortas. Adotamos pigmentos foscos profundos, acabamento tom sobre tom e detalhes refletivos discretos que só reagem à luz noturna direta.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* SEÇÃO 02: CADERNO DE FIAÇÃO & ARQUITETURA TÊXTIL */}
      <FadeIn delay={150}>
        <div className="space-y-8 border-t border-zinc-900 pt-16">
          <div className="border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
              02 // ENGENHARIA DA MATÉRIA
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-white font-bold tracking-wider uppercase">
              CADERNO DE FIAÇÃO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 bg-zinc-950 border border-zinc-900 space-y-3">
              <span className="text-white font-bold uppercase block tracking-wider">
                ALGODÃO NOBRE PENTEADO
              </span>
              <p className="text-zinc-400 font-sans text-xs font-light leading-relaxed">
                Fibras longas selecionadas que recebem torção controlada para criar gramatura estruturada sem perder a troca de ar. O caimento cai reto no tronco, preservando a gola em ribana fechada pós-lavagens.
              </p>
              <span className="text-[10px] text-zinc-600 block uppercase pt-2 border-t border-zinc-900">
                APLICAÇÃO: VESTIGIUM BOXY
              </span>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-900 space-y-3">
              <span className="text-white font-bold uppercase block tracking-wider">
                POLIAMIDA DE TOQUE FRIO
              </span>
              <p className="text-zinc-400 font-sans text-xs font-light leading-relaxed">
                Microfilamentos sintéticos com propriedades termorreguladoras naturais. O tecido mantém a superfície da pele em temperatura confortável, com absorção zero de sal marinho e secagem em minutos.
              </p>
              <span className="text-[10px] text-zinc-600 block uppercase pt-2 border-t border-zinc-900">
                APLICAÇÃO: TENAX &amp; LIBERTAS
              </span>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-900 space-y-3">
              <span className="text-white font-bold uppercase block tracking-wider">
                RIPSTOP TÉCNICO &amp; LASER
              </span>
              <p className="text-zinc-400 font-sans text-xs font-light leading-relaxed">
                Trama entrelaçada com reforço bidirecional contra rasgos. As perfurações laterais cortadas a laser garantem exaustão térmica constante na cabeça sem adicionar peso ao acessório.
              </p>
              <span className="text-[10px] text-zinc-600 block uppercase pt-2 border-t border-zinc-900">
                APLICAÇÃO: BONÉ UMBRA 5-PANEL
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* SEÇÃO 03: OS 4 ARTEFATOS DO DROP 01 */}
      <FadeIn delay={200}>
        <div className="space-y-8 border-t border-zinc-900 pt-16">
          <div className="border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
              03 // ACERVO ESSENCIAL
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-white font-bold tracking-wider uppercase">
              SISTEMA ORIGO
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* VESTIGIUM */}
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-2xl text-white font-bold tracking-wider">VESTIGIUM.</h3>
                  <span className="font-mono text-zinc-400 text-sm">R$ 229,90</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  LIFESTYLE // ALGODÃO NOBRE BOXY BORDÔ
                </span>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-2">
                  100% Algodão Penteado de fiação nobre com caimento amplo inspirado na arquitetura modernista. Ombros deslocados (drop shoulder), gola encorpada indeformável e tonalidade bordô imperial.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <Link
                  href="/produto/vestigium"
                  className="text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
                >
                  VER DETALHES DA PEÇA →
                </Link>
              </div>
            </div>

            {/* TENAX */}
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-2xl text-white font-bold tracking-wider">TENAX.</h3>
                  <span className="font-mono text-zinc-400 text-sm">R$ 189,90</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  PERFORMANCE // T-SHIRT TÉCNICA PRETA
                </span>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-2">
                  Blend nobre de poliamida com elastano de toque frio contínuo. Desenhada para rápida evaporação do suor, com aplicação do emblema tom sobre tom e detalhes refletivos para treinos noturnos.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <Link
                  href="/produto/tenax"
                  className="text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
                >
                  VER DETALHES DA PEÇA →
                </Link>
              </div>
            </div>

            {/* LIBERTAS */}
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-2xl text-white font-bold tracking-wider">LIBERTAS.</h3>
                  <span className="font-mono text-zinc-400 text-sm">R$ 149,90</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  PERFORMANCE // REGATA MICROPERFURADA PRETA
                </span>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-2">
                  Regata ultraleve com cavas anatômicas desenhadas para evitar atrito durante o saque no beach tennis ou na passada de corrida. Malha de respiração imediata e secagem ultrarrápida.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <Link
                  href="/produto/libertas"
                  className="text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
                >
                  VER DETALHES DA PEÇA →
                </Link>
              </div>
            </div>

            {/* UMBRA */}
            <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-2xl text-white font-bold tracking-wider">UMBRA.</h3>
                  <span className="font-mono text-zinc-400 text-sm">R$ 169,90</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  PERFORMANCE // BONÉ 5-PANEL PRETO
                </span>
                <p className="text-xs text-zinc-400 font-light leading-relaxed pt-2">
                  Boné técnico em poliamida ripstop com perfuração a laser nas laterais, aba maleável de memória e fivela de baixo perfil. Resistente à maresia e concebido para corrida sob sol equatorial.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <Link
                  href="/produto/umbra"
                  className="text-xs font-mono tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
                >
                  VER DETALHES DA PEÇA →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* SEÇÃO 04: PROTOCOLO DE CONSERVAÇÃO & LONGEVIDADE */}
      <FadeIn delay={250}>
        <div className="border-t border-zinc-900 pt-16 space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">
              04 // PROTOCOLO DE PERMANÊNCIA
            </span>
            <h3 className="font-serif text-xl tracking-wider text-white font-bold uppercase">
              CUIDADOS &amp; LONGEVIDADE
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 font-mono">
            <div className="bg-zinc-950 p-6 border border-zinc-900 space-y-2">
              <span className="text-white font-bold block uppercase">01 // LAVAGEM A FRIO</span>
              <p className="font-sans text-xs font-light text-zinc-400">
                Lave sempre à mão ou em ciclo suave com água fria e sabão neutro. Nunca utilize amaciantes em tecidos técnicos, pois eles obstruem os microporos de respiração da poliamida.
              </p>
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900 space-y-2">
              <span className="text-white font-bold block uppercase">02 // SECAGEM À SOMBRA</span>
              <p className="font-sans text-xs font-light text-zinc-400">
                Seque na horizontal ou no cabide sempre à sombra e em ambiente arejado. O calor de secadoras danifica os filamentos elásticos e pode descolar detalhes refletivos.
              </p>
            </div>
            <div className="bg-zinc-950 p-6 border border-zinc-900 space-y-2">
              <span className="text-white font-bold block uppercase">03 // PASSAGEM BRANDA</span>
              <p className="font-sans text-xs font-light text-zinc-400">
                Passe as peças de algodão pelo avesso em temperatura média. Em peças técnicas de poliamida, o ferro é dispensável devido à memória térmica da fibra.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
