import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

import { Header } from '@/components/layout/Header';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Tracking } from '@/components/layout/Tracking';

// Configuração Anti-Zoom para iOS (Mantém a escala cravada em 1x)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Configuração de SEO Premium (Open Graph para WhatsApp/Insta)
export const metadata: Metadata = {
  title: 'LaRomme | Lote Zero',
  description: 'Protocolo de alocação Origo. Acesso restrito.',
  metadataBase: new URL('https://la-romme.vercel.app'),
  openGraph: {
    title: 'LaRomme | Coleção Origo',
    description: 'Protocolo de alocação da primeira coleção oficial. Acesso restrito ao Lote Zero.',
    url: 'https://la-romme.vercel.app',
    siteName: 'LaRomme',
    images: [
      {
        url: '/logo-black.png', // Usando a logo preta com fundo transparente como banner de compartilhamento
        width: 1200,
        height: 630,
        alt: 'LaRomme Signature',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="bg-brand-black">
      <body className="antialiased min-h-screen flex flex-col text-brand-offwhite selection:bg-brand-red selection:text-white custom-scrollbar">
        <CartProvider>
          <Tracking />
          <Header />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}