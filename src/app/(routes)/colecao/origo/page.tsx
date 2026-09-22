import { Metadata } from 'next';
import { PRODUCTS_ORIGO } from '@/data/products';
import { CollectionFilterGrid } from '@/components/product/CollectionFilterGrid';

export const metadata: Metadata = {
  title: 'Drop 01 — ORIGO | LaRomme',
  description: 'O primeiro capítulo da LaRomme. Disciplina, permanência da pedra e o movimento do mar.',
};

export default function OrigoCollectionPage() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header do Capítulo */}
      <div className="bg-brand-black text-brand-offwhite p-8 sm:p-12 border border-zinc-800 space-y-4">
        <span className="text-xs uppercase tracking-editorial font-bold text-brand-red block">
          Capítulo 01 — Lançamento Oficial
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight">
          ORIGO
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl uppercase tracking-wider leading-relaxed">
          Onde o que permanece encontra o movimento. ORIGO representa a origem e a evolução. Peças pensadas com foco em caimento, resistência e elegância para a praia e para o dia a dia.
        </p>
      </div>

      {/* Grade com Filtro */}
      <CollectionFilterGrid products={PRODUCTS_ORIGO} />
    </div>
  );
}
