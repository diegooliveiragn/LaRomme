'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, ColorWay, Size } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';
import { Check, ShieldCheck, Truck, RefreshCw, ChevronDown } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedColor, setSelectedColor] = useState<ColorWay>(product.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Galeria / Visual do Produto */}
      <div className="lg:col-span-7 space-y-4">
        <div className="aspect-[3/4] bg-white border border-zinc-200 p-8 flex flex-col justify-center items-center text-center relative">
          <span className="text-xs font-bold uppercase tracking-editorial text-brand-red mb-2">
            {product.subtitle}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-brand-black">
            {product.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-4 italic font-serif max-w-md">
            "{product.concept}"
          </p>
          <div className="absolute bottom-6 left-6 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            Cor selecionada: {selectedColor.name}
          </div>
        </div>
      </div>

      {/* Informações e Formulário de Compra */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
            Drop 01 — {product.collection}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-brand-black">
            {product.name}
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
            {product.subtitle}
          </p>
          <div className="mt-4 text-2xl font-bold text-brand-black">
            {formatCurrency(product.price)}
          </div>
        </div>

        <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed border-y border-zinc-200 py-4">
          {product.shortDescription}
        </p>

        {/* Seleção de Cor */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">
            Cor: <span className="text-zinc-500 font-normal">{selectedColor.name}</span>
          </label>
          <div className="flex gap-3">
            {product.availableColors.map((color) => (
              <button
                key={color.slug}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                  selectedColor.slug === color.slug ? 'border-brand-black scale-110' : 'border-zinc-300'
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
            <label className="font-bold uppercase tracking-widest text-brand-black">
              Tamanho
            </label>
            <Link href="/tamanho" className="text-zinc-500 underline uppercase tracking-wider text-[10px] hover:text-brand-black">
              Guia de Tamanhos
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-xs font-bold uppercase tracking-wider border transition-all ${
                  selectedSize === size
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'bg-white text-brand-black border-zinc-300 hover:border-brand-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-[10px] text-brand-red uppercase tracking-wider">
              * Selecione um tamanho para continuar.
            </p>
          )}
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full py-5 text-xs font-bold uppercase tracking-editorial transition-all flex items-center justify-center gap-2 ${
            !selectedSize
              ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
              : addedToCart
              ? 'bg-green-700 text-white'
              : 'bg-brand-red text-white hover:bg-red-700 shadow-md'
          }`}
        >
          {addedToCart ? (
            <>
              <Check size={16} /> Item Adicionado Ao Carrinho
            </>
          ) : (
            'Adicionar Ao Carrinho'
          )}
        </button>

        {/* Garantias de Marca */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 text-center text-[10px] uppercase tracking-wider text-zinc-500">
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

        {/* Accordions de Informações Adicionais */}
        <div className="border-t border-zinc-200 pt-4 space-y-3">
          <div className="border-b border-zinc-200 pb-3">
            <button
              onClick={() => toggleAccordion('details')}
              className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-widest text-brand-black py-2"
            >
              <span>Detalhes e Modelagem</span>
              <ChevronDown size={16} className={`transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
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
              <ChevronDown size={16} className={`transition-transform ${openAccordion === 'materials' ? 'rotate-180' : ''}`} />
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
              <ChevronDown size={16} className={`transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
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
      </div>
    </div>
  );
}
