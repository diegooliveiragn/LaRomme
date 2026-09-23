'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] overflow-hidden">
          {/* Backdrop Escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-screen max-w-md bg-zinc-950 border-l border-zinc-900 text-brand-offwhite p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative z-10"
            >
              
              {/* TOP HEADER */}
              <div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-6 mb-6">
                  <div>
                    <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block">
                      Lote Zero // Allocations
                    </span>
                    <h2 className="font-serif text-2xl uppercase tracking-wider text-white mt-1">
                      Sacola ({totalItems})
                    </h2>
                  </div>
                  <button
                    onClick={closeCart}
                    className="font-mono text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors p-2"
                  >
                    [ FECHAR ]
                  </button>
                </div>

                {/* LISTA DE ITENS DA SACOLA */}
                {items.length === 0 ? (
                  <div className="py-24 text-center space-y-6">
                    <span className="font-mono text-[10px] text-zinc-600 block uppercase tracking-widest">
                      STATUS: 000 // ARQUIVO VAZIO
                    </span>
                    <p className="font-serif text-xl uppercase tracking-wider text-zinc-400">
                      Nenhum artefato selecionado
                    </p>
                    <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                      Sua estrutura de alocação ainda não possui peças registradas.
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
                  <div className="space-y-6 max-h-[58vh] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-zinc-900 pb-6 items-center justify-between">
                        <div className="w-16 h-20 bg-zinc-900 relative overflow-hidden border border-zinc-800 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h3 className="font-serif text-sm uppercase tracking-wider text-white">{item.name}</h3>
                          <p className="font-mono text-[10px] text-zinc-500 uppercase">Dimensão: {item.size}</p>
                          <p className="font-mono text-xs text-zinc-300">R$ {item.price.toFixed(2)}</p>
                          
                          {/* CONTROLES DE QUANTIDADE (+ / -) */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              className="w-6 h-6 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 hover:border-white hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="w-6 h-6 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 hover:border-white hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* EXCLUIR ITEM */}
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="font-mono text-[10px] text-zinc-600 hover:text-brand-red transition-colors p-2"
                          title="Remover Artefato"
                        >
                          [ X ]
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER DA SACOLA */}
              {items.length > 0 && (
                <div className="border-t border-zinc-900 pt-6 space-y-6 bg-zinc-950">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-zinc-500 uppercase tracking-widest">Subtotal Estimado</span>
                    <span className="text-white text-sm font-bold">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="block w-full text-center bg-white text-brand-black py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 shadow-xl"
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