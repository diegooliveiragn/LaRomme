import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/carrinho'],
    },
    sitemap: 'https://laromme.com.br/sitemap.xml',
  };
}
