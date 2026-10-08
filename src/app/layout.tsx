import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LaRomme • Maison de Haute Couture',
    template: '%s • LaRomme',
  },
  description: 'Moda autoral e elegância atemporal.',
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'LaRomme • Maison de Haute Couture',
    description: 'Moda autoral e elegância atemporal.',
    url: siteUrl,
    siteName: 'LaRomme',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/apple-icon.png',
        width: 1200,
        height: 630,
        alt: 'LaRomme Maison de Haute Couture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaRomme • Maison de Haute Couture',
    description: 'Moda autoral e elegância atemporal.',
    images: ['/apple-icon.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth bg-[#080808] text-white">
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
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}