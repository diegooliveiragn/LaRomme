'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { EASINGS, DURATIONS } from '@/config/motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay Escuro com Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATIONS.fast }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Painel do Drawer com Slide em Curva Cinematográfica */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
              className="w-screen max-w-md bg-white text-brand-black shadow-2xl flex flex-col justify-between"
            >
              {/* Header do Cart Drawer */}
              <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-brand-black text-brand-offwhite">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-brand-red" />
                  <h2 className="font-serif text-lg font-bold uppercase tracking-wider">
                    Seu Carrinho ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1 hover:text-brand-red transition-colors"
                  aria-label="Fechar carrinho"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lista de Itens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                      Sua sacola está vazia no momento.
                    </p>
                    <button
                      onClick={closeCart}
                      className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-editorial px-6 py-3 hover:bg-brand-red transition-all"
                    >
                      Explorar Drop 01
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: DURATIONS.fast }}
                        className="flex gap-4 border-b border-zinc-200 pb-4 items-start justify-between overflow-hidden"
                      >
                        <div className="space-y-1">
                          <h3 className="font-serif text-sm font-bold uppercase text-brand-black">
                            {item.product.name}
                          </h3>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider">
                            {item.product.subtitle}
                          </p>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex gap-3">
                            <span>Cor: {item.selectedColor.name}</span>
                            <span>Tam: {item.selectedSize}</span>
                          </div>
                          <div className="text-xs font-bold text-brand-black pt-1 font-mono">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </div>
                        </div>

                        {/* Controles de Quantidade */}
                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-400 hover:text-brand-red transition-colors"
                            title="Remover produto"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center border border-zinc-300 text-xs font-bold">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 hover:bg-zinc-100"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 hover:bg-zinc-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer do Cart Drawer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold uppercase tracking-widest text-zinc-600">
                      Subtotal
                    </span>
                    <span className="font-bold text-lg text-brand-black font-mono">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Frete e impostos calculados na etapa de finalização.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/carrinho"
                      onClick={closeCart}
                      className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-editorial py-4 flex items-center justify-center gap-2 hover:bg-brand-red transition-all shadow-md"
                    >
                      Finalizar Compra <ArrowRight size={16} />
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