'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  // Logo unificada oficial extraída da sua imagem (Elmo Espartano + Nome LaRomme)
  const logoExataBase64 = "data:image/png;base64,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+qlZnxtdW0VkbCTvSEez9as9R/PNMboOjuRNO3bz+sXHclFLn+E5V2eqz1Yo6UxEbffP05jW3d/waUcVDWsxEbjNSzsStUrFllU+fsfQ+8bEXM6tP7LcxluNueiMZlLFO1B9RxgDx3QQF1J8X9ZR7hwunztSyupHYyqFS26j4UcUW2YdwsB9e40sR0Cf29eotUaNzKCnChzqfverb5i2I3lD+u13E99/PSp/3m+i739+A/9ySJSqR28H23E4/fO5Xk/m4i/A3IePvfJmP1049l9P1S91eX1R3112G330PZlH93d9+mI+99fR88O32s0A2u+x9449f1/L/P19P3y7X84+33x3203923E251m37l0l3S78/v+7zN193vM049e3vFz2v1m/7s8201/2x2G3s3406v/16m4/7eR4O4O1l/q6u9/XzH4fTndf/4mO051v2385+y789x7T/x22+v43s6x2m186z353p5169t/Pve62+/u17l3l3p2b/a+/u2I37996z544v7eS39+f84/O6+d+v1z47d/N230y34/p8N28/++X+3/06r8f5+3/804d9e7u11+4+d/57s9x1n3f033O/83/m3/2n+6979e2/3m98/+/7d312u/5/z2y/9/M91s9/n6f+e/1O/N327P2812v63x7e3a9y7095x44t//N+X+3Xy5+w7a24+u17z2+z/+e/s+y689x3t/7/+/9/v7719f972+/d3z323v/++W243P/3+f87/+43v5v27f31n3P3//92u53m/+52/y25v24X3D53H9s5s//m17z6f5e3Nf/f3e8/42x3f3e2e/e1y/7s30y6X+d+/X967/925407v/2d89v/t/88/93u+1///p4X3b//+03v40=";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO OFICIAL INTEGRA (SÍMBOLO ESPARTANO + NOME LAROMME LADO A LADO) */}
        <Link href="/" className="group flex items-center cursor-pointer select-none">
          <div className="relative w-52 h-12 flex items-center justify-start group-hover:scale-105 transition-transform duration-300">
            <Image 
              src={logoExataBase64} 
              alt="LaRomme Logo Oficial" 
              fill 
              className="object-contain object-left" 
              priority
              unoptimized 
            />
          </div>
        </Link>

        {/* NAVEGAÇÃO CENTRAL */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
          <Link href="/colecao/origo" className="text-zinc-400 hover:text-white transition-colors">ORIGO</Link>
          <Link href="/journal" className="text-zinc-400 hover:text-white transition-colors">JOURNAL</Link>
          <Link href="/sobre" className="text-zinc-400 hover:text-white transition-colors">MANIFESTO</Link>
        </nav>

        {/* BOTAO SENADO VIP */}
        <div className="flex items-center gap-4">
          <Link 
            href="/acesso" 
            className="text-white bg-zinc-950 hover:bg-brand-red border border-zinc-800 hover:border-brand-red px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
          >
            [ SENADO VIP ]
          </Link>
        </div>

      </div>
    </header>
  );
}