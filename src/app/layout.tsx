import type { Metadata } from 'next';
import { Cinzel, Archivo, Space_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const cinzel = Cinzel({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif'
});

const archivo = Archivo({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'LaRomme. | Arquitetura de Vestuário',
  description: 'Entre a leveza da areia e a estrutura do concreto. Fortaleza, Brasil.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${archivo.variable} ${spaceMono.variable} bg-black text-white antialiased selection:bg-white selection:text-black overscroll-none`}>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-black text-white min-h-screen flex flex-col font-sans">
        <CartProvider>
          <SmoothScroll>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}