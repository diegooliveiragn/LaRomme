'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import FadeIn from '@/components/FadeIn';

const HELMET_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png";
const WORDMARK_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/fcfc607a-ba81-4ff7-998e-2df1f0697b81-removebg-preview.png";

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [showFinalBrand, setShowFinalBrand] = useState(false);

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
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter grayscale contrast-125 opacity-30 scale-105"
          >
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
                  <span>A BRISA DO MAR.</span>
                  <br />
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
                <a
                  href="#origo"
                  className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-zinc-200 transition-all shadow-xl font-sans"
                >
                  EXPLORAR ORIGO.
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BLOCO 01: VITRINE COMERCIAL */}
      <section id="origo" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12 md:space-y-20">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-2 md:mb-4">CAPÍTULO 01</span>
              <h2 className="font-serif text-2xl md:text-5xl tracking-[0.2em] text-white uppercase">SISTEMA ORIGO / 01.</h2>
            </div>
            <p className="text-[11px] md:text-xs text-zinc-400 max-w-md leading-relaxed tracking-wider font-light font-sans mt-2 md:mt-0">
              Cinco peças desenvolvidas para transitar sem fricção entre a alta intensidade da areia e a arquitetura da cidade.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {PRODUCTS.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 100}>
              <div className="group bg-[#080808] border border-zinc-900 p-6 md:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all duration-500 h-full">
                <div className="space-y-6">
                  {/* Ajuste do aspect ratio para Mobile vs Desktop */}
                  <div className="relative aspect-square md:aspect-[3/4] w-full bg-zinc-950 overflow-hidden">
                    <Image 
                      src={product.defaultImages[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover grayscale md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300">
                      {product.category}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline gap-4">
                      <h3 className="font-serif text-lg md:text-xl tracking-wider text-white font-bold">{product.name}</h3>
                      <span className="text-[11px] md:text-xs font-mono text-zinc-300 font-bold whitespace-nowrap">{product.price}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 tracking-wider mt-3 line-clamp-2 font-sans leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-900 mt-8 space-y-6 font-sans">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">CORES:</span>
                    <div className="flex gap-2">
                      {product.colors.map((c, i) => (
                        <span key={i} className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: c.hex }} title={c.name} />
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/produto/${product.id}`}
                    className="block w-full text-center bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black font-bold text-[10px] md:text-[11px] tracking-[0.25em] uppercase py-4 border border-zinc-800 transition-all duration-300"
                  >
                    VER ARTEFATO.
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* BLOCO 02: A MARCA */}
      <section id="marca" className="py-24 md:py-32 bg-[#050505] border-y border-zinc-900 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          <FadeIn>
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">O MANIFESTO</span>
              <h2 className="font-serif text-2xl md:text-5xl tracking-[0.25em] text-white uppercase">A MARCA.</h2>
              <p className="text-[11px] md:text-xs font-mono tracking-[0.2em] text-zinc-400">A ESTÉTICA DA ORDEM.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-8 text-sm md:text-base leading-relaxed tracking-wider font-light text-zinc-300 font-sans">
            <FadeIn delay={150}>
              <div className="space-y-5 border-l border-zinc-800 pl-6">
                <h3 className="text-white text-sm md:text-base tracking-widest font-serif font-bold uppercase">FORTALEZA — O TERRITÓRIO</h3>
                <p>
                  Nascemos onde a terra encontra o mar. Fortaleza é a nossa origem — o calor da quadra, o vento constante, a luz que recorta a paisagem e o movimento que nunca cessa. A praia não é um refúgio de descanso; é uma arena de vida, disciplina e energia.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="space-y-5 border-l border-zinc-800 pl-6">
                <h3 className="text-white text-sm md:text-base tracking-widest font-serif font-bold uppercase">ROMA — O CÓDIGO</h3>
                <p>
                  Roma é o nosso código cultural. Não através de mitos ou fantasias, mas pela linguagem da arquitetura, da proporção e da permanência. Buscamos a força silenciosa do concreto e da pedra: a ordem que resiste ao tempo e a elegância que não precisa de explicação.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* BLOCO 03: O MOVIMENTO */}
      <section id="movimento" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12 md:space-y-20">
        <FadeIn>
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">LIFESTYLE & AREIA</span>
            <h2 className="font-serif text-2xl md:text-5xl tracking-[0.25em] text-white uppercase">O MOVIMENTO.</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 font-mono text-xs">
          <FadeIn delay={100}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-5 h-full">
              <span className="text-zinc-500 block">01 // AREIA & QUADRA</span>
              <h4 className="text-white font-bold text-sm md:text-base tracking-wider uppercase font-serif">DESEMPENHO SEM RESTRIÇÃO.</h4>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed font-sans">
                Modelagens desenvolvidas com cavas e proporções anatômicas para acompanhar a intensidade do esporte praiano.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={250}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-5 h-full">
              <span className="text-zinc-500 block">02 // CIDADE & ESTRUTURA</span>
              <h4 className="text-white font-bold text-sm md:text-base tracking-wider uppercase font-serif">TRANSIÇÃO FLUIDA.</h4>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed font-sans">
                Peças encorpadas com corte Boxy que transitam da praia para encontros urbanos sem perder a elegância.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="bg-[#080808] border border-zinc-900 p-8 md:p-10 space-y-5 h-full">
              <span className="text-zinc-500 block">03 // PERMANÊNCIA</span>
              <h4 className="text-white font-bold text-sm md:text-base tracking-wider uppercase font-serif">MATERIALIDADE NOBRE.</h4>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed font-sans">
                Seleção rigorosa de matérias-primas e acabamentos que preservam a estrutura da roupa ao longo do tempo.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}