'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import FadeIn from '@/components/FadeIn';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product | undefined = PRODUCTS.find((p) => p.id === params.slug);

  if (!product) {
    notFound();
  }

  // Outros produtos para o carrossel inferior
  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id);

  const { addToCart } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Se for Tamanho Único, o estado inicial é 'TU'
  const [selectedSize, setSelectedSize] = useState<string>(product.isOneSize ? 'TU' : 'M');

  const [showProportionModal, setShowProportionModal] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('80');
  const [fitPreference, setFitPreference] = useState<'ANATÔMICO' | 'PADRÃO' | 'AMPLO'>('PADRÃO');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const [zoomStyle, setZoomStyle] = useState<{ [key: number]: React.CSSProperties }>({});

  // ESTOQUE WMS EM TEMPO REAL
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [hasFetchedStock, setHasFetchedStock] = useState(false);

  useEffect(() => {
    async function fetchRealtimeStock() {
      try {
        const { data: variants, error } = await supabase
          .from('inventory_variants')
          .select('size, stock_available');

        if (!error && variants && variants.length > 0) {
          const map: Record<string, number> = {};
          variants.forEach((v) => {
            const key = v.size ? v.size.toUpperCase() : 'TU';
            map[key] = (map[key] || 0) + (v.stock_available ?? 0);
          });
          setStockMap(map);
          setHasFetchedStock(true);
        }
      } catch (err) {
        console.error('Erro ao ler estoque WMS Supabase:', err);
      }
    }
    fetchRealtimeStock();
  }, [product.id]);

  const currentImages = product.colors[selectedColorIndex]?.images || product.defaultImages;

  const handleAddToCart = () => {
    const sizeToCart = product.isOneSize ? 'TU' : selectedSize;
    addToCart(product, sizeToCart, selectedColorIndex);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 3000);
  };

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
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16 relative font-sans">
      <FadeIn>
        <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-zinc-900 pb-4">
          <Link href="/#origo" className="hover:text-white transition-colors">← VOLTAR PARA COLEÇÃO.</Link>
          <span>ARTEFATO / {product.id.toUpperCase()}</span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  ZOOM ÓPTICO
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

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

              {product.isOneSize ? (
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">TAMANHO:</span>
                  <span className="text-white font-bold tracking-widest border border-white px-4 py-2">ÚNICO (AJUSTÁVEL)</span>
                </div>
              ) : (
                <>
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
                    {['P', 'M', 'G', 'GG'].map((size) => {
                      const isOutOfStock = hasFetchedStock && stockMap[size] !== undefined && stockMap[size] <= 0;
                      return (
                        <button
                          key={size}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 text-xs font-mono border transition-all ${
                            isOutOfStock
                              ? 'opacity-30 border-zinc-900 text-zinc-700 line-through cursor-not-allowed'
                              : selectedSize === size
                                ? 'bg-white text-black border-white font-bold'
                                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={250}>
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.99]"
            >
              {addedToast ? '✓ ARTEFATO ADICIONADO!' : 'ADICIONAR AO CARRINHO.'}
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

      {/* MODAL DE SISTEMA DE PROPORÇÃO */}
      {!product.isOneSize && showProportionModal && (
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

      {/* CARROSSEL CROSS-SELL NA BASE DA PDP */}
      <FadeIn delay={400}>
        <div className="pt-24 border-t border-zinc-900 mt-20 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl md:text-3xl tracking-[0.2em] text-white uppercase font-bold">
              CONTINUE EXPLORANDO.
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {otherProducts.map((p) => (
              <Link
                href={`/produto/${p.id}`}
                key={p.id}
                className="group flex-none w-64 md:w-80 snap-start bg-[#080808] border border-zinc-900 p-5 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden mb-4">
                  <Image
                    src={p.defaultImages[0]}
                    alt={p.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                  />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-serif text-base tracking-wider text-white font-bold">{p.name}</h3>
                  <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">{p.price}</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 block truncate">{p.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>

    </div>
  );
}