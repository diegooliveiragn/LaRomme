'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronRight, 
  Ruler, 
  ArrowRight, 
  Bell, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.slug);

  if (!product) {
    notFound();
  }

  // Estados locais
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showProportionModal, setShowProportionModal] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitPreference, setFitPreference] = useState<'ANATÔMICO' | 'PADRÃO' | 'AMPLO'>('PADRÃO');

  // Modal de Aviso de Disponibilidade (Captura de Demanda)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistContact, setWaitlistContact] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Acordeão de Informações
  const [openSection, setOpenSection] = useState<'detalhes' | 'cuidados' | 'origem' | null>('detalhes');

  const images = product.defaultImages || [];
  const sizes = product.isOneSize ? ['Tamanho Único'] : ['P', 'M', 'G', 'GG'];

  // Cálculo do Provador Anatômico
  const calculateRecommendedSize = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return 'M';

    const imc = w / ((h / 100) * (h / 100));

    let baseSize = 'M';
    if (imc < 21) baseSize = 'P';
    else if (imc < 25) baseSize = 'M';
    else if (imc < 29) baseSize = 'G';
    else baseSize = 'GG';

    if (fitPreference === 'AMPLO' && baseSize !== 'GG') {
      if (baseSize === 'P') return 'M';
      if (baseSize === 'M') return 'G';
      if (baseSize === 'G') return 'GG';
    }
    if (fitPreference === 'ANATÔMICO' && baseSize !== 'P') {
      if (baseSize === 'GG') return 'G';
      if (baseSize === 'G') return 'M';
      if (baseSize === 'M') return 'P';
    }

    return baseSize;
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistContact) return;

    setWaitlistStatus('loading');
    try {
      const res = await fetch('/api/cortex/demanda-reprimida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_slug: product.id,
          size: selectedSize || (product.isOneSize ? 'TU' : 'M'),
          contact: waitlistContact
        })
      });
      if (res.ok) {
        setWaitlistStatus('success');
      } else {
        setWaitlistStatus('idle');
      }
    } catch (err) {
      console.error(err);
      setWaitlistStatus('idle');
    }
  };

  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-zinc-800 relative overflow-hidden">
      
      {/* CAMADA SUBLIMINAR: Coordenadas e retículos translúcidos */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <div className="absolute right-4 top-1/3 -rotate-90 origin-right text-[10px] font-mono tracking-[0.4em] text-white/5 uppercase">
          3°44' S  38°31' W // LA ROMME
        </div>
        <div className="absolute left-6 bottom-16 text-[9px] font-mono tracking-widest text-white/5 uppercase hidden md:block">
          ORIGO COLLECTION
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 md:pt-36 md:pb-24 relative z-10 space-y-20">
        
        {/* Navegação Sóbria */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Acervo</Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-zinc-400">{product.category}</span>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-white font-semibold">{product.name}</span>
        </div>

        {/* ESTRUTURA PRINCIPAL: Galeria Vertical + Coluna de Compra Fixa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* COLUNA ESQUERDA: GALERIA EDITORIAL CONTÍNUA (FOTOS GRANDES VERTICAIS) */}
          <div className="lg:col-span-7 space-y-6">
            {images.map((imgUrl, idx) => (
              <div 
                key={idx}
                className="relative aspect-[4/5] w-full bg-[#0a0a0a] border border-zinc-900 rounded-sm overflow-hidden group"
              >
                <Image
                  src={imgUrl}
                  alt={`${product.name} - Perspectiva ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-contain p-2 md:p-4 transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-4 font-mono text-[9px] text-zinc-600 tracking-widest uppercase">
                  0{idx + 1} / 0{images.length}
                </span>
              </div>
            ))}
          </div>

          {/* COLUNA DIREITA: PAINEL FIXO (STICKY DECISION) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 font-sans">
            
            <div className="space-y-2 border-b border-zinc-900 pb-6">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] block">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-white uppercase font-bold">
                {product.name}
              </h1>
              <span className="text-xl font-mono text-zinc-200 block pt-1">
                {product.price}
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              {product.description}
            </p>

            {/* SELEÇÃO DE GRADE (INATIVA COM ESTÉTICA DE LISTA DE ESPERA) */}
            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                  Grade / Tamanhos
                </span>
                {!product.isOneSize && (
                  <button
                    onClick={() => setShowProportionModal(true)}
                    className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5 text-zinc-500" />
                    Provador Anatômico
                  </button>
                )}
              </div>

              <div className={`grid gap-2.5 ${product.isOneSize ? 'grid-cols-1' : 'grid-cols-4'}`}>
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setShowWaitlistModal(true);
                    }}
                    className={`py-3 text-xs font-mono border rounded-sm transition-all relative group ${
                      selectedSize === sz
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    <span className="line-through decoration-zinc-700">{sz}</span>
                    <span className="block text-[8px] tracking-wider text-zinc-600 uppercase mt-0.5">
                      Indisponível
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AÇÃO PRINCIPAL: CAPTURA DE DEMANDA REPRIMIDA */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowWaitlistModal(true)}
                className="w-full py-4 bg-zinc-100 hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-md rounded-sm"
              >
                <Bell className="w-3.5 h-3.5 text-zinc-900" />
                Notificar Disponibilidade
              </button>

              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-wider pt-1">
                <span>Engenharia Têxtil</span>
                <span>Origem: Fortaleza (3°44'S 38°31'W)</span>
              </div>
            </div>

            {/* DETALHES TÉCNICOS & CUIDADOS (ACORDEÃO MINIMALISTA) */}
            <div className="border-t border-zinc-900 divide-y divide-zinc-900/80 text-xs">
              
              <div className="py-3.5">
                <button
                  onClick={() => setOpenSection(openSection === 'detalhes' ? null : 'detalhes')}
                  className="w-full flex justify-between items-center text-left text-zinc-300 hover:text-white font-mono uppercase text-[11px] tracking-wider"
                >
                  <span>Matéria-Prima & Caimento</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'detalhes' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'detalhes' && (
                  <div className="pt-3 pb-1 text-zinc-400 space-y-2 font-light leading-relaxed">
                    <p><strong>Composição:</strong> {product.fabric}</p>
                    <p><strong>Silhueta:</strong> {product.fit}</p>
                  </div>
                )}
              </div>

              <div className="py-3.5">
                <button
                  onClick={() => setOpenSection(openSection === 'cuidados' ? null : 'cuidados')}
                  className="w-full flex justify-between items-center text-left text-zinc-300 hover:text-white font-mono uppercase text-[11px] tracking-wider"
                >
                  <span>Instruções de Conservação</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'cuidados' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'cuidados' && (
                  <div className="pt-3 pb-1 text-zinc-400 font-light leading-relaxed">
                    <p>{product.care}</p>
                  </div>
                )}
              </div>

              <div className="py-3.5">
                <button
                  onClick={() => setOpenSection(openSection === 'origem' ? null : 'origem')}
                  className="w-full flex justify-between items-center text-left text-zinc-300 hover:text-white font-mono uppercase text-[11px] tracking-wider"
                >
                  <span>Engenharia & Origem</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'origem' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'origem' && (
                  <div className="pt-3 pb-1 text-zinc-400 font-light leading-relaxed">
                    <p>Desenvolvido para atender ao clima costeiro de alta temperatura, unindo leveza térmica e elegância geométrica.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* CROSS-SELLING INFERIOR: COMPLETE O ACERVO */}
        <div className="border-t border-zinc-900 pt-16 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                COLEÇÃO ESSENCIAL
              </span>
              <h2 className="text-xl md:text-2xl font-serif text-white uppercase font-bold tracking-wider">
                Complete o Acervo
              </h2>
            </div>
            <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors">
              Explorar Coleção <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProducts.map((other) => (
              <Link
                key={other.id}
                href={`/produto/${other.id}`}
                className="group bg-[#080808] border border-zinc-900 p-4 hover:border-zinc-700 transition-all rounded-sm block space-y-3"
              >
                <div className="relative aspect-[4/5] w-full bg-[#0a0a0a] overflow-hidden rounded-sm">
                  <Image
                    src={other.defaultImages[0]}
                    alt={other.name}
                    fill
                    className="object-contain p-2 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">{other.category}</span>
                    <h3 className="font-serif text-sm font-bold text-white uppercase">{other.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-300">{other.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL PROVADOR ANATÔMICO (TRUE FIT) */}
      {showProportionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0a0a0a] border-l border-zinc-800 p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <h3 className="font-serif text-lg tracking-wider text-white uppercase font-bold">
                  Provador Anatômico
                </h3>
                <button
                  onClick={() => setShowProportionModal(false)}
                  className="text-zinc-500 hover:text-white font-mono text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Informe sua estatura e peso para calcularmos a recomendação de caimento baseada na modelagem LaRomme.
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase text-[10px]">Estatura (cm):</label>
                  <input
                    type="number"
                    placeholder="Ex: 180"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 font-mono rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2 uppercase text-[10px]">Peso Corporal (kg):</label>
                  <input
                    type="number"
                    placeholder="Ex: 78"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 font-mono rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2 uppercase text-[10px]">Preferência de Caimento:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ANATÔMICO', 'PADRÃO', 'AMPLO'] as const).map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setFitPreference(pref)}
                        className={`py-2 text-[10px] border transition-colors rounded-sm ${
                          fitPreference === pref
                            ? 'bg-white text-black border-white font-bold'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {height && weight && (
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-sm space-y-1 font-mono">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Tamanho Recomendado</span>
                  <p className="font-serif text-2xl text-white font-bold">
                    TAMANHO {calculateRecommendedSize()}.
                  </p>
                  <p className="text-[11px] text-zinc-400 font-light">
                    Proporção calculada para o seu biotipo na modelagem de Fortaleza.
                  </p>
                </div>
              )}
            </div>

            <button
              disabled={!height || !weight}
              onClick={() => {
                setSelectedSize(calculateRecommendedSize());
                setShowProportionModal(false);
                setShowWaitlistModal(true);
              }}
              className={`w-full py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-sm ${
                !height || !weight
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              Aplicar Tamanho {height && weight ? calculateRecommendedSize() : ''}
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE NOTIFICAÇÃO DE DISPONIBILIDADE (CAPTURA DE INTERESSE) */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 p-6 md:p-8 space-y-6 font-sans rounded-sm">
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Aviso de Lançamento
                </span>
                <h3 className="font-serif text-lg text-white font-bold uppercase">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="text-zinc-500 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {waitlistStatus === 'success' ? (
              <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-sm text-center space-y-2">
                <Check className="w-6 h-6 text-white mx-auto" />
                <h4 className="text-sm font-bold text-white uppercase font-mono">Contato Registrado</h4>
                <p className="text-xs text-zinc-400 font-light">
                  Você será comunicado em primeira mão assim que a grade estiver liberada.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4 font-mono text-xs">
                <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed">
                  Informe seu WhatsApp ou e-mail. Quando a grade{' '}
                  <strong className="text-white">{selectedSize || 'selecionada'}</strong> estiver
                  disponível para entrega, você receberá a notificação direta.
                </p>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                    Contato (WhatsApp ou E-mail):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(85) 99999-9999 ou seu@email.com"
                    value={waitlistContact}
                    onChange={(e) => setWaitlistContact(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 rounded-sm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={waitlistStatus === 'loading'}
                  className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-sm"
                >
                  {waitlistStatus === 'loading' ? 'Registrando...' : 'Confirmar Interesse'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}