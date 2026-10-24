import type { Metadata } from 'next';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'LaRomme',
  description: 'Maison LaRomme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <SmoothScroll>
          <CartProvider>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}