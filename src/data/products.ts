import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'vestigium-01',
    name: 'VESTIGIUM',
    subtitle: 'Camisa Algodão Premium',
    slug: 'vestigium-camisa-algodao',
    price: 289.00,
    category: 'Lifestyle',
    collection: 'ORIGO',
    concept: 'O que permanece.',
    shortDescription: 'Algodão de alta gramatura com modelagem Boxy/Oversized. Arte autoral conectando a arquitetura romana às coordenadas de Fortaleza.',
    fitDetails: 'Modelagem Boxy de caimento estruturado e ombros deslocados.',
    materials: [
      '100% Algodão Premium de Alta Gramatura',
      'Toque macio e pré-encolhido',
      'Estampa autoral de alta durabilidade'
    ],
    features: [
      'Algodão encorpado com toque macio',
      'Modelagem Boxy desenvolvida sob medida',
      'Gola canelada de 3cm',
      'Estampa posterior artística'
    ],
    careInstructions: [
      'Lavar à mão ou em ciclo delicado na máquina com água fria',
      'Não utilizar alvejante',
      'Secar à sombra',
      'Passar do avesso em temperatura média'
    ],
    availableColors: [
      { name: 'Off-White', hex: '#F2F1ED', slug: 'offwhite' },
      { name: 'Preto', hex: '#111111', slug: 'preto' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: ['/assets/products/vestigium/offwhite-back.jpg'],
    isFeatured: true,
  },
  {
    id: 'forza-01',
    name: 'FORZA',
    subtitle: 'Camiseta Sport',
    slug: 'forza-camisa-performance',
    price: 249.00,
    category: 'Performance',
    collection: 'ORIGO',
    concept: 'Movimento, conforto e identidade.',
    shortDescription: 'Desenvolvida para alta mobilidade e intensidade. Tecido leve com secagem rápida, proteção UV e detalhes refletivos.',
    fitDetails: 'Modelagem relaxed de caimento premium anatômico com foco na liberdade corporal.',
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
    images: ['/assets/products/forza/forza-techpack.jpg'],
    isFeatured: true,
  },
  {
    id: 'libertas-01',
    name: 'LIBERTAS',
    subtitle: 'Regata Performance',
    slug: 'libertas-regata-performance',
    price: 199.00,
    category: 'Performance',
    collection: 'ORIGO',
    concept: 'Movimento sem restrição.',
    shortDescription: 'Cava estratégica projetada para amplitude total de movimento. A fusão exata entre lifestyle de praia e esporte de arena.',
    fitDetails: 'Cava profunda e modelagem solta para mobilidade irrestrita.',
    materials: [
      'Tecido técnico ultraleve',
      'Absorção e evaporação rápida de suor'
    ],
    features: [
      'Cava anatômica sem fricção',
      'Toque gelado e respirabilidade máxima',
      'Costuras reforçadas'
    ],
    careInstructions: [
      'Lavar com água fria',
      'Secar à sombra'
    ],
    availableColors: [
      { name: 'Bordô', hex: '#8B1E1E', slug: 'bordo' },
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off-White', hex: '#F2F1ED', slug: 'offwhite' }
    ],
    availableSizes: ['P', 'M', 'G', 'GG'],
    images: ['/assets/products/libertas/red-front.jpg'],
    isFeatured: true,
  },
  {
    id: 'signum-01',
    name: 'SIGNUM',
    subtitle: 'Acessório / Cap',
    slug: 'signum-bone',
    price: 159.00,
    category: 'Lifestyle',
    collection: 'ORIGO',
    concept: 'O código visual.',
    shortDescription: 'Boné estruturado de abas curvas com bordado em alto relevo e fecho ajustável personalizado.',
    fitDetails: 'Tamanho único ajustável.',
    materials: [
      '100% Sarja de Algodão Encorpada',
      'Bordado frontal e lateral de alta precisão'
    ],
    features: [
      'Fecho traseiro em metal com fivela personalizada',
      'Fita interna com código de origem LaRomme'
    ],
    careInstructions: [
      'Limpar com pano úmido',
      'Não lavar na máquina'
    ],
    availableColors: [
      { name: 'Preto', hex: '#111111', slug: 'preto' },
      { name: 'Off-White', hex: '#F2F1ED', slug: 'offwhite' }
    ],
    availableSizes: ['P'],
    images: ['/assets/products/signum/black-cap.jpg'],
    isFeatured: false,
  }
];