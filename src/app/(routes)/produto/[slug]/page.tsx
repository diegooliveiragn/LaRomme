'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { playHapticSound } from '@/lib/sound';
import { trackEvent } from '@/lib/telemetry';
import Link from 'next/link';

export default function ProdutoSlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<'P' | 'M' | 'G'>('M');
  const [showFitEngine, setShowFitEngine] = useState(false);

  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(78);
  const [fitPreference, setFitPreference] = useState<'adjusted' | 'boxy'>('boxy');

  useEffect(() => {
    trackEvent('product_view', { slug: params.slug });
  }, [params.slug]);

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
    trackEvent('fit_engine_applied', { recommendedSize, height, weight, fitPreference });
  };

  const handleBuyNow = () => {
    playHapticSound();
    trackEvent('checkout_initiated', { slug: params.slug, size: selectedSize, price: 320 });
    router.push('/checkout');
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col">
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-900">
        <Link href="/" onClick={playHapticSound} className="font-serif text-xl tracking-widest text-white hover:text-zinc-300 transition-colors">
          LaRomme.
        </Link>
        <Link href="/acesso" onClick={playHapticSound} className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          Senado VIP
        </Link>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="w-full aspect-[4/5] bg-[#070707] border border-zinc-800/50 rounded-sm flex flex-col items-center justify-center relative overflow-hidden group">
          <span className="font-sans text-zinc-600 text-[10px] tracking-widest uppercase">
            Artefato em Captação
          </span>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 font-sans text-[9px] tracking-widest text-zinc-300 uppercase">
            Malha Estruturada • 260GSM
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-3 border-b border-zinc-900 pb-8">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
              Coleção Origo / Artefato 01
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-wider leading-tight">
              Camiseta Boxy <br className="hidden md:block"/>Heavyweight
            </h1>
            <div className="flex items-center gap-4 pt-4">
              <span className="text-lg font-sans text-white">R$ 320,00</span>
              <span className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1 rounded-sm uppercase tracking-widest">
                Lote Zero Limitado
              </span>
            </div>
          </div>

          <div className="space-y-5 font-sans">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Tamanho Selecionado</span>
              <button
                type="button"
                onClick={() => {
                  playHapticSound();
                  setShowFitEngine(!showFitEngine);
                  if (!showFitEngine) trackEvent('fit_engine_open', { slug: params.slug });
                }}
                className="text-[10px] text-zinc-300 underline underline-offset-4 hover:text-white transition-colors uppercase tracking-widest"
              >
                Provador Preditivo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['P', 'M', 'G'] as const).map((size) => {
                const isActive = selectedSize === size;
                const baseClass = "py-3.5 text-xs tracking-widest transition-all uppercase border";
                const colorClass = isActive ? "bg-white text-black border-white" : "bg-[#070707] text-zinc-500 border-zinc-800 hover:border-zinc-600";
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      playHapticSound();
                      setSelectedSize(size);
                      trackEvent('size_selected', { size, slug: params.slug });
                    }}
                    className={baseClass + " " + colorClass}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {showFitEngine && (
              <div className="bg-[#0a0a0c] border border-zinc-800 p-6 rounded-sm space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-300 uppercase tracking-widest">Algoritmo de Caimento</span>
                  <button onClick={() => setShowFitEngine(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Altura</span> <span className="text-white">{height} cm</span>
                    </label>
                    <input type="range" min="150" max="205" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                      <span>Peso</span> <span className="text-white">{weight} kg</span>
                    </label>
                    <input type="range" min="50" max="130" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest block">Intenção de Caimento</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px] tracking-widest uppercase">
                    <button 
                      onClick={() => setFitPreference('adjusted')} 
                      className={"py-3 border transition-colors " + (fitPreference === 'adjusted' ? 'border-white text-white bg-zinc-900' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600')}
                    >
                      Ajustado
                    </button>
                    <button 
                      onClick={() => setFitPreference('boxy')} 
                      className={"py-3 border transition-colors " + (fitPreference === 'boxy' ? 'border-white text-white bg-zinc-900' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600')}
                    >
                      Boxy (Original)
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={handleApplyRecommendedSize} className="w-full bg-zinc-900 border border-zinc-700 text-white text-[10px] uppercase tracking-widest py-3.5 hover:bg-zinc-800 transition-colors">
                    Aplicar Tamanho {recommendedSize}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-white text-black font-sans font-bold text-[11px] uppercase tracking-[0.2em] py-4 md:py-5 hover:bg-zinc-200 transition-colors"
            >
              Adquirir Artefato
            </button>
            <span className="text-[9px] text-zinc-500 text-center block uppercase tracking-widest font-sans">
              Envio Imediato • Rastreio White Glove
            </span>
          </div>

          <div className="border-t border-zinc-900 pt-8 space-y-6 font-sans">
            <div className="space-y-2">
              <h3 className="text-[10px] text-zinc-300 uppercase tracking-widest">O Produto</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed pr-4">
                Estrutura de pedra, respirabilidade de areia. Desenvolvida em algodão heavyweight de alta gramatura, esta peça mantém a silhueta arquitetônica sem ceder ao longo do dia, oferecendo conforto térmico ideal para a transição entre o esporte e a cidade.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px] text-zinc-400 uppercase tracking-widest">
              <div className="space-y-1">
                <span className="block text-zinc-600">Material</span>
                <span className="block text-zinc-300">100% Algodão 260GSM</span>
              </div>
              <div className="space-y-1">
                <span className="block text-zinc-600">Gola</span>
                <span className="block text-zinc-300">Ribana 3cm Reforçada</span>
              </div>
              <div className="space-y-1">
                <span className="block text-zinc-600">Modelagem</span>
                <span className="block text-zinc-300">Boxy Oversized</span>
              </div>
              <div className="space-y-1">
                <span className="block text-zinc-600">Identificação</span>
                <span className="block text-zinc-300">Placa de Serial a Laser</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}