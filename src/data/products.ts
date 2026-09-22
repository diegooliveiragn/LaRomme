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
    shortDescription: 'Algodão premium de alta gramatura com modelagem Oversized/Boxy. Arte autoral conectando a herança clássica às coordenadas de Fortaleza.',
    fullStory: 'A camisa VESTIGIUM representa o vestígio do que permanece incólume ao tempo. Construída em algodão encorpado de alta gramatura, une a monumentalidade romana ao corte contemporâneo boxy, projetado para durabilidade e caimento impecável na arena urbana.',
    fitDetails: 'Modelagem Oversized/Boxy de caimento estruturado e ombros deslocados.',
    available: true,
    variants: [],
    materials: [
      'Algodão premium de estrutura e conforto elevado',
      'Toque macio com pré-encolhimento de fábrica',
      'Estampa autoral de alta definição e durabilidade'
    ],
    features: [
      'Algodão premium (estrutura e conforto)',
      'Modelagem oversized/boxy',
      'Gola estruturada',
      'Estampa de alta definição e durabilidade',
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
    images: [
      { src: '/assets/products/vestigium/vestigium-techpack.jpg', alt: 'Camiseta VESTIGIUM' }
    ],
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
    shortDescription: 'Desenvolvida para alta mobilidade e intensidade. Tecido leve com secagem rápida, proteção UV e detalhes refletivos.',
    fullStory: 'A linha FORZA foi desenvolvida sob o sol e o vento de Fortaleza. Utiliza tecidos de alta respirabilidade tecnológica, com secagem ultrarrápida (Dry) e proteção UV, garantindo resistência no esporte e presença na rua.',
    fitDetails: 'Modelagem relaxed de caimento premium anatômico com foco na liberdade corporal.',
    available: true,
    variants: [],
    materials: [
      'Tecido leve e altamente respirável',
      'Tratamento tecnológico de secagem rápida (Dry)',
      'Proteção solar UV integrada'
    ],
    features: [
      'Tecido leve e respirável',
      'Secagem rápida',
      'Proteção UV',
      'Modelagem relaxed com caimento premium',
      'Detalhes refletivos de segurança',
      'Etiqueta externa exclusiva'
    ],
    careInstructions: [
      'Lavar na máquina em ciclo esportivo/delicado',
      'Não usar amaciante nem alvejante',
      'Secagem rápida ao ar livre',
      'Não passar a ferro sobre as estampas e detalhes refletivos'
    ],
    availableColors: [
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off White', hex: '#F2F1ED', slug: 'offwhite' },
      { name: 'Bordô', hex: '#8B1E1E', slug: 'bordo' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: [
      { src: '/assets/products/forza/forza-techpack.jpg', alt: 'Camiseta FORZA' }
    ],
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
    shortDescription: 'Cava estratégica projetada para amplitude total de movimento. A fusão exata entre lifestyle de praia e esporte de arena.',
    fullStory: 'LIBERTAS representa a desconstrução das barreiras corporais. Projetada com cavas profundas sem fricção, oferece ventilação contínua e leveza absoluta nos treinos mais intensos.',
    fitDetails: 'Cava profunda e modelagem solta para mobilidade irrestrita.',
    available: true,
    variants: [],
    materials: [
      'Tecido técnico ultraleve e respirável',
      'Absorção e evaporação rápida de suor'
    ],
    features: [
      'Cava anatômica sem fricção',
      'Toque gelado e respirabilidade máxima',
      'Detalhes refletivos nas costas e ombros',
      'Costuras reforçadas para alta intensidade'
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
    images: [
      { src: '/assets/products/libertas/libertas-bordo.jpg', alt: 'Regata LIBERTAS Bordô' },
      { src: '/assets/products/libertas/libertas-black.jpg', alt: 'Regata LIBERTAS Preto' },
      { src: '/assets/products/libertas/libertas-white.jpg', alt: 'Regata LIBERTAS Off White' }
    ],
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
    shortDescription: 'Boné estruturado de abas curvas com bordado em alto relevo e fecho ajustável personalizado em metal.',
    fullStory: 'O boné SIGNUM é a assinatura tátil da marca. Moldado em sarja encorpada com bordados de alta definição e fivela metálica customizada, ele sintetiza o código de identificação LaRomme.',
    fitDetails: 'Tamanho único ajustável com fecho em fivela metálica.',
    available: true,
    variants: [],
    materials: [
      '100% Sarja de Algodão Encorpada',
      'Bordado frontal e lateral de alta precisão'
    ],
    features: [
      'Fecho traseiro em metal com fivela personalizada LaRomme',
      'Fita interna com código de origem',
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
    availableSizes: ['P'],
    images: [
      { src: '/assets/products/signum/signum-black.jpg', alt: 'Boné SIGNUM Preto' },
      { src: '/assets/products/signum/signum-white.jpg', alt: 'Boné SIGNUM Off White' }
    ],
    featured: false,
  }
];

export const PRODUCTS_ORIGO = products;