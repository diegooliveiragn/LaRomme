'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { items, isOpen, openCart, closeCart, removeFromCart, activeOrder, clearActiveOrder } = useCart();
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  // Oculta o header do e-commerce em todas as páginas do Cortex OS
  if (pathname?.startsWith('/cortex')) {
    return null;
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.priceNumeric || 0) * item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-[#080808]/90 backdrop-blur-md border-b border-zinc-900 px-6 md:px-12 py-4 flex items-center justify-between font-mono text-xs tracking-wider">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-serif text-lg tracking-[0.2em] font-bold text-white group-hover:text-zinc-300 transition-colors uppercase">
              LAROMME
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/#origo" className="hover:text-white transition-colors">ACERVO</Link>
          <Link href="/a-marca" className="hover:text-white transition-colors">A MARCA</Link>
          <Link href="/o-movimento" className="hover:text-white transition-colors">O MOVIMENTO</Link>
          <Link href="/editorial" className="hover:text-white transition-colors">EDITORIAL</Link>
          <Link href="/senado-vip" className="hover:text-white transition-colors">SENADO VIP</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={openCart}
            className="flex items-center space-x-2 border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-300 px-3 py-1.5 transition-all text-[10px] uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>
              CARRINHO ({totalQuantity}){activeOrder ? ' • RESERVA ATIVA' : ''}
            </span>
          </button>

          <button
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
            className="md:hidden text-zinc-400 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* MENU MOBILE OVERLAY */}
      {menuMobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl md:hidden pt-24 px-8 flex flex-col space-y-6 font-mono text-sm uppercase tracking-widest text-zinc-300">
          <Link href="/#origo" onClick={() => setMenuMobileOpen(false)} className="border-b border-zinc-900 pb-3">ACERVO</Link>
          <Link href="/a-marca" onClick={() => setMenuMobileOpen(false)} className="border-b border-zinc-900 pb-3">A MARCA</Link>
          <Link href="/o-movimento" onClick={() => setMenuMobileOpen(false)} className="border-b border-zinc-900 pb-3">O MOVIMENTO</Link>
          <Link href="/editorial" onClick={() => setMenuMobileOpen(false)} className="border-b border-zinc-900 pb-3">EDITORIAL</Link>
          <Link href="/senado-vip" onClick={() => setMenuMobileOpen(false)} className="border-b border-zinc-900 pb-3">SENADO VIP</Link>
        </div>
      )}

      {/* SLIDE-OVER DO CARRINHO */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeCart} />

          <div className="relative w-full max-w-md bg-[#090909] border-l border-zinc-800 text-white h-full flex flex-col justify-between p-6 md:p-8 z-10 font-mono shadow-2xl">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
                <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-serif">SACOLA DE ARTEFATOS</span>
                <button onClick={closeCart} className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest">
                  [ FECHAR ]
                </button>
              </div>

              {/* CARTÃO DE RESERVA ATIVA */}
              {activeOrder && (
                <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3 mb-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      RESERVA TEMPORÁRIA ATIVA
                    </span>
                    <span className="text-[10px] text-zinc-500">#{activeOrder.shortId}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    Sua peça foi separada no estoque e aguarda a confirmação do pagamento.
                  </p>
                  <div className="pt-2 flex flex-col space-y-2">
                    <Link
                      href={`/pedido/${activeOrder.id}`}
                      onClick={closeCart}
                      className="w-full text-center bg-white text-black py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
                    >
                      RETOMAR PEDIDO / GUIA PIX
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Deseja cancelar esta reserva ativa e liberar a peça para o catálogo?')) {
                          clearActiveOrder();
                        }
                      }}
                      className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors text-center pt-1"
                    >
                      Cancelar esta reserva
                    </button>
                  </div>
                </div>
              )}

              {/* LISTA DE ITENS NO CARRINHO */}
              {items.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-600 uppercase tracking-widest space-y-2">
                  <p>Sua sacola está vazia.</p>
                  <p className="text-[10px] text-zinc-700">Selecione um artefato no catálogo.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-zinc-900 pb-4">
                      <div className="flex items-center space-x-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-zinc-800" />}
                        <div>
                          <p className="text-xs uppercase font-serif tracking-wider font-bold">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">{item.colorName} • TAM: {item.size} • QTD: {item.quantity}</p>
                          <p className="text-xs text-zinc-300 mt-1">{item.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-[10px] text-zinc-600 hover:text-red-400 uppercase tracking-wider"
                      >
                        REMOVER
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RODAPÉ DO SLIDE-OVER */}
            {items.length > 0 && (
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-zinc-500">SUBTOTAL</span>
                  <span className="text-white font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center bg-white text-black py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
                >
                  FINALIZAR ENCOMENDA
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}