'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import FadeIn from '@/components/FadeIn';
import { ChevronDown, ShieldCheck, Truck, RefreshCw, Check, ArrowRight } from 'lucide-react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product | undefined = PRODUCTS.find((p) => p.id === params.slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.isOneSize ? 'TU' : 'M');
  const [openSection, setOpenSection] = useState<'detalhes' | 'cuidados' | 'origem' | null>('detalhes');
  const [addedToast, setAddedToast] = useState(false);

  const images = product.defaultImages || [];
  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    const sizeToCart = product.isOneSize ? 'TU' : selectedSize;
    addToCart(product, sizeToCart, selectedColorIndex);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 3500);
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto font-sans text-white">
      <FadeIn>
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-8 border-b border-zinc-900 pb-3">
          <Link href="/#origo" className="hover:text-white transition-colors">Acervo</Link>
          <span>/</span>
          <span className="text-zinc-300 font-bold">{product.name}</span>
        </div>

        {/* GRID PRINCIPAL COM STICKY LATERAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* COLUNA ESQUERDA: GALERIA DE FOTOS (SCROLL CONTÍNUO) */}
          <div className="lg:col-span-7 space-y-6">
            {images.map((imgSrc, idx) => (
              <div 
                key={idx} 
                className="relative aspect-3/4 w-full bg-[#080808] border border-zinc-900 overflow-hidden shadow-2xl"
              >
                <Image
                  src={imgSrc}
                  alt={`${product.name} - Imagem ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                  priority={idx === 0}
                />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500 bg-black/80 px-2 py-1 border border-zinc-800">
                  {String(idx + 1).padStart(2, '0')} // {String(images.length).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>

          {/* COLUNA DIREITA: BLOCO DE COMPRA FIXO (STICKY DESCE COM A PÁGINA) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 self-start bg-[#080808] border border-zinc-900 p-6 md:p-8 shadow-2xl">
            
            {/* CABEÇALHO DO PRODUTO */}
            <div className="space-y-2 border-b border-zinc-900 pb-6">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                <span>{product.category}</span>
                <span className="text-zinc-400 font-bold">03°44'S 38°31'W</span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider font-bold text-white">
                {product.name}
              </h1>

              <div className="flex items-baseline justify-between pt-2">
                <span className="font-mono text-xl md:text-2xl text-white font-bold">
                  {product.price}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded uppercase">
                  Disponível para Teste
                </span>
              </div>
            </div>

            {/* DESCRIÇÃO PRINCIPAL */}
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light font-sans">
              {product.description}
            </p>

            {/* SELETOR DE TAMANHO / GRADE */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                <span>Dimensão / Tamanho:</span>
                <span className="text-white font-bold">{selectedSize}</span>
              </div>

              {product.isOneSize ? (
                <div className="p-3 border border-zinc-800 bg-zinc-950 text-center font-mono text-xs uppercase font-bold text-zinc-300">
                  Tamanho Único (Ajustável)
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {['P', 'M', 'G', 'GG'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-mono font-bold uppercase transition-all border ${
                        selectedSize === sz
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÃO ADICIONAR À SACOLA / COMPRAR */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-white text-black font-sans font-bold text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-[0.99]"
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Artefato Adicionado à Sacola</span>
                  </>
                ) : (
                  <>
                    <span>Adicionar à Sacola</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" /> Frete Grátis
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> Transação Segura
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> Primeira Troca Grátis
                </span>
              </div>
            </div>

            {/* ACORDEÕES DE ENGENHARIA TÊXTIL */}
            <div className="border-t border-zinc-900 pt-4 space-y-2 font-sans text-xs">
              
              {/* 1. MATÉRIA-PRIMA */}
              <div className="border-b border-zinc-900 pb-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'detalhes' ? null : 'detalhes')}
                  className="w-full flex justify-between items-center text-left font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 py-1"
                >
                  <span>Matéria-Prima & Caimento</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'detalhes' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'detalhes' && (
                  <p className="mt-2 text-zinc-400 leading-relaxed font-light text-xs font-sans">
                    {product.fabric || '100% Algodão Premium de alta gramatura com toque fresco e estruturado.'}
                  </p>
                )}
              </div>

              {/* 2. CUIDADOS */}
              <div className="border-b border-zinc-900 pb-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'cuidados' ? null : 'cuidados')}
                  className="w-full flex justify-between items-center text-left font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 py-1"
                >
                  <span>Instruções de Conservação</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'cuidados' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'cuidados' && (
                  <p className="mt-2 text-zinc-400 leading-relaxed font-light text-xs font-sans">
                    {product.care || 'Lavar com água fria e secar à sombra para proteger as fibras nobres.'}
                  </p>
                )}
              </div>

              {/* 3. ENGENHARIA & ORIGEM */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'origem' ? null : 'origem')}
                  className="w-full flex justify-between items-center text-left font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 py-1"
                >
                  <span>Engenharia & Origem</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'origem' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'origem' && (
                  <p className="mt-2 text-zinc-400 leading-relaxed font-light text-xs font-sans">
                    Projetado em Fortaleza (03°44'S 38°31'W). Unindo a simetria clássica à ventilação necessária ao clima tropical.
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* CARROSSEL COMPLEMENTAR */}
        <div className="mt-24 pt-16 border-t border-zinc-900 space-y-8">
          <h2 className="font-serif text-xl tracking-[0.2em] uppercase font-bold text-white">
            Outros Artefatos do Acervo.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherProducts.map((p) => (
              <Link 
                key={p.id} 
                href={`/produto/${p.id}`}
                className="bg-[#080808] border border-zinc-900 p-4 hover:border-zinc-700 transition-all group block"
              >
                <div className="relative aspect-3/4 w-full bg-zinc-950 mb-3 overflow-hidden">
                  <Image 
                    src={p.defaultImages[0]} 
                    alt={p.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-sm font-bold text-white uppercase">{p.name}</h3>
                  <span className="font-mono text-xs text-zinc-400">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </FadeIn>
    </div>
  );
}