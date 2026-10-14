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

  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id);

  const { addToCart, isDropVipOnly, isVipUnlocked, vipMember, unlockVip } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.isOneSize ? 'TU' : 'M');

  const [showProportionModal, setShowProportionModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [vipInput, setVipInput] = useState('');
  const [vipLoading, setVipLoading] = useState(false);
  const [vipError, setVipError] = useState('');
  const [addedToast, setAddedToast] = useState(false);

  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('80');
  const [fitPreference, setFitPreference] = useState<'ANATÔMICO' | 'PADRÃO' | 'AMPLO'>('PADRÃO');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [zoomStyle, setZoomStyle] = useState<{ [key: number]: React.CSSProperties }>({});

  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [hasFetchedStock, setHasFetchedStock] = useState(false);

  const productId = product.id;

  useEffect(() => {
    async function fetchRealtimeStock() {
      if (!productId) return;
      try {
        const { data: variants, error } = await supabase
          .from('inventory_variants')
          .select('size, stock_available')
          .eq('product_id', productId);

        if (!error && variants) {
          const map: Record<string, number> = {};
          variants.forEach((v) => {
            const key = v.size ? v.size.toUpperCase() : 'TU';
            map[key] = v.stock_available ?? 0;
          });
          setStockMap(map);
          setHasFetchedStock(true);
        }
      } catch (err) {
        console.error('Erro ao ler estoque WMS Supabase:', err);
      }
    }
    fetchRealtimeStock();
  }, [productId]);

  const currentImages = product.colors[selectedColorIndex]?.images || product.defaultImages;
  const isSelectedSizeOutOfStock = hasFetchedStock && (stockMap[selectedSize] ?? 0) <= 0;
  const isLocked = isDropVipOnly && !isVipUnlocked;

  const handleActionClick = () => {
    if (isLocked) {
      setShowVipModal(true);
      return;
    }
    if (isSelectedSizeOutOfStock) return;
    const sizeToCart = product.isOneSize ? 'TU' : selectedSize;
    addToCart(product, sizeToCart, selectedColorIndex);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2800);
  };

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipInput.trim()) return;

    setVipLoading(true);
    setVipError('');

    const res = await unlockVip(vipInput);
    setVipLoading(false);

    if (res.success) {
      setShowVipModal(false);
      setVipInput('');
    } else {
      setVipError(res.message || 'Credencial não reconhecida.');
    }
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
      [idx]: { transformOrigin: `${x}\%${y}%`, transform: 'scale(1.6)' }
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
          <Link href="/#origo" className="hover:text-white transition-colors">← VOLTAR PARA O ACERVO</Link>
          <div className="flex items-center gap-3">
            {isVipUnlocked && (
              <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-950/20">
                ✓ SENADO VIP ATIVO
              </span>
            )}
            <span className="tracking-widest hidden sm:inline">DROP 01 // SISTEMA ORIGO</span>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* GALERIA EDITORIAL (PROPORÇÃO 1:1) */}
        <div className="lg:col-span-7 space-y-6">
          {currentImages.map((imgUrl, idx) => (
            <FadeIn key={idx} delay={idx * 100}>
              <div
                className="relative aspect-square w-full bg-zinc-950 border border-zinc-900 overflow-hidden cursor-crosshair group"
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
              >
                <div className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out" style={zoomStyle[idx] || {}}>
                  <Image
                    src={imgUrl}
                    alt={`${product.name} -${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover contrast-[1.05]"
                    priority={idx === 0}
                  />
                </div>
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                  AMPLIAR DETALHE
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* COLUNA DE ESPECIFICAÇÃO & COMPRA */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 h-fit">
          <FadeIn>
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">{product.category}</span>
              <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-white font-bold">{product.name}</h1>
              <p className="text-xl font-mono text-white font-bold pt-2">{product.price}</p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">{product.description}</p>
          </FadeIn>

          {/* SINAIS DE ORIGEM E IDENTIDADE */}
          <FadeIn delay={130}>
            <div className="border border-zinc-900 bg-zinc-950/60 p-4 font-mono text-[11px] space-y-2 text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="text-zinc-300">Desenhada e testada no clima de Fortaleza.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="text-zinc-300">Transição natural entre a prática esportiva e a cidade.</span>
              </div>
            </div>
          </FadeIn>

          {product.colors.length > 0 && (
            <FadeIn delay={150}>
              <div className="space-y-3 border-t border-zinc-900 pt-6">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span className="uppercase tracking-widest">COR:</span>
                  <span className="text-white font-bold">{product.colors[selectedColorIndex].name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border transition-all ${
                        selectedColorIndex === idx ? 'border-white scale-110 shadow-lg' : 'border-zinc-800 hover:border-zinc-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Selecionar cor ${color.name}`}
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
                  <span className="text-zinc-400 uppercase tracking-widest">TAMANHO:</span>
                  <span className="text-white font-bold tracking-widest border border-white/20 px-4 py-2 bg-zinc-950">
                    ÚNICO (REGULÁVEL)
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 uppercase tracking-widest">TAMANHO:</span>
                    <button
                      onClick={() => setShowProportionModal(true)}
                      className="text-zinc-300 underline underline-offset-4 hover:text-white transition-colors"
                    >
                      CALCULADORA DE PROPORÇÃO →
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['P', 'M', 'G', 'GG'].map((size) => {
                      const isOutOfStock = hasFetchedStock && (stockMap[size] ?? 0) <= 0;
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
            <div className="space-y-3 pt-2">
              <button
                onClick={handleActionClick}
                disabled={!isLocked && isSelectedSizeOutOfStock}
                className={`w-full font-bold text-xs tracking-[0.25em] uppercase py-4 transition-all shadow-xl ${
                  isLocked
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 active:scale-[0.99]'
                    : isSelectedSizeOutOfStock
                      ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.99]'
                }`}
              >
                {addedToast
                  ? '✓ PEÇA ADICIONADA À SACOLA'
                  : isLocked
                    ? 'ACESSO EXCLUSIVO // SENADO VIP →'
                    : isSelectedSizeOutOfStock
                      ? 'GRADE INDISPONÍVEL'
                      : `ADICIONAR À SACOLA — ${product.price}`}
              </button>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 pt-2 text-center">
                <span className="border border-zinc-900 py-2">PRIMEIRA TROCA GRÁTIS</span>
                <span className="border border-zinc-900 py-2">ENVIO PARA TODO O BRASIL</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="border-t border-zinc-900 pt-6 space-y-4 font-sans text-xs">
              <div className="border-b border-zinc-900 pb-4">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
                  className="w-full flex justify-between text-left font-mono text-zinc-300 uppercase tracking-wider"
                >
                  <span>01. TECIDO & COMPOSIÇÃO</span>
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
                  <span>02. MODELAGEM & FIT</span>
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
                  <span>03. CUIDADOS & CONSERVAÇÃO</span>
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

      {/* MODAL DE DESBLOQUEIO SENADO VIP */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#080808] border border-zinc-800 p-8 space-y-6 font-mono text-xs shadow-2xl relative">
            <button
              onClick={() => setShowVipModal(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white text-base"
            >
              ✕
            </button>

            <div className="space-y-2 border-b border-zinc-900 pb-4">
              <span className="text-[10px] tracking-[0.3em] text-amber-400 uppercase block">ACESSO RESTRITO</span>
              <h3 className="font-serif text-xl text-white font-bold tracking-wider uppercase">SENADO VIP</h3>
              <p className="text-zinc-400 font-sans text-xs font-light leading-relaxed">
                O Drop 01 está disponível com 24h de antecedência exclusivamente para membros alistados.
              </p>
            </div>

            <form onSubmit={handleVipSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest text-[10px]">
                  E-MAIL OU CÓDIGO DE ACESSO:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: seu@email.com ou passe"
                  value={vipInput}
                  onChange={(e) => setVipInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {vipError && (
                <p className="text-[11px] text-rose-400 border border-rose-900/50 bg-rose-950/20 p-2.5">
                  {vipError}
                </p>
              )}

              <button
                type="submit"
                disabled={vipLoading}
                className="w-full bg-white text-black font-bold py-3.5 uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {vipLoading ? 'VALIDANDO...' : 'DESBLOQUEAR ACESSO'}
              </button>
            </form>

            <div className="pt-2 border-t border-zinc-900 text-center font-sans">
              <p className="text-zinc-500 text-[11px]">
                Ainda não possui credencial?{' '}
                <Link
                  href="/senado-vip"
                  onClick={() => setShowVipModal(false)}
                  className="text-zinc-300 underline underline-offset-4 hover:text-white"
                >
                  Aliste-se no Senado VIP →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PROPORÇÃO & MEDIDAS */}
      {!product.isOneSize && showProportionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#080808] border-l border-zinc-800 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6 font-sans">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h3 className="font-serif text-lg tracking-wider text-white uppercase font-bold">CALCULADORA DE PROPORÇÃO</h3>
                <button onClick={() => setShowProportionModal(false)} className="text-zinc-500 hover:text-white font-mono text-sm">✕</button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Modelagem desenvolvida para equilibrar liberdade de movimento nos treinos e caimento alinhado no cotidiano.
              </p>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">ALTURA (CM):</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">PESO (KG):</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">PREFERÊNCIA DE CAIMENTO:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ANATÔMICO', 'PADRÃO', 'AMPLO'] as const).map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setFitPreference(pref)}
                        className={`py-2 text-[10px] border transition-all ${
                          fitPreference === pref
                            ? 'bg-white text-black border-white font-bold'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-widest">TAMANHO SUGERIDO</span>
                <p className="font-serif text-2xl text-white font-bold">TAMANHO {calculateRecommendedSize()}.</p>
                <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                  Proporção equilibrada para movimentação fluida e presença sem excesso de tecido.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedSize(calculateRecommendedSize());
                setShowProportionModal(false);
              }}
              className="w-full bg-white text-black font-bold text-xs tracking-[0.25em] uppercase py-4 hover:bg-zinc-200 transition-all font-sans"
            >
              SELECIONAR TAMANHO {calculateRecommendedSize()}.
            </button>
          </div>
        </div>
      )}

      {/* CARROSSEL BOTTOM DE EXPLORAÇÃO */}
      <FadeIn delay={400}>
        <div className="pt-24 border-t border-zinc-900 mt-20 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl md:text-3xl tracking-[0.2em] text-white uppercase font-bold">
              CONTINUE EXPLORANDO.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherProducts.slice(0, 3).map((p) => (
              <Link
                href={`/produto/${p.id}`}
                key={p.id}
                className="group bg-[#080808] border border-zinc-900 p-6 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden mb-4 border border-white/5">
                  <Image
                    src={p.defaultImages[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale contrast-[1.08] opacity-85 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-serif text-base tracking-wider text-white font-bold">{p.name}</h3>
                  <span className="text-[10px] font-mono text-zinc-400 whitespace-nowrap">{p.price}</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-600 block truncate uppercase">{p.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
