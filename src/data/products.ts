import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'vestigium-01',
    name: 'VESTIGIUM',
    subtitle: 'Camiseta de Algodão',
    slug: 'vestigium-camisa-algodao',
    price: 289.00,
    category: 'lifestyle',
    collection: 'origo',
    concept: 'O que permanece. Arte, cultura e atitude.',
    shortDescription: 'Construção em algodão de toque encorpado com modelagem Boxy / Oversized. Arte autoral conectando a herança clássica às coordenadas de Fortaleza.',
    fullStory: 'A camisa VESTIGIUM representa o vestígio do que permanece incólume ao tempo. Projetada para unir a estrutura arquitetônica ao corte contemporâneo boxy, oferecendo caimento estruturado e ombros deslocados.',
    fitDetails: 'Modelagem Boxy / Oversized com caimento estruturado e ombros deslocados.',
    available: true,
    variants: [],
    materials: [
      'Algodão com caimento encorpado e toque macio',
      'Estrutura com pré-encolhimento de fábrica',
      'Estampa autoral de alta definição'
    ],
    features: [
      'Algodão encorpado',
      'Modelagem boxy / oversized',
      'Gola estruturada',
      'Estampa autoral',
      'Etiqueta externa frontal',
      'Acabamento premium'
    ],
    careInstructions: [
      'Lavar à mão ou em ciclo delicado na máquina com água fria',
      'Não utilizar alvejante',
      'Secar à sombra',
      'Passar do avesso em temperatura média'
    ],
    availableColors: [
      { name: 'Off White', hex: '#F2F1ED', slug: 'offwhite' },
      { name: 'Preto', hex: '#111111', slug: 'preto' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: [],
    featured: true,
  },
  {
    id: 'forza-01',
    name: 'FORZA',
    subtitle: 'Camiseta Sport',
    slug: 'forza-camisa-performance',
    price: 249.00,
    category: 'performance',
    collection: 'origo',
    concept: 'Movimento, conforto e identidade.',
    shortDescription: 'Desenvolvida para mobilidade corporal e atividade contínua. Tecido leve com foco em respirabilidade e detalhes refletivos.',
    fullStory: 'A linha FORZA foi concebida sob o clima de Fortaleza. Utiliza tecidos leves com caimento anatômico relaxado, garantindo liberdade de movimento no esporte e presença na rua.',
    fitDetails: 'Modelagem Relaxed Performance de caimento anatômico e foco em mobilidade corporal.',
    available: true,
    variants: [],
    materials: [
      'Tecido leve e respirável',
      'Fiação com foco em evaporação e conforto térmico',
      'Aplicação de detalhes refletivos'
    ],
    features: [
      'Tecido leve e altamente respirável',
      'Modelagem relaxed performance',
      'Caimento anatômico',
      'Detalhes refletivos de visibilidade',
      'Etiqueta externa exclusiva'
    ],
    careInstructions: [
      'Lavar na máquina em ciclo esportivo/delicado',
      'Não usar amaciante nem alvejante',
      'Secagem ao ar livre',
      'Não passar a ferro sobre estampas e detalhes refletivos'
    ],
    availableColors: [
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off White', hex: '#F2F1ED', slug: 'offwhite' },
      { name: 'Bordô', hex: '#8B1E1E', slug: 'bordo' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: [],
    featured: true,
  },
  {
    id: 'libertas-01',
    name: 'LIBERTAS',
    subtitle: 'Regata Performance',
    slug: 'libertas-regata-performance',
    price: 199.00,
    category: 'performance',
    collection: 'origo',
    concept: 'Movimento sem restrição.',
    shortDescription: 'Cava profunda projetada para amplitude total de movimento. A união entre a atmosfera litorânea e a prática esportiva.',
    fullStory: 'LIBERTAS representa a eliminação de barreiras corporais. Desenvolvida com cavas amplas sem fricção, proporciona ventilação contínua e leveza em treinos intensos.',
    fitDetails: 'Modelagem Loose Fit com cava profunda para mobilidade irrestrita.',
    available: true,
    variants: [],
    materials: [
      'Tecido técnico ultraleve',
      'Estrutura com foco em fluxo de ar e leveza'
    ],
    features: [
      'Cava anatômica profunda sem fricção',
      'Ventilação contínua e leveza',
      'Detalhes refletivos',
      'Costuras reforçadas'
    ],
    careInstructions: [
      'Lavar com água fria',
      'Secar à sombra'
    ],
    availableColors: [
      { name: 'Bordô', hex: '#8B1E1E', slug: 'bordo' },
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off White', hex: '#F2F1ED', slug: 'offwhite' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: [],
    featured: true,
  },
  {
    id: 'signum-01',
    name: 'SIGNUM',
    subtitle: 'Acessório / Cap',
    slug: 'signum-bone',
    price: 159.00,
    category: 'lifestyle',
    collection: 'origo',
    concept: 'O código visual.',
    shortDescription: 'Boné estruturado de abas curvas com bordado em relevo e fecho ajustável personalizado em metal.',
    fullStory: 'O boné SIGNUM é a assinatura tátil do ecossistema. Moldado em tecido encorpado com bordados de precisão e fivela metálica customizada, sintetiza o código LaRomme.',
    fitDetails: 'Tamanho único ajustável com fecho em fivela metálica.',
    available: true,
    variants: [],
    materials: [
      'Tecido encorpado de sarja',
      'Bordado frontal e lateral de alta definição'
    ],
    features: [
      'Fecho traseiro metálico personalizado',
      'Fita interna personalizada com código de origem',
      'Bordado em alto relevo'
    ],
    careInstructions: [
      'Limpar com pano úmido',
      'Não lavar na máquina'
    ],
    availableColors: [
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off White', hex: '#F2F1ED', slug: 'offwhite' }
    ],
    availableSizes: ['UNICO'],
    images: [],
    featured: false,
  }
];

export const PRODUCTS_ORIGO = products;