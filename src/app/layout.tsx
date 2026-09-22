import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

// 1. EDITORIAL / ROMA (Permanência, Cultura, Emoção)
const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

// 2. SYSTEM / FORTALEZA (Performance, Clareza, Movimento)
const sans = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

// 3. CODE / ARQUIVO (Precisão, Coordenadas, Assinatura)
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | LaRomme',
    default: 'LaRomme | Estilo, Performance e Pertencimento',
  },
  description: 'A interseção exata entre a força de Roma e a energia de Fortaleza.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="pt-BR" 
      className={`${serif.variable} ${sans.variable}${mono.variable} font-sans antialiased selection:bg-brand-red selection:text-white`}
    >
      <body className="bg-brand-black text-brand-offwhite flex flex-col min-h-screen">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}