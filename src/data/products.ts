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
  isOneSize?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "vestigium",
    name: "VESTIGIUM.",
    category: "LIFESTYLE / ALGODÃO BOXY",
    tag: "ALGODÃO ENCORPADO",
    price: "R$ 229,90",
    description: "Algodão encorpado com modelagem quadrada e caimento pesado. Possui estampa minimalista nas costas e etiqueta emborrachada externa.",
    fabric: "100% Algodão Premium Heavyweight. Toque denso e estrutura rígida que não amassa com facilidade.",
    fit: "Corte Boxy. Ombros deslocados (drop shoulder) e gola estruturada em ribana grossa.",
    care: "Lavar à mão ou ciclo delicado. Secar à sombra. Não passar ferro sobre a etiqueta externa.",
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
    id: "signum",
    name: "SIGNUM.",
    category: "LIFESTYLE / DAD HAT",
    tag: "FIVELA DE METAL",
    price: "R$ 159,90",
    description: "Boné de sarja rígida com o símbolo Capacete em bordado alto relevo. Fecho traseiro com fita de tecido e fivela de metal escovado.",
    fabric: "Sarja premium 100% algodão, resistente ao desbotamento solar.",
    fit: "Desestruturado frontalmente para encaixe perfeito na cabeça (Dad Hat clássico).",
    care: "Limpar apenas localmente. Não colocar na máquina de lavar.",
    isOneSize: true,
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
    id: "titulus",
    name: "TITULUS.",
    category: "LIFESTYLE / DAD HAT",
    tag: "BORDADO & METAL",
    price: "R$ 159,90",
    description: "Boné Off-White iluminado. Assinatura LaRomme. centralizada. Ajuste por fita do mesmo tecido e fivela de metal antioxidante.",
    fabric: "Sarja premium de gramatura alta, tom Off-White exclusivo.",
    fit: "Curva da aba cirúrgica para bloqueio solar mantendo o campo de visão.",
    care: "Limpeza com pano úmido e sabão de coco. Secagem à sombra.",
    isOneSize: true,
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
  },
  {
    id: "forza",
    name: "FORZA.",
    category: "PERFORMANCE / T-SHIRT",
    tag: "SECAGEM RÁPIDA & REFLETIVOS",
    price: "R$ 189,90",
    description: "Camiseta técnica projetada para alta intensidade, com tecnologia de secagem rápida e detalhes refletivos para uso noturno.",
    fabric: "Blend de poliamida com elastano. Toque gelado e sistema de dispersão de suor.",
    fit: "Anatômica e aerodinâmica, acompanhando a linha do corpo sem compressão excessiva.",
    care: "Lavar com água fria e sabão neutro. Não usar amaciante para preservar a tecnologia do tecido.",
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
    category: "PERFORMANCE / REGATA",
    tag: "MOBILIDADE ABSOLUTA",
    price: "R$ 149,90",
    description: "Cavas profundas e tecido maleável de secagem ultrarrápida. Essencial para esportes de areia. Detalhes em transfer refletivo.",
    fabric: "Malha micro-perfurada de altíssima respirabilidade e proteção UV.",
    fit: "Cavas laterais expandidas para liberdade total de rotação dos braços.",
    care: "Lavar à mão. Secagem em menos de 30 minutos em ambiente arejado.",
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
    id: "umbra",
    name: "UMBRA.",
    category: "PERFORMANCE / 5-PANEL",
    tag: "TÁTICO & RESPIRÁVEL",
    price: "R$ 169,90",
    description: "Equipamento técnico. Boné 5-Panel construído com painéis respiráveis e fecho tático de engate rápido.",
    fabric: "Poliamida ultraleve. Não retém calor e seca em minutos.",
    fit: "Copa rasa e modelagem flexível que se molda completamente ao topo da cabeça.",
    care: "Permite lavagem leve pós-treino. Secagem instantânea.",
    isOneSize: true,
    colors: [
      {
        name: "BORDÔ",
        hex: "#581820",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20lado.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20costas.png"
        ]
      },
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20preto%20-%20frente.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20preto%20-%20lado.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20preto%20-%20costas.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20frente.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20lado.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone%205%20panel%20bordo%20-%20costas.png"
    ]
  }
];

export const PRODUCTS_ORIGO = PRODUCTS;