'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold uppercase text-brand-black">
          Sua Sacola Está Vazia
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Adicione itens ao carrinho para prosseguir para o checkout.
        </p>
        <Link
          href="/colecao/origo"
          className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-editorial px-8 py-4"
        >
          Ir Para A Coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-6xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6 text-center">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
          Ambiente Seguro
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-brand-black">
          Finalizar Pedido
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulário de Identificação e Entrega */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold uppercase text-brand-black border-b border-zinc-200 pb-3">
            1. Dados do Comprador
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">Nome</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">Sobrenome</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-xs" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">E-mail</label>
            <input type="email" className="w-full border border-zinc-300 p-3 text-xs" />
          </div>

          <h2 className="font-serif text-xl font-bold uppercase text-brand-black border-b border-zinc-200 pb-3 pt-4">
            2. Endereço de Entrega
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">CEP</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-xs" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-black block">Rua / Logradouro</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-xs" />
            </div>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 uppercase tracking-wider">
            [ ARQUITETURA PREPARADA PARA INTEGRAÇÃO FUTURA DE GATEWAY DE PAGAMENTO ]
          </div>
        </div>

        {/* Resumo Lateral do Pedido */}
        <div className="lg:col-span-5 bg-brand-black text-brand-offwhite p-8 space-y-6 border border-zinc-800">
          <h2 className="font-serif text-xl font-bold uppercase border-b border-zinc-800 pb-4">
            Itens do Pedido ({cart.length})
          </h2>

          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-xs border-b border-zinc-800 pb-3">
                <div>
                  <div className="font-bold uppercase text-white">{item.product.name}</div>
                  <div className="text-zinc-400 text-[10px] uppercase">
                    {item.selectedColor.name} | {item.selectedSize} | Qtd: {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-white">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs uppercase tracking-wider">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
