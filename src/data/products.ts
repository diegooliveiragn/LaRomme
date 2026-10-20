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
    tag: "ALGODÃO NOBRE / TOQUE FRIO",
    price: "R$ 229,90",
    description: "Algodão penteado de fiação nobre com toque fresco, alta respirabilidade e estrutura Boxy alinhada ao clima do litoral. Ombros deslocados, gola em ribana de alta densidade e etiqueta externa emborrachada. Projetado para a transição entre a arena e o estado de repouso.",
    fabric: "100% Algodão Penteado de Fiação Nobre. Toque fresco/gelado, alta respirabilidade e caimento estruturado sem abafar.",
    fit: "Corte Boxy. Ombros deslocados (drop shoulder) e gola estruturada em ribana de alta gramatura.",
    care: "Lavar à mão ou ciclo delicado em água fria. Secar à sombra. Não passar ferro sobre as impressões e etiquetas.",
    colors: [
      {
        name: "BORDÔ",
        hex: "#581820",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/boxy_vinho_escuro_-_frente-removebg-preview.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/boxy_vinho_escuro-removebg-preview.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/boxy_vinho_escuro_-_frente-removebg-preview.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/boxy_vinho_escuro-removebg-preview.png"
    ]
  },
  {
    id: "tenax",
    name: "TENAX.",
    category: "PERFORMANCE / T-SHIRT",
    tag: "SECAGEM RÁPIDA & REFLETIVOS",
    price: "R$ 189,90",
    description: "Camiseta de alta performance em blend de poliamida e elastano com toque gelado. Tecnologia de dispersão térmica de secagem ultrarrápida, capacete no peito tom sobre tom e detalhes em transfer refletivo para treinos noturnos.",
    fabric: "Blend de poliamida com elastano. Toque gelado, proteção UV e dispersão contínua de suor.",
    fit: "Anatômica e aerodinâmica, acompanhando a linha do corpo sem compressão excessiva.",
    care: "Lavar com água fria e sabão neutro. Não usar amaciante para preservar a tecnologia do tecido.",
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/camisa_preta_-_costas-removebg-preview.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/camisa_preta-removebg-preview.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/camisa_preta_-_costas-removebg-preview.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/camisa_preta-removebg-preview.png"
    ]
  },
  {
    id: "libertas",
    name: "LIBERTAS.",
    category: "PERFORMANCE / REGATA",
    tag: "MOBILIDADE ABSOLUTA",
    price: "R$ 149,90",
    description: "Regata esportiva em malha microperfurada com cavas profundas que eliminam o atrito na rotação dos braços nos esportes de areia. Tecido de secagem instantânea, coordenadas geográficas na nuca e transfer refletivo.",
    fabric: "Malha microperfurada ultraleve de alta respirabilidade e proteção UV.",
    fit: "Cavas laterais expandidas para liberdade total de movimento nos ombros e braços.",
    care: "Lavar à mão ou ciclo suave. Secagem rápida em ambiente arejado.",
    colors: [
      {
        name: "PRETA",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/regata_preta_libertas_-_costas-removebg-preview.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/regata_preta_libertas-removebg-preview.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/regata_preta_libertas_-_costas-removebg-preview.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/regata_preta_libertas-removebg-preview.png"
    ]
  },
  {
    id: "umbra",
    name: "UMBRA.",
    category: "PERFORMANCE / 5-PANEL",
    tag: "TÁTICO & RESPIRÁVEL",
    price: "R$ 169,90",
    description: "Boné 5-Panel ultraleve e respirável. Construído em poliamida sintética ripstop com painéis laterais perfurados a laser, fecho funcional de engate rápido e detalhe em etiqueta laranja.",
    fabric: "Poliamida ripstop ultraleve. Não retém calor e seca em minutos.",
    fit: "Copa rasa e modelagem flexível que se molda perfeitamente à cabeça.",
    care: "Permite lavagem leve pós-treino em água fria. Secagem instantânea à sombra.",
    isOneSize: true,
    colors: [
      {
        name: "PRETO",
        hex: "#0A0A0A",
        images: [
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone_preto_5_panel_-_frente-removebg-preview.png",
          "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone_preto_5_panel-removebg-preview.png"
        ]
      }
    ],
    defaultImages: [
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone_preto_5_panel_-_frente-removebg-preview.png",
      "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Drop%201/bone_preto_5_panel-removebg-preview.png"
    ]
  }
];

export const PRODUCTS_ORIGO = PRODUCTS;