import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';
const OG_IMAGE_URL = 'https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LaRomme • Entre o Esporte e o Cotidiano',
    template: '%s • LaRomme',
  },
  description: 'Design com intenção, proporção e presença. Vestuário essencial desenvolvido para a transição entre a prática esportiva e a cidade. Fortaleza, Brasil.',
  keywords: [
    'LaRomme',
    'Vestuário Esportivo',
    'Beach Tennis',
    'Lifestyle',
    'Fortaleza',
    'Silent Luxury',
    'Drop 01',
    'Sistema Origo',
  ],
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'LaRomme • Entre o Esporte e o Cotidiano',
    description: 'Design com intenção, proporção e presença. Vestuário essencial para a transição entre o esporte e a rotina urbana. Fortaleza, Brasil.',
    url: siteUrl,
    siteName: 'LaRomme',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'LaRomme • Fortaleza, Brasil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaRomme • Entre o Esporte e o Cotidiano',
    description: 'Design com intenção, proporção e presença. Vestuário essencial desenvolvido entre o esporte e a cidade. Fortaleza, Brasil.',
    images: [OG_IMAGE_URL],
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
