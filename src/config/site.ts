export const siteConfig = {
  name: "LaRomme",
  tagline: "A SUA CASA. A SUA FORÇA.",
  description: "Moda, esporte e lifestyle contemporâneo. A fusão entre disciplina romana e a energia das praias.",
  coordinates: "3°43'16\" S 38°32'41\" W",
  slogans: {
    hero: "A SUA CASA. A SUA FORÇA.",
    manifesto: "DISCIPLINA TAMBÉM É LIBERDADE.",
    essence: "O ambiente muda. A essência permanece.",
    positioning: "MENOS PRODUTO. MAIS PERTENCIMENTO.",
    pillars: "ESTILO • PERFORMANCE • PERTENCIMENTO",
  },
  social: {
    instagram: "https://instagram.com/laromme",
    tiktok: "",
  },
  contact: {
    email: "contato@laromme.com.br",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  },
};
