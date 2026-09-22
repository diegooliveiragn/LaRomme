import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-black text-brand-offwhite pt-24 pb-16 overflow-hidden">
      {/* Overlay com Textura e Gradiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-brand-black to-brand-black z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        <div className="inline-block border-y border-brand-red/40 py-2 px-6">
          <span className="text-xs uppercase tracking-editorial font-bold text-brand-red">
            Drop 01 — Origo
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-tight">
          {siteConfig.slogans.hero}
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400 uppercase tracking-widest leading-relaxed">
          Inspirada na força dos guerreiros de Roma e na energia das praias. Nasceu para ser a sua casa. Seu território. Sua identidade.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/colecao/origo"
            className="w-full sm:w-auto bg-brand-red text-white text-xs font-bold uppercase tracking-editorial px-8 py-4 hover:bg-red-700 transition-all shadow-lg"
          >
            Explorar O Drop 01
          </Link>
          <Link
            href="/sobre"
            className="w-full sm:w-auto border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-editorial px-8 py-4 hover:border-white hover:text-white transition-all"
          >
            Nossa História
          </Link>
        </div>

        <div className="pt-12 flex justify-center items-center gap-8 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
          <span>{siteConfig.slogans.pillars}</span>
        </div>
      </div>
    </section>
  );
}
