import Link from 'next/link';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col justify-between h-full bg-white border border-zinc-200/80 p-4 transition-all duration-300 hover:border-brand-black hover:shadow-lg">
      <Link href={`/produto/${product.slug}`} className="block relative overflow-hidden aspect-[3/4] bg-zinc-100 mb-4">
        {/* Placeholder visual responsivo até upload de fotos reais */}
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-100 to-zinc-200 group-hover:scale-105 transition-transform duration-500">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red mb-2">
            {product.subtitle}
          </span>
          <span className="font-serif text-2xl font-bold uppercase tracking-wider text-brand-black">
            {product.name}
          </span>
          <span className="text-xs text-zinc-500 mt-2 italic font-serif">
            "{product.concept}"
          </span>
        </div>

        {/* Badge de Categoria */}
        <div className="absolute top-3 left-3 bg-brand-black text-white text-[9px] uppercase font-bold tracking-widest px-2 py-1">
          {product.category}
        </div>
      </Link>

      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-brand-black group-hover:text-brand-red transition-colors">
              <Link href={`/produto/${product.slug}`}>
                {product.name}
              </Link>
            </h3>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider">
              {product.subtitle}
            </p>
          </div>
          <span className="text-sm font-bold text-brand-black tracking-tight">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Variantes de cores disponíveis */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider mr-1">Cores:</span>
          {product.availableColors.map((color) => (
            <span
              key={color.slug}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
