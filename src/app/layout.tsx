import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SensoryWrapper } from '@/components/ui/SensoryWrapper';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'LaRomme | Lote Zero',
  description: 'A origem do vestuário de alta densidade.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-brand-black text-brand-offwhite">
      <body className="antialiased min-h-screen flex flex-col selection:bg-brand-red selection:text-white">
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