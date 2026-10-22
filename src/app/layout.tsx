import type { Metadata } from 'next';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LaRomme • Arquitetura de Vestuário',
    template: '%s • LaRomme',
  },
  description: 'Entre a prática esportiva e o cotidiano. Estilo, Performance e Pertencimento em Fortaleza, Brasil.',
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'LaRomme • Arquitetura de Vestuário',
    description: 'A força de Roma. O movimento de Fortaleza.',
    url: siteUrl,
    siteName: 'LaRomme',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/apple-icon.png',
        width: 1200,
        height: 630,
        alt: 'LaRomme',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaRomme • Arquitetura de Vestuário',
    description: 'A força de Roma. O movimento de Fortaleza.',
    images: ['/apple-icon.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-[#080808] text-white">
      <head>
        {/* GOOGLE ANALYTICS (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NGQME5BB8G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NGQME5BB8G', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col justify-between selection:bg-white selection:text-black antialiased">
        <SmoothScroll>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
