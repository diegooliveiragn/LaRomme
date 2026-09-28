'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { playHapticSound } from '@/lib/sound';

export default function ProdutoSlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<'P' | 'M' | 'G'>('M');
  const [showFitEngine, setShowFitEngine] = useState(false);

  // CAMPOS DO PROVADOR PREDITIVO
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(78);
  const [fitPreference, setFitPreference] = useState<'adjusted' | 'boxy'>('boxy');

  // ALGORITMO PREDITIVO DE RECOMENDAÇÃO DE TAMANHO
  const recommendedSize = useMemo(() => {
    let score = (height - 170) * 0.4 + (weight - 70) * 0.6;
    if (fitPreference === 'boxy') score += 5;

    if (score < 5) return 'P';
    if (score < 18) return 'M';
    return 'G';
  }, [height, weight, fitPreference]);

  const handleApplyRecommendedSize = () => {
    playHapticSound();
    setSelectedSize(recommendedSize);
    setShowFitEngine(false);
  };

  const handleBuyNow = () => {
    playHapticSound();
    router.push('/checkout');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* GALERIA VISUAL DO PRODUTO */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#0d0d10] border border-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
            <span className="font-mono text-zinc-600 text-xs tracking-widest uppercase">
              [ FOTO HIGH-RES • MALHA 260GSM ]
            </span>
            <div className="absolute top-4 left-4 bg-black/80 border border-zinc-700 px-3 py-1 font-mono text-[9px] text-amber-400 rounded uppercase">
              ✦ MODELAGEM BOXY HEAVYWEIGHT
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES DE COMPRA & FIT ENGINE */}
        <div className="space-y-8 font-mono">
          <div className="space-y-2 border-b border-zinc-800 pb-6">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">COLEÇÃO ORIGO / LOTE ZERO</span>
            <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Camiseta Boxy Heavyweight</h1>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xl font-bold text-emerald-400">R$ 320,00</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded font-bold">
                ESTOQUE LIMITADO
              </span>
            </div>
          </div>

          {/* SELETOR DE TAMANHO COM BOTÃO DO PROVADOR */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-300 uppercase">Selecione o Tamanho</span>
              <button
                type="button"
                onClick={() => { playHapticSound(); setShowFitEngine(!showFitEngine); }}
                className="text-[10px] text-amber-400 underline hover:text-amber-300 transition-colors uppercase"
              >
                ✦ Provador Preditivo de Caimento
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['P', 'M', 'G'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => { playHapticSound(); setSelectedSize(size); }}
                  className={`py-3 text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                      : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* MODAL / PAINEL DO PROVADOR PREDITIVO */}
            {showFitEngine && (
              <div className="bg-[#0d0d10] border border-amber-900/50 p-5 rounded-lg space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-zinc-800 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Algoritmo de Caimento Preditivo</span>
                  <button onClick={() => setShowFitEngine(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[9px] text-zinc-400 block mb-1">Sua Altura: {height} cm</label>
                    <input type="range" min="150" max="205" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-amber-400" />
                  </div>

                  <div>
                    <label className="text-[9px] text-zinc-400 block mb-1">Seu Peso: {weight} kg</label>
                    <input type="range" min="50" max="130" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-amber-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-400 block mb-1">Caimento Desejado</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setFitPreference('adjusted')}
                      className={`p-2 border rounded ${fitPreference === 'adjusted' ? 'border-amber-400 text-amber-300 bg-amber-950/20' : 'border-zinc-800 text-zinc-500'}`}
                    >
                      Ajustado ao Corpo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitPreference('boxy')}
                      className={`p-2 border rounded ${fitPreference === 'boxy' ? 'border-amber-400 text-amber-300 bg-amber-950/20' : 'border-zinc-800 text-zinc-500'}`}
                    >
                      Boxy Oversized (Original)
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 p-3 rounded flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400">Tamanho Ideal Recomendado:</span>
                  <span className="text-sm font-bold text-emerald-400">TAMANHO {recommendedSize}</span>
                </div>

                <button
                  type="button"
                  onClick={handleApplyRecommendedSize}
                  className="w-full bg-amber-400 text-black font-bold text-[10px] uppercase py-2.5 hover:bg-amber-300 transition-colors"
                >
                  [ SELECIONAR TAMANHO {recommendedSize} ]
                </button>
              </div>
            )}
          </div>

          {/* BOTÃO PRINCIPAL DE AQUISIÇÃO */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors shadow-lg"
            >
              [ GARANTIR POSSE • R$ 320,00 ]
            </button>
            <span className="text-[9px] text-zinc-500 text-center block uppercase tracking-wider">
              ✦ Envio Imediato com Frete Expresso e Serial Registrado
            </span>
          </div>

          {/* DETALHES TÉCNICOS DA PEÇA */}
          <div className="border-t border-zinc-800 pt-6 space-y-3 text-xs text-zinc-400 font-sans">
            <h3 className="font-mono text-white font-bold uppercase text-xs">Especificações da Peça</h3>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
              <li>100% Algodão Heavyweight de Alta Gramatura (260 g/m²).</li>
              <li>Gola Ribana de 3cm reforçada para preservação de estrutura.</li>
              <li>Corte Boxy com ombros caídos e caimento encorpado.</li>
              <li>Placa de número de série exclusivo em metal escovado no hem.</li>
            </ul>
          </div>

        </div>

      </div>
    </main>
  );
}