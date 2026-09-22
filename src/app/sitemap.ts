import { MetadataRoute } from 'next';
import { PRODUCTS_ORIGO } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://laromme.com.br';

  const productUrls = PRODUCTS_ORIGO.map((product) => ({
    url: `${baseUrl}/produto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    '',
    '/colecao/origo',
    '/sobre',
    '/journal',
    '/tamanho',
    '/faq',
    '/contato',
    '/carrinho',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticUrls, ...productUrls];
}
