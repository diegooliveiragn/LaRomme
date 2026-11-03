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
  technicalSpecs?: {
    fabric?: string;
    fit?: string;
    care?: string;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "vestigium",
    name: "VESTIGIUM.",
    category: "ALFAIATARIA COTIDIANA",
    tag: "ALGODÃO ENCORPADO",
    price: "R$ 229,90",
    description: "Camiseta em algodão nobre com estrutura de caimento amplo e toque macio. Ombros sutilmente caídos, gola em ribana de alta densidade e tipografia sóbria nas costas. Desenhada para a transição natural entre a atividade e o descanso.",
    fabric: "100% Algodão nobre encorpado. Toque firme, acabamento suave e coloração em tom bordô estonado.",
    fit: "Caimento amplo e estruturado. Ombros deslocados e gola anatômica com ribana fechada.",
    care: "Lavar à mão ou em ciclo suave com água fria. Secar à sombra.",
    colors: [
      {
        name: "BORDÔ",
        hex: "#4A1D24",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-VESTIGIUM-FRENTE.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-VESTIGIUM-COSTAS.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA3.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-VESTIGIUM-FRENTE.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-VESTIGIUM-COSTAS.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA3.png"
    ],
    technicalSpecs: {
      fabric: "100% Algodão nobre encorpado com acabamento estonado.",
      fit: "Corte amplo com ombros caídos e gola fechada em ribana.",
      care: "Lavagem à mão ou ciclo suave em água fria. Secagem à sombra."
    }
  },
  {
    id: "tenax",
    name: "TENAX.",
    category: "PERFORMANCE AERODINÂMICA",
    tag: "TOQUE GELADO",
    price: "R$ 189,90",
    description: "Camiseta técnica desenvolvida em malha suave de poliamida com rápida dispersão térmica. Costura ergonômica nos ombros para mobilidade sem atrito, acabamento fosco e detalhes discretos com reflexo para baixa luminosidade.",
    fabric: "Poliamida com elastano. Sensação térmica fresca, proteção solar e evaporação acelerada.",
    fit: "Corte alinhado ao corpo, acompanhando o movimento sem compressão excessiva.",
    care: "Lavar com água fria e sabão suave. Evitar amaciantes para preservar as propriedades da fibra.",
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-TENAX-FRENTE.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-TENAX-COSTAS.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA1.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-TENAX-FRENTE.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-TENAX-COSTAS.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA1.png"
    ],
    technicalSpecs: {
      fabric: "Malha técnica de poliamida com elastano e dispersão térmica.",
      fit: "Silhueta anatômica com manga raglan ergonômica.",
      care: "Lavar em água fria. Secagem rápida em local arejado."
    }
  },
  {
    id: "libertas",
    name: "LIBERTAS.",
    category: "ALTA RESPIRABILIDADE",
    tag: "MALHA MICROPERFURADA",
    price: "R$ 149,90",
    description: "Regata em malha técnica microperfurada com cavas desenhadas para eliminar o atrito nos esportes dinâmicos de praia. Coordenadas da criação nas costas, secagem quase instantânea e leveza absoluta.",
    fabric: "Malha leve microperfurada com alta ventilação contínua e proteção solar.",
    fit: "Cavas profundas e laterais anatômicas para amplitude irrestrita de movimentos.",
    care: "Lavar à mão ou em ciclo rápido. Não necessita ferro.",
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-LIBERTAS-FRENTE.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-LIBERTAS-COSTAS.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA2.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-LIBERTAS-FRENTE.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-LIBERTAS-COSTAS.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-DETALHE-GOLA2.png"
    ],
    technicalSpecs: {
      fabric: "Malha de poliamida com microfuros para troca de ar constante.",
      fit: "Corte cavado sem costuras incômodas na rotação dos ombros.",
      care: "Lavagem simples em água corrente. Secagem ultra-rápida."
    }
  },
  {
    id: "umbra",
    name: "UMBRA.",
    category: "ACESSÓRIO ESTRUTURADO",
    tag: "RIPSTOP RESPIRÁVEL",
    price: "R$ 169,90",
    description: "Boné com modelagem 5-Panel construído em ripstop técnico leve e resistente. Painéis laterais com perfurações para circulação de ar, fecho funcional traseiro ajustável e acabamento minimalista.",
    fabric: "Poliamida ripstop leve, repelente à umidade e com secagem rápida.",
    fit: "Estrutura flexível de copa rasa que se molda confortavelmente à cabeça.",
    care: "Higienização manual com pano úmido ou lavagem leve à sombra.",
    isOneSize: true,
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-FRENTE.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-LATERAL.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-COSTAS.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-FRENTE.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-LATERAL.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/LAROMME-BONE-UMBRA-COSTAS.png"
    ],
    technicalSpecs: {
      fabric: "Ripstop sintético com perfurações técnicas a laser nas laterais.",
      fit: "Ajuste anatômico 5-Panel com fita funcional traseira.",
      care: "Limpeza manual com água e sabão neutro."
    }
  }
];

export const PRODUCTS_ORIGO = PRODUCTS;