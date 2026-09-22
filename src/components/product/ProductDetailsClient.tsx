'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ColorWay, Size } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { EASINGS, DURATIONS } from '@/config/motion';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { ShieldCheck, Truck, RefreshCw, ChevronDown, ArrowRight, Ruler } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedColor, setSelectedColor] = useState<ColorWay>(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'materials' | 'care' | null>('details');
  
  const hasImages = product.images && product.images.length > 0;
  let activeImageSrc = '';
  
  if (hasImages) {
    const activeImgObj = product.images.find(img => {
      const srcStr = typeof img === 'string' ? img : img.src;
      return srcStr.toLowerCase().includes(selectedColor.slug);
    }) || product.images[0];
    activeImageSrc = typeof activeImgObj === 'string' ? activeImgObj : (activeImgObj?.src || '');
  }

  const handleVIPAccess = () => {
    if (!selectedSize) return;
    window.location.href = '/acesso';
  };

  const toggleAccordion = (section: 'details' | 'materials' | 'care') => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Galeria de Imagens / Placeholder */}
        <div className="lg:col-span-7 space-y-4 relative lg:sticky lg:top-28">
          <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 relative overflow-hidden shadow-xl">
            {activeImageSrc ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageSrc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={activeImageSrc}
                    alt={`${product.name} - ${selectedColor.name}`}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90">
                <span className="font-serif text-5xl text-zinc-800 opacity-40">LR</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-6">
                  [ Arquivo Visual Em Atualização ]
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-brand-black/90 backdrop-blur-sm text-white text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 z-10 border border-zinc-800">
              VARIANTE: {selectedColor.name}
            </div>
          </div>
        </div>

        {/* Informações de Produto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

          {/* FIT EXPERIENCE VISUAL */}
          <div className="bg-zinc-50 p-4 border border-zinc-200 space-y-2 font-sans">
            <span className="font-mono text-[10px] uppercase font-bold text-brand-black block tracking-wider">
              Caimento & Estrutura
            </span>
            <p className="text-[11px] text-zinc-600 uppercase tracking-wide leading-normal">
              {product.fitDetails}
            </p>
          </div>

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
                    selectedColor.slug === color.slug ? 'border-brand-black scale-105 shadow-sm' : 'border-zinc-300 hover:border-zinc-500'
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
                * Selecione um tamanho para solicitar acesso.
              </p>
            )}
          </div>

          <button
            onClick={handleVIPAccess}
            disabled={!selectedSize}
            className={`w-full py-5 text-xs font-bold uppercase tracking-editorial transition-all flex items-center justify-center gap-2 ${
              !selectedSize
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-brand-black text-white hover:bg-brand-red shadow-xl'
            }`}
          >
            Solicitar Acesso Antecipado <ArrowRight size={16} />
          </button>

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

          {/* Acordeão de Detalhes Técnicos */}
          <div className="border-t border-zinc-200 pt-4 space-y-3 font-sans">
            <div className="border-b border-zinc-200 pb-3">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-black py-2"
              >
                <span>Construção e Acabamento</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="text-xs text-zinc-600 uppercase tracking-wider pt-2 space-y-2">
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
                <span>Materialidade</span>
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
                <span>Conservação</span>
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

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}