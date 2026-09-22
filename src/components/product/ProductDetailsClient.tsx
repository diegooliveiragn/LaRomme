'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ColorWay, Size } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';
import { EASINGS, DURATIONS } from '@/config/motion';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { Check, ShieldCheck, Truck, RefreshCw, ChevronDown, ArrowRight, Ruler } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedColor, setSelectedColor] = useState<ColorWay>(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'materials' | 'care' | null>('details');
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedColor, selectedSize, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleAccordion = (section: 'details' | 'materials' | 'care') => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Galeria / Display do Produto */}
        <div className="lg:col-span-7 space-y-4 sticky top-28">
          <div className="aspect-[3/4] bg-white border border-zinc-200 p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedColor.slug}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
                className="w-full flex flex-col items-center justify-center space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-editorial text-brand-red font-sans">
                  {product.subtitle}
                </span>
                <h2 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-wider text-brand-black">
                  {product.name}
                </h2>
                <p className="text-xs text-zinc-500 italic font-serif max-w-md">
                  "{product.concept}"
                </p>
                
                <div 
                  className="w-16 h-16 rounded-full border border-zinc-300 shadow-md mt-6 transition-transform duration-500"
                  style={{ backgroundColor: selectedColor.hex }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 left-6 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              VARIANTE: {selectedColor.name}
            </div>
          </div>
        </div>

        {/* Informações Comerciais e Narrativas */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="lg:col-span-5 space-y-8"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-editorial text-brand-red block mb-1 font-mono">
              DROP 01 // {product.collection}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-tight text-brand-black">
              {product.name}
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-sans">
              {product.subtitle}
            </p>
            <div className="mt-4 text-2xl font-bold text-brand-black font-mono">
              {formatCurrency(product.price)}
            </div>
          </div>

          <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed border-y border-zinc-200 py-4 font-sans">
            {product.shortDescription}
          </p>

          {/* Seleção de Cor */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-black block font-sans">
              Cor: <span className="text-zinc-500 font-normal">{selectedColor.name}</span>
            </label>
            <div className="flex gap-3">
              {product.availableColors.map((color) => (
                <button
                  key={color.slug}
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                    selectedColor.slug === color.slug ? 'border-brand-black scale-110 shadow-sm' : 'border-zinc-300 hover:border-zinc-500'
                  }`}
                  title={color.name}
                >
                  <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Tamanho */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-widest text-brand-black font-sans">
                Tamanho
              </label>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-zinc-500 underline uppercase tracking-wider text-[10px] hover:text-brand-black flex items-center gap-1 font-mono"
              >
                <Ruler size={12} /> Guia de Medidas
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-bold uppercase tracking-wider border transition-all font-mono ${
                    selectedSize === size
                      ? 'bg-brand-black text-white border-brand-black shadow-sm'
                      : 'bg-white text-brand-black border-zinc-300 hover:border-brand-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-[10px] text-brand-red uppercase tracking-wider font-mono">
                * Selecione um tamanho para continuar.
              </p>
            )}
          </div>

          {/* Botão Principal de Compra */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-5 text-xs font-bold uppercase tracking-editorial transition-all flex items-center justify-center gap-2 ${
              !selectedSize
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-700 text-white'
                : 'bg-brand-red text-white hover:bg-red-700 shadow-xl hover:shadow-brand-red/20'
            }`}
          >
            {addedToCart ? (
              <>
                <Check size={16} /> Item Adicionado Ao Carrinho
              </>
            ) : (
              <>
                Adicionar Ao Carrinho <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Garantias */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 text-center text-[10px] uppercase tracking-wider text-zinc-500 font-sans">
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-brand-black" />
              <span>Envio Seguro</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw size={16} className="text-brand-black" />
              <span>Troca Fácil</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-brand-black" />
              <span>Garantia LaRomme</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-zinc-200 pt-4 space-y-3 font-sans">
            <div className="border-b border-zinc-200 pb-3">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-black py-2"
              >
                <span>Detalhes e Modelagem</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="text-xs text-zinc-600 uppercase tracking-wider pt-2 space-y-2">
                  <p>{product.fitDetails}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {product.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-b border-zinc-200 pb-3">
              <button
                onClick={() => toggleAccordion('materials')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-black py-2"
              >
                <span>Composição e Tecnologia</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'materials' && (
                <ul className="text-xs text-zinc-600 uppercase tracking-wider pt-2 list-disc pl-4 space-y-1">
                  {product.materials.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-b border-zinc-200 pb-3">
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-black py-2"
              >
                <span>Instruções de Conservação</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'care' && (
                <ul className="text-xs text-zinc-600 uppercase tracking-wider pt-2 list-disc pl-4 space-y-1">
                  {product.careInstructions.map((care, i) => (
                    <li key={i}>{care}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Mobile Bar de Compra */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-black/95 text-white p-4 border-t border-zinc-800 backdrop-blur-md z-30 flex items-center justify-between gap-4">
        <div>
          <span className="font-serif text-sm font-bold uppercase block">{product.name}</span>
          <span className="font-mono text-xs text-brand-red font-bold">{formatCurrency(product.price)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`px-6 py-3 text-[10px] font-bold uppercase tracking-editorial font-sans ${
            !selectedSize
              ? 'bg-zinc-800 text-zinc-500'
              : 'bg-brand-red text-white'
          }`}
        >
          {selectedSize ? 'Comprar' : 'Escolha o Tam'}
        </button>
      </div>

      {/* Modal de Guia de Tamanhos */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}