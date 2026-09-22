import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Tipografia Editorial (Roma)
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Tipografia UI/Performance (Fortaleza)
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Tipografia Arquivo/Código
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Metadados Otimizados para WhatsApp, Google e Redes Sociais
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogans.hero}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Streetwear", "Performance", "Fortaleza", "Roma", "Moda Masculina", "Vestuário", "Lifestyle"],
  authors: [{ name: "LaRomme" }],
  creator: "LaRomme",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://la-romme.vercel.app", // Pode ser atualizado para o domínio final futuramente
    title: `${siteConfig.name} — Lote Zero`,
    description: siteConfig.slogans.manifesto,
    siteName: siteConfig.name,
    images: [
      {
        url: "/assets/brand/logo.jpg", // A imagem que aparecerá no link do WhatsApp
        width: 800,
        height: 800,
        alt: "LaRomme Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.slogans.hero}`,
    description: siteConfig.description,
    images: ["/assets/brand/logo.jpg"],
  },
  icons: {
    icon: "/assets/brand/logo.jpg",
    apple: "/assets/brand/logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111", // Cor da barra do navegador no celular (Preto Absoluto)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${manrope.variable} ${jetbrains.variable} scroll-smooth`}>
      <body className="bg-brand-black text-brand-offwhite antialiased min-h-screen flex flex-col selection:bg-brand-red selection:text-white">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}