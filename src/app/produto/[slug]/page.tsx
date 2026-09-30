'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/data/products';
import FadeIn from '@/components/FadeIn';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product | undefined = PRODUCTS.find((p) => p.id === params.slug);

  if (!product) {
    notFound();
  }

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showProportionModal, setShowProportionModal] = useState(false);
  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('80');
  const [fitPreference, setFitPreference] = useState<'ANATÔMICO' | 'PADRÃO' | 'AMPLO'>('PADRÃO');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  
  // Estado do Magnifier Zoom
  const [zoomStyle, setZoomStyle] = useState<{ [key: number]: React.CSSProperties }>({});

  const currentImages = product.colors[selectedColorIndex]?.images || product.defaultImages;

  const calculateRecommendedSize = () => {
    const w = parseFloat(weight) || 80;
    if (w < 70) return 'P';
    if (w >= 70 && w <= 83) return fitPreference === 'AMPLO' ? 'G' : 'M';
    if (w > 83 && w <= 93) return fitPreference === 'ANATÔMICO' ? 'M' : 'G';
    return 'GG';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle((prev) => ({
      ...prev,
      [idx]: { transformOrigin: `${x}% ${y}%`, transform: 'scale(1.8)' }
    }));
  };

  const handleMouseLeave = (idx: number) => {
    setZoomStyle((prev) => ({
      ...prev,
      [idx]: { transformOrigin: 'center center', transform: 'scale(1)' }
    }));
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      <FadeIn>
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-4">
          <Link href="/#origo" className="hover:text-white transition-colors">← VOLTAR PARA COLEÇÃO.</Link>
          <span>ARTEFATO / {product.id.toUpperCase()}</span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LADO ESQUERDO: GALERIA COM LENTE DE AUMENTO */}
        <div className="lg:col-span-7 space-y-6">
          {currentImages.map((imgUrl, idx) => (
            <FadeIn key={idx} delay={idx * 100}>
              <div 
                className="relative aspect-[3/4] w-full bg-zinc-950 border border-zinc-900 overflow-hidden cursor-crosshair group"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
              >
                <div className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out" style={zoomStyle[idx] || {}}>
                  <Image
                    src={imgUrl}
                    alt={`${product.name} - ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
                {/* Dica visual de zoom */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  ZOOM ÓPTICO
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* LADO DIREITO FIXO */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 h-fit">
          <FadeIn>
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">{product.category}</span>
              <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-white font-bold">{product.name}</h1>
              <p className="text-xl font-mono text-white font-bold pt-2">{product.price}</p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{product.description}</p>
          </FadeIn>

          {product.colors.length > 0 && (
            <FadeIn delay={150}>
              <div className="space-y-3 border-t border-zinc-900 pt-6">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>COR ATIVA:</span>
                  <span className="text-white font-bold">{product.colors[selectedColorIndex].name}.</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border transition-all ${
                        selectedColorIndex === idx ? 'border-white scale-110' : 'border-zinc-800 hover:border-zinc-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={200}>
            <div className="space-y-3 border-t border-zinc-900 pt-6">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">TAMANHO:</span>
                <button
                  onClick={() => setShowProportionModal(true)}
                  className="text-zinc-300 underline underline-offset-4 hover:text-white"
                >
                  SISTEMA DE PROPORÇÃO.
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['P', 'M', 'G', 'GG'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-mono border transition-all ${
                      selectedSize === size
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={250}>
            <button className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 hover:bg-zinc-200 transition-all shadow-2xl">
              ADICIONAR AO CARRINHO.
            </button>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="border-t border-zinc-900 pt-6 space-y-4 font-sans text-xs">
              <div className="border-b border-zinc-900 pb-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
                  className="w-full flex justify-between text-left font-mono text-zinc-300 uppercase tracking-wider"
                >
                  <span>01. TECIDO & COMPOSIÇÃO.</span>
                  <span>{openAccordion === 0 ? '—' : '+'}</span>
                </button>
                {openAccordion === 0 && (
                  <p className="mt-3 text-zinc-400 leading-relaxed font-light">{product.fabric}</p>
                )}
              </div>

              <div className="border-b border-zinc-900 pb-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                  className="w-full flex justify-between text-left font-mono text-zinc-300 uppercase tracking-wider"
                >
                  <span>02. MODELAGEM & FIT.</span>
                  <span>{openAccordion === 1 ? '—' : '+'}</span>
                </button>
                {openAccordion === 1 && (
                  <p className="mt-3 text-zinc-400 leading-relaxed font-light">{product.fit}</p>
                )}
              </div>

              <div className="border-b border-zinc-900 pb-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
                  className="w-full flex justify-between text-left font-mono text-zinc-300 uppercase tracking-wider"
                >
                  <span>03. CUIDADOS & CONSERVAÇÃO.</span>
                  <span>{openAccordion === 2 ? '—' : '+'}</span>
                </button>
                {openAccordion === 2 && (
                  <p className="mt-3 text-zinc-400 leading-relaxed font-light">{product.care}</p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {showProportionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#080808] border-l border-zinc-800 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6 font-sans">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h3 className="font-serif text-lg tracking-wider text-white">SISTEMA DE PROPORÇÃO.</h3>
                <button onClick={() => setShowProportionModal(false)} className="text-zinc-500 hover:text-white font-mono">✕</button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Insira suas medidas anatômicas para calcularmos o caimento exato na modelagem de Fortaleza.
              </p>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-2">ALTURA (CM):</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2">PESO (KG):</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2">PREFERÊNCIA DE CAIMENTO:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ANATÔMICO', 'PADRÃO', 'AMPLO'] as const).map((pref) => (
                      <button key={pref} onClick={() => setFitPreference(pref)} className={`py-2 text-[10px] border ${fitPreference === pref ? 'bg-white text-black border-white font-bold' : 'border-zinc-800 text-zinc-500'}`}>
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">RECOMENDAÇÃO CALCULADA</span>
                <p className="font-serif text-2xl text-white font-bold">TAMANHO {calculateRecommendedSize()}.</p>
                <p className="text-[11px] text-zinc-400 font-light">Proporção perfeita para caimento alinhado sem excessos.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedSize(calculateRecommendedSize());
                setShowProportionModal(false);
              }}
              className="w-full bg-white text-black font-bold text-xs tracking-[0.25em] uppercase py-4 hover:bg-zinc-200 transition-all font-sans"
            >
              APLICAR TAMANHO {calculateRecommendedSize()}.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}