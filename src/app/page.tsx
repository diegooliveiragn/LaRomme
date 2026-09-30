'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

// ÍCONE DO CAPACETE EM SVG (ESTÉTIKA BRUTALISTA)
const HelmetIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2C7.03 2 3 6.03 3 11v5c0 1.1.9 2 2 2h2v-7H5c0-3.87 3.13-7 7-7s7 3.13 7 7h-2v7h2c1.1 0 2-.9 2-2v-5c0-4.97-4.03-9-9-9z" fill="currentColor" stroke="none" />
    <path d="M12 4a7 7 0 00-7 7v1h14v-1a7 7 0 00-7-7z" fill="currentColor" opacity="0.3" />
    <path d="M9 14h6v5H9z" fill="currentColor" />
  </svg>
);

const HERO_PHRASES = [
  "A ESTÉTICA DA ORDEM.",
  "NÃO SEGUIMOS TENDÊNCIAS. CONSTRUÍMOS MONUMENTOS.",
  "ARQUITETURA DE VESTUÁRIO DE ALTA GRAMATURA.",
  "LOTE ZERO."
];

export default function Home() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [showFinalHelmet, setShowFinalHelmet] = useState(false);

  useEffect(() => {
    if (showFinalHelmet) return;

    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, 2600);

    const nextPhraseTimer = setTimeout(() => {
      if (phraseIndex < HERO_PHRASES.length - 1) {
        setPhraseIndex((prev) => prev + 1);
        setFadeState('in');
      } else {
        setShowFinalHelmet(true);
      }
    }, 3400);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextPhraseTimer);
    };
  }, [phraseIndex, showFinalHelmet]);

  return (
    <div className={`relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col justify-between ${montserrat.className}`}>
      
      {/* VÍDEO DA PRAIA EM LOOPING NA ESCALA DE CINZA */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter grayscale contrast-125 opacity-35 scale-105"
        >
          <source src="/praia.mp4" type="video/mp4" />
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* HEADER / CABEÇALHO */}
      <header className="relative z-10 w-full px-8 py-6 flex justify-between items-center border-b border-white/10 backdrop-blur-xs">
        {/* LOGOTIPO COM CAPACETE EM BRANCO (CANTO SUPERIOR ESQUERDO) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-white group-hover:scale-105 transition-transform duration-300">
            <HelmetIcon className="w-7 h-7" />
          </div>
          <span className="font-serif tracking-[0.3em] text-xl font-bold uppercase text-white">
            LAROMME
          </span>
        </Link>

        {/* NAVEGAÇÃO SUPERIOR */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.25em] uppercase text-zinc-300">
          <Link href="/colecao/origo" className="hover:text-white transition-colors">LOTE ZERO</Link>
          <Link href="/sobre" className="hover:text-white transition-colors">MANIFESTO</Link>
          <Link href="/acesso" className="hover:text-white transition-colors">SENADO VIP</Link>
          <Link href="/cortex" className="hover:text-amber-400 text-zinc-400 transition-colors">CÓRTEX OS</Link>
        </nav>

        {/* CARRINHO */}
        <Link href="/carrinho" className="text-[11px] font-bold tracking-[0.25em] uppercase text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all">
          CARRINHO (0)
        </Link>
      </header>

      {/* ÁREA CENTRAL: ANIMAÇÃO DE FRASES FADE-IN / FADE-OUT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 my-auto">
        {!showFinalHelmet ? (
          <div className="max-w-3xl min-h-[120px] flex items-center justify-center">
            <p
              className={`text-lg md:text-2xl font-light tracking-[0.35em] uppercase leading-relaxed text-white transition-opacity duration-800 ${
                fadeState === 'in' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {HERO_PHRASES[phraseIndex]}
            </p>
          </div>
        ) : (
          /* ÚLTIMO ESTÁGIO: LOGO DO CAPACETE EM FADE-IN FINAL */
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
            <div className="p-4 bg-white/5 border border-white/20 rounded-full backdrop-blur-md shadow-2xl">
              <HelmetIcon className="w-16 h-16 text-white" />
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-[0.4em] text-white uppercase">
              LAROMME
            </h1>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase">
              ARQUITETURA DE VESTUÁRIO • FORTALEZA, BRASIL
            </p>
            <div className="pt-6">
              <Link
                href="/colecao/origo"
                className="inline-block bg-white text-black font-bold text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-zinc-200 transition-all shadow-lg"
              >
                ACESSAR LOTE ZERO
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* RODAPÉ: COORDENADAS GEOGRÁFICAS DE FORTALEZA - CE */}
      <footer className="relative z-10 w-full px-8 py-6 flex flex-col sm:flex-row justify-between items-center border-t border-white/10 text-[10px] font-mono tracking-[0.25em] text-zinc-400 gap-4">
        <div>
          <span>FORTALEZA - CE &nbsp;•&nbsp; 3° 43' 02" S &nbsp; 38° 32' 35" W</span>
        </div>
        <div>
          <span className="text-zinc-500">© 2026 LAROMME. TODOS OS DIREITOS RESERVADOS.</span>
        </div>
      </footer>

    </div>
  );
}