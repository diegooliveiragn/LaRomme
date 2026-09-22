export type ColorWay = {
  name: string;
  hex: string;
  slug: string;
};

export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG' | 'UNICO';

export type ProductVariant = {
  id: string;
  sku: string;
  color: ColorWay;
  size: Size;
  price: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: 'origo';
  category: 'lifestyle' | 'performance';
  subtitle: string;
  concept: string;
  shortDescription: string;
  fullStory: string;
  price: number;
  compareAtPrice?: number;
  images: {
    src: string;
    alt: string;
    isHover?: boolean;
  }[];
  availableColors: ColorWay[];
  availableSizes: Size[];
  variants: ProductVariant[];
  features: string[];
  materials: string[];
  fitDetails: string;
  careInstructions: string[];
  featured: boolean;
  available: boolean;
};
