'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart() as any;
  const cartItems = items || [];

  if (cartItems.length === 0) {
    return (
      <div className="bg-brand-black min-h-screen text-brand-offwhite flex flex-col items-center justify-center pt-32 pb-32 px-6">
        <span className="font-mono text-[10px] text-zinc-600 block uppercase tracking-widest mb-4">
          STATUS: 000 // ARQUIVO VAZIO
        </span>
        <h1 className="font-serif text-3xl uppercase tracking-wider text-white mb-8">
          Sua sacola está vazia
        </h1>
        <Link href="/colecao/origo" className="bg-white text-brand-black px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors shadow-2xl">
          [ Explorar Coleção Origo ]
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-900 pb-8 mb-12">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            Lote Zero // Allocations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider text-white">
            Sacola Detalhada
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative items-start">
          {/* Lado Esquerdo: Lista de Itens */}
          <div className="lg:col-span-7 space-y-8">
            {cartItems.map((item: any, idx: number) => (
              <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-6 border-b border-zinc-900 pb-8 items-center group">
                <div className="w-24 h-32 sm:w-32 sm:h-40 bg-zinc-900 relative overflow-hidden border border-zinc-800 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-white">{item.name}</h3>
                  <p className="font-mono text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest">Dimensão: {item.size}</p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => updateQuantity && updateQuantity(item.id, item.size, -1)} className="w-7 h-7 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 hover:border-white hover:text-white transition-colors">
                      -
                    </button>
                    <span className="font-mono text-xs text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity && updateQuantity(item.id, item.size, 1)} className="w-7 h-7 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 hover:border-white hover:text-white transition-colors">
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <p className="font-mono text-sm text-white">R$ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                  <button onClick={() => removeFromCart && removeFromCart(item.id, item.size)} className="font-mono text-[10px] text-zinc-600 hover:text-brand-red uppercase tracking-widest transition-colors">
                    [ Remover ]
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lado Direito: Resumo */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-8 shadow-2xl">
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white border-b border-zinc-900 pb-4">
                Resumo da Alocação
              </h2>
              <div className="space-y-4 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">R$ {Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete (Lote Zero)</span>
                  <span className="text-white">Calculado no Checkout</span>
                </div>
              </div>
              <div className="border-t border-zinc-900 pt-6 flex justify-between font-mono text-sm text-white">
                <span>Total Estimado</span>
                <span className="text-brand-red font-bold">R$ {Number(subtotal).toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="block w-full text-center bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 mt-8 shadow-xl">
                [ Prosseguir para Checkout ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}