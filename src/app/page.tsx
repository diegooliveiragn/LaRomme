'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';

// FONTE EMOÇÃO (SERIF EDITORIAL)
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
});

// FONTE INTERFACE & DADOS (SANS FUNCTIONAL)
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

// LOGOS OFICIAIS SUPABASE
const HELMET_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png";
const WORDMARK_LOGO_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/fcfc607a-ba81-4ff7-998e-2df1f0697b81-removebg-preview.png";

// SEQUÊNCIA DE FRASES HERO (BRISA, ESPORTE & ESTRUTURA)
const HERO_PHRASES = [
  "FORÇA EM MOVIMENTO.",
  "A BRISA DO MAR. A DISCIPLINA DO ESPORTE.",
  "ENTRE A LEVEZA DA AREIA E A ESTRUTURA DO CONCRETO."
];

// OS 5 ARTEFATOS OFICIAIS DO DROP 01 / ORIGO
const ORIGO_PRODUCTS = [
  {
    id: "vestigium",
    name: "VESTIGIUM.",
    category: "STRUCTURE / ALGODÃO BOXY",
    price: "R$ 320,00",
    colors: [{ name: "OFF-WHITE", hex: "#F5F5F0" }],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000",
    description: "Algodão de alta gramatura com modelagem Boxy e caimento pesado."
  },
  {
    id: "forza",
    name: "FORZA.",
    category: "PERFORMANCE / CAMISETA TÉCNICA",
    price: "R$ 290,00",
    colors: [{ name: "CINZA", hex: "#808080" }],
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=1000",
    description: "Malha de alta respirabilidade e troca térmica rápida para uso sob o sol."
  },
  {
    id: "libertas",
    name: "LIBERTAS.",
    category: "FREEDOM / REGATA PERFORMANCE",
    price: "R$ 250,00",
    colors: [
      { name: "PRETO", hex: "#0A0A0A" },
      { name: "OFF-WHITE", hex: "#F5F5F0" },
      { name: "CINZA", hex: "#808080" }
    ],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000",
    description: "Cavas amplas desenhadas para mobilidade total nos esportes de areia."
  },
  {
    id: "signum-noctis",
    name: "SIGNUM / NOCTIS.",
    category: "IDENTITY / BONÉ SÍMBOLO",
    price: "R$ 190,00",
    colors: [{ name: "PRETO", hex: "#0A0A0A" }],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1000",
    description: "Boné de estrutura firme com aplicação frontal do Capacete em branco."
  },
  {
    id: "signum-albus",
    name: "SIGNUM / ALBUS.",
    category: "IDENTITY / BONÉ WORDMARK",
    price: "R$ 190,00",
    colors: [{ name: "OFF-WHITE", hex: "#F5F5F0" }],
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=1000",
    description: "Boné Off-White com aplicação frontal da marca LaRomme."
  }
];

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [showFinalBrand, setShowFinalBrand] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (showFinalBrand) return;

    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, 2800);

    const nextPhraseTimer = setTimeout(() => {
      if (phraseIndex < HERO_PHRASES.length - 1) {
        setPhraseIndex((prev) => prev + 1);
        setFadeState('in');
      } else {
        setShowFinalBrand(true);
      }
    }, 3600);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextPhraseTimer);
    };
  }, [phraseIndex, showFinalBrand]);

  return (
    <div className={`min-h-screen w-full bg-black text-white selection:bg-white selection:text-black overscroll-none scroll-smooth ${cormorant.variable} ${montserrat.variable} font-sans`}>
      
      {/* HEADER GLASSMORPHIC FIXO NO TOPO */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300">
        
        {/* LOGO + CAPACETE (CANTO ESQUERDO) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7 filter brightness-0 invert">
            <Image src={HELMET_LOGO_URL} alt="LaRomme Capacete" fill className="object-contain" priority />
          </div>
          <div className="relative w-28 h-6 filter brightness-0 invert">
            <Image src={WORDMARK_LOGO_URL} alt="LaRomme" fill className="object-contain" priority />
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP (5 TELAS PÚBLICAS) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.25em] uppercase text-zinc-300">
          <Link href="#origo" className="hover:text-white transition-colors">ORIGO / 01.</Link>
          <Link href="#marca" className="hover:text-white transition-colors">A MARCA.</Link>
          <Link href="#movimento" className="hover:text-white transition-colors">O MOVIMENTO.</Link>
          <Link href="#editorial" className="hover:text-white transition-colors">EDITORIAL.</Link>
          <Link href="#senado" className="hover:text-white transition-colors">SENADO VIP.</Link>
        </nav>

        {/* CARRINHO + HAMBÚRGUER MOBILE */}
        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all">
            CARRINHO (0).
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 focus:outline-none"
            aria-label="Abrir Menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>
      </header>

      {/* MENU MOBILE SLIDE-IN */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center px-10 space-y-6 text-sm tracking-[0.3em] uppercase font-medium border-b border-white/10 lg:hidden">
          <Link href="#origo" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-white">ORIGO / 01.</Link>
          <Link href="#marca" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">A MARCA.</Link>
          <Link href="#movimento" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">O MOVIMENTO.</Link>
          <Link href="#editorial" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">EDITORIAL.</Link>
          <Link href="#senado" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-zinc-800 text-zinc-300">SENADO VIP.</Link>
        </div>
      )}

      {/* HERO SECTION: VÍDEO DA PRAIA EM LOOPING P&B + ANIMAÇÃO DE FRASES */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* VÍDEO DE FUNDO TRATADO */}
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

        {/* FRASES EM FADE IN / FADE OUT */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          {!showFinalBrand ? (
            <div className="min-h-[140px] flex items-center justify-center">
              <p
                className={`font-serif text-2xl md:text-4xl font-light tracking-[0.25em] uppercase leading-relaxed text-white transition-opacity duration-1000 ${
                  fadeState === 'in' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {HERO_PHRASES[phraseIndex]}
              </p>
            </div>
          ) : (
            /* DESFECHO FINAL: CAPACETE + WORDMARK */
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
              <div className="relative w-16 h-16 filter brightness-0 invert">
                <Image src={HELMET_LOGO_URL} alt="LaRomme Capacete" fill className="object-contain" />
              </div>
              <div className="relative w-56 h-12 filter brightness-0 invert">
                <Image src={WORDMARK_LOGO_URL} alt="LaRomme" fill className="object-contain" />
              </div>
              <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase pt-2">
                ARQUITETURA DE VESTUÁRIO • FORTALEZA, BRASIL
              </p>
              <div className="pt-6">
                <a
                  href="#origo"
                  className="inline-block bg-white text-black font-bold text-[10px] md:text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-zinc-200 transition-all shadow-xl"
                >
                  EXPLORAR ORIGO.
                </a>
              </div>
            </div>
          )}
        </div>

        {/* INDICADOR DE SCROLL ARQUITETÔNICO */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase">ROLAR</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* BLOCO 01: VITRINE COMERCIAL DO DROP 01 / ORIGO */}
      <section id="origo" className="py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-2">CAPÍTULO 01</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.2em] text-white uppercase">SISTEMA ORIGO / 01.</h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md leading-relaxed tracking-wider font-light">
            Cinco peças desenvolvidas para transitar sem fricção entre a alta intensidade da areia e a arquitetura da cidade.
          </p>
        </div>

        {/* GRID DOS 5 ARTEFATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ORIGO_PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-[#080808] border border-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300">
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300">
                    {product.category}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl tracking-wider text-white font-bold">{product.name}</h3>
                    <span className="text-xs font-mono text-zinc-300 font-bold">{product.price}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 tracking-wider mt-2 line-clamp-2">{product.description}</p>
                </div>
              </div>

              {/* SELETOR DE CORES & AÇÃO */}
              <div className="pt-6 border-t border-zinc-900/80 mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">CORES:</span>
                  <div className="flex gap-1.5">
                    {product.colors.map((c, i) => (
                      <span key={i} className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </div>

                <Link
                  href={`/produto/${product.id}`}
                  className="block w-full text-center bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black font-bold text-[10px] tracking-[0.25em] uppercase py-3 border border-zinc-800 transition-all duration-300"
                >
                  VER ARTEFATO.
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCO 02: A MARCA (MANIFESTO & ORIGEM) */}
      <section id="marca" className="py-28 bg-[#050505] border-y border-zinc-900 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">O MANIFESTO</span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase">A MARCA.</h2>
            <p className="text-xs font-mono tracking-[0.2em] text-zinc-400">A ESTÉTICA DA ORDEM.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 text-sm leading-relaxed tracking-wider font-light text-zinc-300 font-serif">
            <div className="space-y-4 border-l border-zinc-800 pl-6">
              <h3 className="text-white text-base tracking-widest font-sans font-bold uppercase">FORTALEZA — O TERRITÓRIO</h3>
              <p>
                Nascemos onde a terra encontra o mar. Fortaleza é a nossa origem — o calor da quadra, o vento constante, a luz que recorta a paisagem e o movimento que nunca cessa. A praia não é um refúgio de descanso; é uma arena de vida, disciplina e energia.
              </p>
            </div>
            <div className="space-y-4 border-l border-zinc-800 pl-6">
              <h3 className="text-white text-base tracking-widest font-sans font-bold uppercase">ROMA — O CÓDIGO</h3>
              <p>
                Roma é o nosso código cultural. Não através de mitos ou fantasias, mas pela linguagem da arquitetura, da proporção e da permanência. Buscamos a força silenciosa do concreto e da pedra: a ordem que resiste ao tempo e a elegância que não precisa de explicação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO 03: O MOVIMENTO & EDITORIAL */}
      <section id="movimento" className="py-28 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">LIFESTYLE & AREIA</span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase">O MOVIMENTO.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4">
            <span className="text-zinc-500 block">01 // AREIA & QUADRA</span>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">DESEMPENHO SEM RESTRIÇÃO.</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Modelagens desenvolvidas com cavas e proporções anatômicas para acompanhar a intensidade do esporte praiano.
            </p>
          </div>
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4">
            <span className="text-zinc-500 block">02 // CIDADE & ESTRUTURA</span>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">TRANSIÇÃO FLUIDA.</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Peças encorpadas com corte Boxy que transitam da praia para encontros urbanos sem perder a elegância.
            </p>
          </div>
          <div className="bg-[#080808] border border-zinc-900 p-8 space-y-4">
            <span className="text-zinc-500 block">03 // PERMANÊNCIA</span>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">MATERIALIDADE NOBRE.</h4>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Seleção rigorosa de matérias-primas e acabamentos que preservam a estrutura da roupa ao longo do tempo.
            </p>
          </div>
        </div>
      </section>

      {/* RODAPÉ INSTITUCIONAL (COM COORDENADAS E CANAIS) */}
      <footer id="senado" className="border-t border-zinc-800 bg-[#030303] py-16 px-6 md:px-12 text-xs font-mono tracking-wider text-zinc-400 space-y-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-zinc-900">
          
          {/* ORIGEM */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">ORIGEM & TERRITÓRIO</span>
            <p className="text-zinc-500">FORTALEZA - CE • BRASIL</p>
            <p className="text-zinc-500">03°43'16"S &nbsp; 38°32'41"W</p>
          </div>

          {/* CANAIS OFICIAIS */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">CANAIS OFICIAIS</span>
            <p className="text-zinc-400">INSTAGRAM: <a href="https://instagram.com/uselaromme" target="_blank" rel="noreferrer" className="text-white hover:underline">@uselaromme</a></p>
            <p className="text-zinc-400">TIKTOK: <a href="https://tiktok.com/@laromme" target="_blank" rel="noreferrer" className="text-white hover:underline">@laromme</a></p>
            <p className="text-zinc-400">CONTATO: <a href="mailto:rommanuscompany@gmail.com" className="text-white hover:underline">rommanuscompany@gmail.com</a></p>
          </div>

          {/* NAVEGAÇÃO DE SUPORTE */}
          <div className="space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">SUPORTE & TERMOS</span>
            <div className="flex flex-col space-y-1.5 text-zinc-400">
              <Link href="/tamanho" className="hover:text-white">GUIA DE MEDIDAS.</Link>
              <Link href="/termos" className="hover:text-white">TERMOS DE USO.</Link>
              <Link href="/politica-de-privacidade" className="hover:text-white">PRIVACIDADE.</Link>
              <Link href="/faq" className="hover:text-white">PERGUNTAS FREQUENTES.</Link>
            </div>
          </div>

        </div>

        {/* BASE INSTITUCIONAL */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4">
          <span>© 2020–2026 LaRomme. TODOS OS DIREITOS RESERVADOS.</span>
          <span className="uppercase">FORÇA EM MOVIMENTO.</span>
        </div>
      </footer>

    </div>
  );
}