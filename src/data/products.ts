export interface ColorOption {
  name: string;
  hex: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: string;
  description: string;
  fabric: string;
  fit: string;
  care: string;
  colors: ColorOption[];
  defaultImages: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "vestigium",
    name: "VESTIGIUM.",
    category: "STRUCTURE / ALGODÃO BOXY",
    tag: "ALGODÃO ENCORPADO",
    price: "R$ 320,00",
    description: "Algodão encorpado de alta gramatura com modelagem Boxy arquitetônica e caimento pesado de ombros.",
    fabric: "100% Algodão encorpado de alta gramatura com estrutura rígida e preservação de formato.",
    fit: "Modelagem Boxy contemporânea, ombros deslocados (drop shoulder) e gola estruturada em ribana espessa.",
    care: "Lavar à mão ou em ciclo delicado com água fria. Não utilizar secadora. Secar à sombra.",
    colors: [
      {
        name: "OFF-WHITE",
        hex: "#F5F5F0",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Boxy%20Frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Boxy%20Costas.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Boxy%20Frente.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Boxy%20Costas.png"
    ]
  },
  {
    id: "forza",
    name: "FORZA.",
    category: "PERFORMANCE / CAMISETA TÉCNICA",
    tag: "TROCA TÉRMICA",
    price: "R$ 290,00",
    description: "Malha de alta performance respirável com secagem rápida, desenvolvida para transições sob o sol e movimento urbano.",
    fabric: "Tecido técnico leve de poliéster com poliamida, toque frio e tecnologia de dispersão de suor.",
    fit: "Corte atlético anatômico, sem compressão, permitindo liberdade total de braços e torso.",
    care: "Lavar com sabão neutro em água fria. Evitar amaciante para preservar a respirabilidade do tecido.",
    colors: [
      {
        name: "CINZA",
        hex: "#808080",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Forza%20Frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Forza%20Costas.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Forza%20Frente.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Forza%20Costas.png"
    ]
  },
  {
    id: "libertas",
    name: "LIBERTAS.",
    category: "FREEDOM / REGATA PERFORMANCE",
    tag: "AMPLITUDE DE MOVIMENTO",
    price: "R$ 250,00",
    description: "Cavas amplas e corte aerado projetados para mobilidade nos esportes de areia e no cotidiano tropical.",
    fabric: "Malha técnica ultraleve de alta respirabilidade e toque suave na pele.",
    fit: "Cavas profundas nas laterais e costas, impedindo fricção durante a movimentação dos braços.",
    care: "Lavar à mão ou ciclo suave. Secagem ultra-rápida à sombra.",
    colors: [
      {
        name: "BORDÔ",
        hex: "#581820",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Bordo%20-%20Frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Bordo%20-%20Costas.png"
        ]
      },
      {
        name: "BRANCA",
        hex: "#FFFFFF",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Branca%20-%20Frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Branca%20-%20Costas.png"
        ]
      },
      {
        name: "PRETA",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Costas.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20frente.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Regata%20Costas.png"
    ]
  },
  {
    id: "signum-noctis",
    name: "SIGNUM / NOCTIS.",
    category: "IDENTITY / BONÉ SÍMBOLO",
    tag: "ESTRUTURA RÍGIDA",
    price: "R$ 190,00",
    description: "Boné preto de copa firme com aplicação frontal do Capacete em bordado e fecho ajustável de alta precisão.",
    fabric: "Sarja nobre de algodão estruturado com resistência à radiação solar.",
    fit: "Perfil de copa média com curva anatômica de aba para sombra cirúrgica.",
    care: "Limpar com pano úmido e sabão neutro. Não imergir completamente em água.",
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Preto%20-%20Frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Lateral%20-%20Preto.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Preto%20-%20Costas.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Preto%20-%20Frente.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Lateral%20-%20Preto.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Preto%20-%20Costas.png"
    ]
  },
  {
    id: "signum-albus",
    name: "SIGNUM / ALBUS.",
    category: "IDENTITY / BONÉ WORDMARK",
    tag: "LUZ & PERTENCIMENTO",
    price: "R$ 190,00",
    description: "Boné Off-White que reflete a radiação solar, com a assinatura LaRomme. bordada no painel frontal.",
    fabric: "Sarja nobre de algodão em tonalidade Off-White nobre.",
    fit: "Copa estruturada com aba anatômica ajustável.",
    care: "Limpar localmente com pano limpo e úmido.",
    colors: [
      {
        name: "OFF-WHITE",
        hex: "#F5F5F0",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Frente%20-%20Branco.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Lateral%20-%20Branco.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Costas%20-%20Branco.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Frente%20-%20Branco.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Lateral%20-%20Branco.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/Bone%20Costas%20-%20Branco.png"
    ]
  }
];

// COMPATIBILIDADE COM O SITEMAP
export const PRODUCTS_ORIGO = PRODUCTS;