'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal } = useCart() as any;
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartItems = items || [];

  if (cartItems.length === 0) {
    return (
      <div className="bg-brand-black min-h-screen text-brand-offwhite flex flex-col items-center justify-center pt-32 pb-32 px-6">
        <span className="font-mono text-[10px] text-zinc-600 block uppercase tracking-widest mb-4">
          STATUS: 404 // SACOLA VAZIA
        </span>
        <h1 className="font-serif text-3xl uppercase tracking-wider text-white mb-8">
          Sua alocação está vazia
        </h1>
        <Link href="/colecao/origo" className="bg-white text-brand-black px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors shadow-2xl">
          [ Retornar à Coleção ]
        </Link>
      </div>
    );
  }

  const frete: number = 0;
  const numericSubtotal = Number(subtotal) || 0;
  const total = numericSubtotal + frete;
  const freteDisplay = frete === 0 ? 'LOTE ZERO (ISENTO)' : `R$ ${frete.toFixed(2)}`;

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-zinc-900 pb-6">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-2">
            Protocolo de Transferência
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* COLUNA ESQUERDA: FORMULÁRIOS */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Bloco 1: Identificação */}
            <section className="space-y-6">
              <h2 className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-3">
                01. Identificação
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="NOME COMPLETO" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors" />
                <input type="email" placeholder="E-MAIL (CHAVE DE ACESSO)" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors" />
                <input type="text" placeholder="CPF" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-2" />
              </div>
            </section>

            {/* Bloco 2: Logística (Endereço) */}
            <section className="space-y-6">
              <h2 className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-3">
                02. Coordenadas de Envio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" placeholder="CEP" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-1" />
                <input type="text" placeholder="ENDEREÇO" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-2" />
                <input type="text" placeholder="NÚMERO" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors" />
                <input type="text" placeholder="COMPLEMENTO" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-2" />
                <input type="text" placeholder="CIDADE" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-2" />
                <input type="text" placeholder="ESTADO (UF)" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] uppercase tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors sm:col-span-1" />
              </div>
            </section>

            {/* Bloco 3: Pagamento */}
            <section className="space-y-6">
              <h2 className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-3">
                03. Método de Liquidação
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-6 border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${paymentMethod === 'pix' ? 'border-brand-red bg-zinc-900' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-500'}`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white">PIX</span>
                  <span className="font-mono text-[9px] text-zinc-500">Aprovação Imediata</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-brand-red bg-zinc-900' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-500'}`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white">CARTÃO</span>
                  <span className="font-mono text-[9px] text-zinc-500">Até 3x sem juros</span>
                </button>
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA: RESUMO DA COMPRA (STICKY) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 space-y-8 shadow-2xl">
              <h2 className="font-serif text-xl uppercase tracking-wider text-white border-b border-zinc-900 pb-4">
                Estrutura de Alocação
              </h2>
              
              {/* Itens */}
              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-zinc-900 relative overflow-hidden border border-zinc-800 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-[12px] uppercase tracking-wider text-white">{item.name}</h3>
                      <p className="font-mono text-[9px] text-zinc-500 uppercase">Tam: {item.size} | Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[11px] text-white">R$ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="border-t border-zinc-900 pt-6 space-y-4 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">R$ {numericSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logística (Envio)</span>
                  <span className="text-white">{freteDisplay}</span>
                </div>
                <div className="border-t border-zinc-900 pt-4 flex justify-between font-mono text-sm text-white font-bold">
                  <span>Total</span>
                  <span className="text-brand-red">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão de Pagamento */}
              <button className="w-full bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 mt-8 shadow-xl">
                [ Processar Liquidação ]
              </button>
              
              <div className="text-center mt-4">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                  Transação protegida por criptografia ponta a ponta.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}