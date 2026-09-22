import { Hero } from '@/components/editorial/Hero';
import { ManifestoSection } from '@/components/editorial/ManifestoSection';
import { CollectionHighlight } from '@/components/editorial/CollectionHighlight';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-brand-black overflow-hidden">
      {/* 1. Hero Cinematográfico */}
      <Hero />

      {/* 2. Destaques da Coleção (Assimetria & Scroll Reveal) */}
      <CollectionHighlight />

      {/* 3. Manifesto (Respiro visual / Marca) */}
      <ManifestoSection />

      {/* 4. Fechamento Comercial Forte */}
      <section className="py-32 bg-brand-offwhite text-center border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-editorial text-brand-red block">
            O Ponto de Encontro
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold uppercase text-brand-black leading-tight">
            Descubra O Drop Completo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wider leading-relaxed">
            Menos produto, mais pertencimento. Conheça as peças desenvolvidas para o primeiro capítulo da LaRomme.
          </p>
          <div className="pt-8">
            <Link
              href="/colecao/origo"
              className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-editorial px-12 py-5 hover:bg-brand-red transition-all duration-300 shadow-xl hover:shadow-brand-red/20"
            >
              Acessar Catálogo Oficial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}