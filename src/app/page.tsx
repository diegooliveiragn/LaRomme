'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PRODUCTS, Product } from '@/data/products';
import FadeIn from '@/components/FadeIn';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@supabase/supabase-js';

const HELMET_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png";
const WORDMARK_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/fcfc607a-ba81-4ff7-998e-2df1f0697b81-removebg-preview.png";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [showFinalBrand, setShowFinalBrand] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    async function syncWMSStock() {
      try {
        const { data: variants, error } = await supabase
          .from('inventory_variants')
          .select('product_id, stock_available');

        if (!error && variants && variants.length > 0) {
          // Atualiza o estado dos produtos respeitando a lista estática
          setProductsList(PRODUCTS);
        }
      } catch (e) {
        console.error('Telemetria WMS em standby:', e);
      }
    }
    syncWMSStock();
  }, []);

  useEffect(() => {
    if (showFinalBrand) {
      const resetTimer = setTimeout(() => {
        setShowFinalBrand(false);
        setPhraseIndex(0);
        setFadeState('in');
      }, 4200);
      return () => clearTimeout(resetTimer);
    }

    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, 3000);

    const nextPhraseTimer = setTimeout(() => {
      if (phraseIndex < 2) {
        setPhraseIndex((prev) => prev + 1);
        setFadeState('in');
      } else {
        setShowFinalBrand(true);
      }
    }, 3800);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextPhraseTimer);
    };
  }, [phraseIndex, showFinalBrand]);

  return (
    <div className="w-full bg-black text-white">

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover filter grayscale contrast-125 opacity-30 scale-105">
            <source src="/praia.mp4" type="video/mp4" />
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>

        <div className="relative z-10 max-w-5xl px-4 md:px-6 text-center">
          {!showFinalBrand ? (
            <div className="min-h-[160px] flex items-center justify-center">
              {phraseIndex === 0 && (
                <p className={`font-serif text-[1.15rem] leading-relaxed md:text-4xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transition-opacity duration-1000 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
                  FORÇA EM MOVIMENTO.
                </p>
              )}
              {phraseIndex === 1 && (
                <p className={`font-serif text-[1.15rem] leading-loose md:text-4xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transition-opacity duration-1000 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
                  <span>A BRISA DO MAR.</span><br />
                  <span className="inline-block mt-3 md:mt-2 whitespace-nowrap">A DISCIPLINA DO ESPORTE.</span>
                </p>
              )}
              {phraseIndex === 2 && (
                <p className={`font-serif text-[1.15rem] leading-loose md:text-4xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transition-opacity duration-1000 px-2 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
                  ENTRE A LEVEZA DA AREIA E A ESTRUTURA DO CONCRETO.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
              <div className="relative w-14 h-14 md:w-16 md:h-16 filter brightness-0 invert">
                <Image src={HELMET_LOGO_URL} alt="LaRomme Capacete" fill className="object-contain" />
              </div>
              <div className="relative w-48 h-10 md:w-56 md:h-12 filter brightness-0 invert">
                <Image src={WORDMARK_LOGO_URL} alt="LaRomme" fill className="object-contain" />
              </div>
              <p className="text-[9px] md:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase pt-2">
                ARQUITETURA DE VESTUÁRIO • FORTALEZA, BRASIL
              </p>
              <div className="pt-8">
                <a href="#origo" className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-zinc-200 transition-all shadow-xl font-sans">
                  EXPLORAR ORIGO.
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BLOCO 01: VITRINE COMERCIAL MIXTA */}
      <section id="origo" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12 md:space-y-20">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-2 md:mb-4">CAPÍTULO 01</span>
              <h2 className="font-serif text-2xl md:text-5xl tracking-[0.2em] text-white uppercase">SISTEMA ORIGO / 01.</h2>
            </div>
            <p className="text-[11px] md:text-xs text-zinc-400 max-w-md leading-relaxed tracking-wider font-light font-sans mt-2 md:mt-0">
              Seis artefatos essenciais que unem a estrutura do Lifestyle com a tecnologia visual da Performance.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {productsList.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 100}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}