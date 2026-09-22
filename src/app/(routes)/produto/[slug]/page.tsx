import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import { Metadata } from 'next';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};

  return {
    title: `${product.name} — Drop 01 (ORIGO)`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | LaRomme`,
      description: product.shortDescription,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org JSON-LD para Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'LaRomme',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `https://la-romme.vercel.app/produto/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-brand-offwhite text-brand-black min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProductDetailsClient product={product} />
        </div>
      </div>
    </>
  );
}