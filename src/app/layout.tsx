import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SensoryWrapper } from '@/components/ui/SensoryWrapper';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'LaRomme | Lote Zero',
  description: 'A origem do vestuário de alta densidade.',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-black text-brand-offwhite overscroll-none select-none">
      <body className="antialiased min-h-screen flex flex-col bg-black text-brand-offwhite overscroll-none">
        <CartProvider>
          <SensoryWrapper>
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </SensoryWrapper>
        </CartProvider>
      </body>
    </html>
  );
}