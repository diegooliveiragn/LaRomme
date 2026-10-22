'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/data/products';
import FadeIn from '@/components/FadeIn';
import { ProductCard } from '@/components/product/ProductCard';
import { createClient } from '@supabase/supabase-js';

const HELMET_LOGO_URL = "/logo-branca.png";
const WORDMARK_LOGO_URL = "/laromme-wordmark.png";

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
                  ENTRE O ESPORTE E O COTIDIANO.
                </p>
              )}
              {phraseIndex === 1 && (
                <p className={`font-serif text-[1.15rem] leading-loose md:text-4xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transition-opacity duration-1000 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
                  <span>FORÇA COM ELEGÂNCIA.</span><br />
                  <span className="inline-block mt-3 md:mt-2 whitespace-nowrap">DISCIPLINA COM LIBERDADE.</span>
                </p>
              )}
              {phraseIndex === 2 && (
                <p className={`font-serif text-[1.15rem] leading-loose md:text-4xl font-normal tracking-[0.25em] md:tracking-[0.3em] uppercase text-white transition-opacity duration-1000 px-2 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
                  A CIDADE, A PRAIA E TUDO ENTRE ELAS.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
              <div className="relative w-14 h-14 md:w-16 md:h-16 filter brightness-0 invert">
                <Image src={HELMET_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
              </div>
              <div className="relative w-48 h-10 md:w-56 md:h-12 filter brightness-0 invert">
                <Image src={WORDMARK_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
              </div>
              <p className="text-[9px] md:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase pt-2">
                DESIGN, MOVIMENTO & ORIGEM • FORTALEZA, BRASIL
              </p>
              <div className="pt-8">
                <a href="#origo" className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-zinc-200 transition-all shadow-xl font-sans">
                  CONHECER A COLEÇÃO.
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BLOCO EDITORIAL: TERRITÓRIO, CLIMA & PROPÓSITO */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-6xl mx-auto border-t border-zinc-900 font-sans">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-5 space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">ORIGEM & TERRITÓRIO</span>
              <h2 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wider font-bold">
                FORTALEZA COMO PONTO DE PARTIDA.
              </h2>
            </div>
            <div className="md:col-span-7 space-y-4 text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
              <p>
                A LaRomme nasce do encontro entre a brisa constante do litoral, a intensidade da luz cearense e o movimento diário de quem pratica esportes e vive a cidade.
              </p>
              <p>
                O calor e a umidade exigem materiais com toque fresco, alta respirabilidade e caimento estruturado sem abafar. Peças feitas com intenção, equilíbrio e proporção — para transitar com facilidade do treino ao resto do dia.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* VITRINE COMERCIAL: DROP 01 / ORIGO */}
      <section id="origo" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-12 md:space-y-16 border-t border-zinc-900">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-2 md:mb-3">PRIMEIRO LANÇAMENTO</span>
              <h2 className="font-serif text-2xl md:text-4xl tracking-[0.2em] text-white uppercase font-bold">SISTEMA ORIGO.</h2>
            </div>
            <p className="text-[11px] md:text-xs text-zinc-400 max-w-md leading-relaxed tracking-wider font-light font-sans mt-2 md:mt-0">
              Quatro peças fundamentais desenvolvidas para aliar a presença do lifestyle à funcionalidade do esporte.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsList.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 100}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* BLOCO COMUNIDADE: SENADO VIP / ACESSO ANTECIPADO */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-4xl mx-auto border-t border-zinc-900 font-sans text-center">
        <FadeIn>
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block">ACESSO PRIORITÁRIO</span>
            <h2 className="font-serif text-2xl md:text-4xl text-white uppercase tracking-wider font-bold">SENADO VIP.</h2>
            <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
              Cadastre suas preferências e sua rotina esportiva. Quem faz parte do Senado recebe o link de compra 24 horas antes da abertura geral para garantir o tamanho ideal.
            </p>
            <div className="pt-4">
              <Link
                href="/senado-vip"
                className="inline-block bg-white text-black font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-zinc-200 transition-all shadow-xl"
              >
                SOLICITAR ACESSO ANTECIPADO →
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
