import Link from 'next/link';
import { Hero } from '@/components/editorial/Hero';
import { ManifestoSection } from '@/components/editorial/ManifestoSection';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS_ORIGO } from '@/data/products';

export default function HomePage() {
  const featuredProducts = PRODUCTS_ORIGO.filter((p) => p.featured);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero />

      {/* Seção Coleção Origo Highlight */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-300 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
              Capítulo 01
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-brand-black">
              Drop 01 — Origo
            </h2>
          </div>
          <Link
            href="/colecao/origo"
            className="text-xs font-bold uppercase tracking-editorial text-brand-black hover:text-brand-red transition-colors"
          >
            Ver Coleção Completa →
          </Link>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Seção Manifesto */}
      <ManifestoSection />

      {/* Seção CTA do Drop Completo */}
      <section className="py-24 bg-brand-offwhite text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-editorial text-brand-red block">
            Exclusividade & Atitude
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-brand-black">
            Pronto Para Entrar Na Arena?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wider leading-relaxed">
            Conheça todos os produtos da coleção ORIGO. Desenvolvidos com caimento premium, tecidos de alta tecnologia e a identidade da LaRomme.
          </p>
          <div>
            <Link
              href="/colecao/origo"
              className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-editorial px-10 py-5 hover:bg-brand-red transition-all"
            >
              Acessar Catálogo Origo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
