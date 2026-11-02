'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export default function ProductPage({ params }: { params: { slug: string } }) {
  const localProduct: Product | undefined = PRODUCTS.find((p) => p.id === params.slug);

  const [dbProduct, setDbProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!localProduct);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [hasFetchedStock, setHasFetchedStock] = useState(false);

  useEffect(() => {
    async function loadProductFromDb() {
      if (localProduct) return;
      try {
        let query = supabase.from('products').select('*');

        if (isUUID(params.slug)) {
          query = query.or(`id.eq.${params.slug},sku_code.eq.${params.slug}`);
        } else {
          query = query.eq('sku_code', params.slug);
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
          setLoading(false);
          return;
        }

        const rawPrice = Number(data.price || 0);
        const formattedPrice = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(rawPrice);

        const mapped: Product = {
          id: data.sku_code || data.id,
          name: data.name,
          category: data.category || 'LIFESTYLE / ALGODÃO BOXY',
          tag: 'ARTEFATO HOMOLOGADO',
          price: formattedPrice,
          description: data.description || 'Artefato oficial LaRomme.',
          fabric: 'Algodão Premium 260 GSM estruturado.',
          fit: 'Corte Boxy. Ombros deslocados e gola estruturada.',
          care: 'Lavar em ciclo delicado em água fria. Secar à sombra.',
          isOneSize: false,
          colors: [
            {
              name: 'Noir',
              hex: '#0D0D0D',
              images: [data.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop']
            }
          ],
          defaultImages: [data.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop']
        };

        setDbProduct(mapped);
        setStockMap({
          P: data.stock_p ?? 0,
          M: data.stock_m ?? 1,
          G: data.stock_g ?? 0,
          GG: data.stock_gg ?? 0,
          TU: data.stock ?? 1
        });
        setHasFetchedStock(true);
      } catch (err) {
        console.error('Erro ao buscar produto no banco:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProductFromDb();
  }, [params.slug, localProduct]);

  const product = localProduct || dbProduct;

  useEffect(() => {
    async function fetchRealtimeStock() {
      if (!localProduct || !localProduct.id) return;
      try {
        const { data: variants, error } = await supabase
          .from('inventory_variants')
          .select('size, stock_available')
          .eq('product_id', localProduct.id);

        if (!error && variants && variants.length > 0) {
          const map: Record<string, number> = {};
          variants.forEach((v) => {
            const key = v.size ? v.size.toUpperCase() : 'TU';
            map[key] = v.stock_available ?? 0;
          });
          setStockMap(map);
          setHasFetchedStock(true);
        }
      } catch (err) {
        console.error('Erro ao ler estoque WMS Supabase:', err);
      }
    }
    fetchRealtimeStock();
  }, [localProduct]);

  const { addToCart } = useCart();
  const [selectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [addedToast, setAddedToast] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Localizando artefato no acervo...
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const currentImages = product.colors[selectedColorIndex]?.images || product.defaultImages;
  const isSelectedSizeOutOfStock = hasFetchedStock && (stockMap[selectedSize] ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isSelectedSizeOutOfStock) return;
    const sizeToCart = product.isOneSize ? 'TU' : selectedSize;
    addToCart(product, sizeToCart, selectedColorIndex);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          <div className="relative aspect-3/4 w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            <Image
              src={currentImages[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-2 border-b border-zinc-800 pb-6">
              <span className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase block">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider font-bold">
                {product.name}
              </h1>
              <p className="font-mono text-xl text-zinc-300 font-bold mt-2">
                {product.price}
              </p>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {!product.isOneSize && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                  Dimensão / Grade
                </span>
                <div className="flex gap-3">
                  {['P', 'M', 'G', 'GG'].map((sz) => {
                    const isAvailable = (stockMap[sz] ?? 1) > 0;
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-12 flex items-center justify-center font-mono text-xs border transition-all ${
                          selectedSize === sz
                            ? 'border-white bg-white text-black font-bold'
                            : isAvailable
                            ? 'border-zinc-800 text-zinc-300 hover:border-zinc-600'
                            : 'border-zinc-900 text-zinc-600 cursor-not-allowed opacity-40 line-through'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSelectedSizeOutOfStock}
                className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-all disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
              >
                {isSelectedSizeOutOfStock ? 'Esgotado nesta grade' : 'Adicionar à Sacola'}
              </button>

              {addedToast && (
                <div className="p-3 bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono text-center tracking-wider uppercase animate-in fade-in">
                  Artefato reservado na sacola
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase font-bold block mb-2">
                Especificações Técnicas
              </span>
              <div className="text-xs font-mono text-zinc-400 space-y-2">
                <p><strong className="text-zinc-300">Tecido:</strong> {product.fabric}</p>
                <p><strong className="text-zinc-300">Modelagem:</strong> {product.fit}</p>
                <p><strong className="text-zinc-300">Cuidados:</strong> {product.care}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}