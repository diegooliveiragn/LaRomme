'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const cart = useCart() as any;

  if (!cart) return null;

  const isOpen = cart.isOpen || cart.isCartOpen || false;
  const closeCart = cart.closeCart || cart.toggleCart || (() => {});
  const items = cart.items || cart.cartItems || [];
  const removeItem = cart.removeItem || cart.removeFromCart || (() => {});
  
  const total = items.reduce((acc: number, item: any) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 text-brand-offwhite p-8 flex flex-col justify-between shadow-2xl relative z-10"
            >
              
              {/* HEAD: Título e Fechar */}
              <div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-6 mb-8">
                  <div>
                    <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">
                      Sacola de Alocação
                    </span>
                    <h2 className="font-serif text-2xl uppercase tracking-wider text-white mt-1">
                      Artefatos
                    </h2>
                  </div>
                  <button
                    onClick={closeCart}
                    className="font-mono text-xs text-zinc-500 hover:text-white transition-colors p-2"
                  >
                    [ FECHAR ]
                  </button>
                </div>

                {/* BODY: Estado Vazio ou Lista de Itens */}
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-6">
                    <span className="font-mono text-[10px] text-zinc-600 block uppercase tracking-widest">
                      STATUS: 000 // ARQUIVO VAZIO
                    </span>
                    <p className="font-serif text-xl uppercase tracking-wider text-zinc-400">
                      Nenhum artefato selecionado
                    </p>
                    <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                      Sua estrutura de alocação ainda não possui peças registradas para o Lote Zero.
                    </p>
                    <div className="pt-6">
                      <Link
                        href="/colecao/origo"
                        onClick={closeCart}
                        className="inline-block border border-zinc-800 text-white px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:border-brand-red hover:bg-brand-red transition-all duration-300"
                      >
                        [ Explorar Coleção Origo ]
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                    {items.map((item: any, idx: number) => {
                      const imgSrc = typeof item.images?.[0] === 'string' 
                        ? item.images[0] 
                        : (item.images?.[0]?.src || item.image || '/images/material.jpg');

                      return (
                        <div key={idx} className="flex gap-4 border-b border-zinc-900 pb-6 items-center justify-between">
                          <div className="w-16 h-20 bg-zinc-900 relative overflow-hidden border border-zinc-800 flex-shrink-0">
                            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover grayscale" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-serif text-sm uppercase tracking-wider text-white">{item.name}</h3>
                            <p className="font-mono text-[10px] text-zinc-500 uppercase">Tam: {item.size || 'M'} | Qtd: {item.quantity || 1}</p>
                            <p className="font-mono text-xs text-zinc-300">R$ {Number(item.price).toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id || item.slug, item.size)}
                            className="font-mono text-[10px] text-zinc-600 hover:text-brand-red transition-colors p-2"
                          >
                            [ X ]
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FOOTER: Subtotal e Checkout (apenas se houver itens) */}
              {items.length > 0 && (
                <div className="border-t border-zinc-900 pt-6 space-y-6">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-zinc-500 uppercase tracking-widest">Subtotal Estimado</span>
                    <span className="text-white text-sm font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="block w-full text-center bg-white text-brand-black py-4 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 shadow-xl"
                    >
                      [ Finalizar Alocação ]
                    </Link>
                    <Link
                      href="/carrinho"
                      onClick={closeCart}
                      className="block w-full text-center border border-zinc-800 text-zinc-400 py-3 font-mono text-[10px] uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-colors"
                    >
                      Ver Sacola Detalhada
                    </Link>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}