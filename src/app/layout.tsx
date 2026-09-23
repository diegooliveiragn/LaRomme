import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import '@/styles/globals.css';

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://la-romme.vercel.app'),
  title: {
    default: `${siteConfig.name} —${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['LaRomme', 'Origo', 'Luxury Streetwear', 'Fortaleza', 'Brutalism', 'Roman Discipline'],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: 'https://la-romme.vercel.app',
    siteName: siteConfig.name,
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark bg-brand-black text-brand-offwhite antialiased">
      <body className="min-h-screen flex flex-col font-sans selection:bg-brand-red selection:text-white">
        <SmoothScroll>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}