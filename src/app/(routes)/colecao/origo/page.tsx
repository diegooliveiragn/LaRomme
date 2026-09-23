'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';

const artifacts = [
  {
    code: 'ARTEFATO 01',
    name: 'Camiseta Boxy Algodão (Origo)',
    category: 'ESTRUTURA // HEAVYWEIGHT',
    specs: [
      'Algodão Premium 400g/m² (Estrutura & Conforto)',
      'Modelagem Oversized/Boxy com gola estruturada',
      'Estampa traseira com Escultura Romana + Coordenadas (3°44\'S 38°31\'W)',
      'Acabamento e etiqueta externa frontal'
    ],
    colors: [
      { name: 'OFF WHITE', hex: '#F4F1EA', active: true }
    ],
    availability: 'RESTRITO // LOTE ZERO'
  },
  {
    code: 'ARTEFATO 02',
    name: 'Camiseta Sport (Forza)',
    category: 'ALTA PERFORMANCE // TECH',
    specs: [
      'Tecido leve de alta dispersão e respirabilidade',
      'Secagem rápida + Proteção UV integrada',
      'Modelagem Relaxed Fit com caimento premium',
      'Detalhes refletivos de visibilidade e etiqueta externa'
    ],
    colors: [
      { name: 'PRETO', hex: '#111111', active: true }
    ],
    availability: 'RESTRITO // LOTE ZERO'
  },
  {
    code: 'ARTEFATO 03',
    name: 'Regata Performance (Forza Tank)',
    category: 'ALTA PERFORMANCE // ATHLETIC',
    specs: [
      'Cavas anatômicas de recorte brutalista',
      'Faixa refletiva vertical dorsal de alto impacto',
      'Viés lateral em contraste vermelho/branco',
      'Tecido técnico respirável de baixa retenção térmica'
    ],
    colors: [
      { name: 'PRETA', hex: '#111111', active: true },
      { name: 'BRANCA', hex: '#F4F1EA', active: true },
      { name: 'BORDÔ', hex: '#581825', active: true }
    ],
    availability: 'RESTRITO // LOTE ZERO'
  },
  {
    code: 'ARTEFATO 04',
    name: 'Boné Arquitetônico (Nox)',
    category: 'ACESSÓRIOS // HEADWEAR',
    specs: [
      'Algodão sarjado de alta densidade estrutural',
      'Elmo Romano estilizado bordado na frente',
      'Costura técnica vermelha na aba + Tag lateral LR',
      'Fivela metálica traseira personalizada com relevo'
    ],
    colors: [
      { name: 'PRETO', hex: '#111111', active: true }
    ],
    availability: 'RESTRITO // LOTE ZERO'
  },
  {
    code: 'ARTEFATO 05',
    name: 'Boné Arquitetônico (Silex)',
    category: 'ACESSÓRIOS // HEADWEAR',
    specs: [
      'Algodão sarjado de alta densidade estrutural',
      'Tipografia LaRomme bordada em alto relevo com traço vermelho',
      'Fecho metálico traseiro ajustável gravado com brasão',
      'Modelagem clássica de 6 painéis estruturados'
    ],
    colors: [
      { name: 'OFF WHITE', hex: '#F4F1EA', active: true }
    ],
    availability: 'RESTRITO // LOTE ZERO'
  }
];

export default function ColecaoOrigoPage() {
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Cabecalho de Engenharia */}
        <FadeIn direction="down">
          <div className="border-b border-zinc-900 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
                Ficha Técnica de Engenharia // MMXXVI
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl uppercase tracking-wider text-white">
                Coleção Origo
              </h1>
              <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-2xl leading-relaxed">
                Mapeamento de corte, gramatura e matriz cromática dos 5 artefatos fundacionais do Lote Zero.
              </p>
            </div>
            <div className="border-l border-zinc-900 pl-6 space-y-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
              <div>Matriz: 05 Artefatos</div>
              <div>Origem: Brasil // Roma</div>
              <div>Status: Aguardando Lançamento</div>
            </div>
          </div>
        </FadeIn>

        {/* Grade de Blueprint dos Artefatos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {artifacts.map((item, idx) => (
            <FadeIn key={item.code} delay={idx * 0.1} duration={0.8}>
              <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-10 space-y-8 flex flex-col justify-between group hover:border-zinc-700 transition-all duration-500 relative overflow-hidden">
                
                {/* Linhas de Blueprint / Wireframe no Fundo */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-800 uppercase tracking-widest pointer-events-none select-none">
                  {item.code} // DIAGRAMA TÉCNICO
                </div>

                <div className="space-y-6">
                  {/* Meta topo */}
                  <div className="flex justify-between items-center font-mono text-[9px] tracking-widest border-b border-zinc-900 pb-4">
                    <span className="text-brand-red">{item.code}</span>
                    <span className="text-zinc-500">{item.category}</span>
                  </div>

                  {/* Nome Principal */}
                  <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white group-hover:text-brand-red transition-colors">
                    {item.name}
                  </h2>

                  {/* Moldura Schematica de Wireframe (Efeito Planta Baixa) */}
                  <div className="bg-black/80 border border-zinc-900 p-6 space-y-3 font-mono text-[10px] text-zinc-400">
                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2 flex justify-between">
                      <span>[ SPECIFICAÇÕES DE FABRICAÇÃO ]</span>
                      <span>100% AUTÊNTICO</span>
                    </div>
                    <ul className="space-y-2">
                      {item.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-brand-red font-bold">›</span>
                          <span className="uppercase">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Seletor Estrito de Cores */}
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
                      MATRIZ CROMÁTICA DISPONÍVEL:
                    </span>
                    <div className="flex items-center gap-3">
                      {item.colors.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 font-mono text-[9px] text-zinc-300 uppercase tracking-wider">
                          <span className="w-2.5 h-2.5 rounded-full border border-zinc-700" style={{ backgroundColor: c.hex }}></span>
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ação Trancada para o Lote Zero */}
                <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                    {item.availability}
                  </span>
                  <Link 
                    href="/acesso"
                    className="bg-zinc-900 border border-zinc-800 text-white text-center px-6 py-3 font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                  >
                    [ LIBERAR NO LOTE ZERO ]
                  </Link>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

        {/* Banner de Fechamento */}
        <FadeIn direction="up">
          <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-12 text-center space-y-6">
            <h3 className="font-serif text-2xl sm:text-4xl uppercase tracking-wider text-white">
              Garantia de Alocação Lote Zero
            </h3>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
              Devido ao rigor de produção e gramatura dos tecidos, o Lote Zero terá tiragem estritamente limitada. Cadastre sua chave para acesso antecipado.
            </p>
            <Link 
              href="/acesso" 
              className="inline-block bg-brand-red text-white px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              [ ENTRAR NA LISTA VIP ]
            </Link>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}