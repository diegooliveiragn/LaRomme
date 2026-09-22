import type { Metadata } from 'next';
import { Libre_Baskerville, Montserrat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import '@/styles/globals.css';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['LaRomme', 'Moda Praia', 'Sport Performance', 'Beach Sports', 'Lifestyle', 'Drop Origo'],
  authors: [{ name: 'LaRomme' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://laromme.com.br',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${libreBaskerville.variable} ${montserrat.variable}`}>
      <body className="bg-brand-offwhite text-brand-black font-sans antialiased selection:bg-brand-red selection:text-white flex min-h-screen flex-col justify-between">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
