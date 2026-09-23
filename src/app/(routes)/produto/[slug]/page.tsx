'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS_ORIGO } from '@/data/products';
import { useCart } from '@/context/CartContext';

// Componente: Gaveta Brutalista (Acordeão)
const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-900">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-5 flex justify-between items-center text-left hover:text-brand-red transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">{title}</span>
        <span className="font-mono text-[14px]">{isOpen ? '-' : '+'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden"
          >
            <div className="pb-6 font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const rawProduct = PRODUCTS_ORIGO.find((p) => p.slug === params.slug);
  const cart = useCart() as any;
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!rawProduct) return notFound();

  // Cast seguro para permitir acesso resiliente a propriedades do objeto
  const product = rawProduct as any;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Aviso: Selecione a dimensão estrutural antes de alocar o artefato.');
      return;
    }

    if (cart) {
      if (typeof cart.addToCart === 'function') {
        cart.addToCart(product, selectedSize, 1);
      } else if (typeof cart.addItem === 'function') {
        cart.addItem(product, selectedSize, 1);
      }
      if (typeof cart.openCart === 'function') {
        cart.openCart();
      }
    } else {
      alert("Artefato alocado com sucesso.");
    }
  };

  const displayImages: any[] = product.images || [];
  const descriptionText = product.description || product.details || product.summary || 'Artefato de alta densidade da coleção Origo.';

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
          
          {/* LADO ESQUERDO: Galeria Editorial (Scrollável) */}
          <div className="lg:col-span-7 space-y-6">
            {displayImages.map((imgItem: any, idx: number) => {
              const imgSrc = typeof imgItem === 'string' ? imgItem : imgItem?.src;
              const imgAlt = typeof imgItem === 'string' ? `${product.name} - Vista${idx + 1}` : (imgItem?.alt || product.name);

              return (
                <div key={idx} className="relative aspect-[3/4] bg-zinc-950 w-full overflow-hidden border border-zinc-900 group">
                  <img 
                    src={imgSrc} 
                    alt={imgAlt} 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    loading={idx === 0 ? "eager" : "lazy"} 
                  />
                </div>
              );
            })}
          </div>

          {/* LADO DIREITO: Painel de Comando (Fixo/Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 w-full">
            <div className="space-y-10">
              
              {/* Título e Preço */}
              <div className="space-y-4 border-b border-zinc-900 pb-8">
                <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">Drop 01 // Origo</span>
                <h1 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider text-white">{product.name}</h1>
                <p className="font-mono text-lg text-zinc-300">R$ {Number(product.price).toFixed(2)}</p>
              </div>

              {/* Descrição Principal */}
              <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
                {descriptionText}
              </p>

              {/* Grade de Dimensões */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Dimensões Estruturais</span>
                  <a href="/tamanho" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest underline underline-offset-4 transition-colors">
                    Guia de Medidas
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(product.sizes || ['P', 'M', 'G', 'GG']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 font-mono text-[10px] uppercase tracking-widest border transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-brand-red bg-brand-red text-white'
                          : 'border-zinc-800 text-zinc-400 hover:border-brand-offwhite hover:text-brand-black hover:bg-brand-offwhite'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão de Alocação */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-500 shadow-2xl"
              >
                {selectedSize ? '[ Alocar Artefato ]' : '[ Selecione a Dimensão ]'}
              </button>

              {/* Acordeões Técnicos */}
              <div className="pt-8 border-t border-zinc-900">
                <Accordion title="Composição & Gramatura" defaultOpen={true}>
                  Tecido de alta densidade projetado para manter a estrutura e o caimento. Algodão premium (100%) com gramatura superior (280gsm), garantindo opacidade absoluta e resistência ao tempo.
                </Accordion>
                <Accordion title="Corte & Caimento">
                  Modelagem arquitetônica inspirada em linhas brutalistas. Caimento boxy, ombros deslocados (drop shoulder) e proporções ampliadas para gerar movimento e silhueta sem contato excessivo com o corpo.
                </Accordion>
                <Accordion title="Logística & Envio">
                  Este é um item do Lote Zero. A logística é tratada com extrema diligência. Envios realizados em embalagem selada da LaRomme. Prazo de processamento de 2 a 4 dias úteis após a aprovação da alocação.
                </Accordion>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}