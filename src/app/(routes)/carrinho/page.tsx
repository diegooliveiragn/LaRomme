'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CarrinhoPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold uppercase text-brand-black">
          Seu Carrinho Está Vazio
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Explore o Drop 01 — ORIGO e adicione peças à sua sacola.
        </p>
        <div>
          <Link
            href="/colecao/origo"
            className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-editorial px-8 py-4 hover:bg-brand-red transition-all"
          >
            Ver Coleção Origo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6">
        <h1 className="font-serif text-3xl font-bold uppercase text-brand-black">
          Sua Sacola de Compras ({totalItems})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Tabela de Produtos */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 p-6 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-6 gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-editorial text-brand-red">
                  {item.product.subtitle}
                </span>
                <h2 className="font-serif text-lg font-bold uppercase text-brand-black">
                  {item.product.name}
                </h2>
                <div className="text-xs text-zinc-500 uppercase tracking-wider flex gap-4">
                  <span>Cor: {item.selectedColor.name}</span>
                  <span>Tamanho: {item.selectedSize}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-auto">
                <div className="flex items-center border border-zinc-300 text-xs font-bold">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-zinc-100"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm font-bold text-brand-black min-w-[80px] text-right">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-400 hover:text-brand-red transition"
                  title="Remover produto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-4 bg-brand-black text-brand-offwhite p-8 space-y-6 border border-zinc-800">
          <h2 className="font-serif text-xl font-bold uppercase border-b border-zinc-800 pb-4">
            Resumo do Pedido
          </h2>

          <div className="space-y-3 text-xs uppercase tracking-wider">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Frete</span>
              <span>Calculado no checkout</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white border-t border-zinc-800 pt-3">
              <span>Total Parcial</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-brand-red text-white text-xs font-bold uppercase tracking-editorial py-4 flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-md"
          >
            Avançar Para O Checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
