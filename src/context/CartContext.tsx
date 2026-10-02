'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  cartItemId?: string;
  name: string;
  price: string;
  priceNumeric: number;
  priceString?: string;
  image: string;
  size: string;
  colorName: string;
  colorHex?: string;
  category?: string;
  productId: string;
  quantity: number;
}

export interface ActiveOrder {
  id: string;
  shortId: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isLoaded: boolean;
  subtotal: number;
  totalItems: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (firstArg: any, secondArg?: any, thirdArg?: any) => void;
  removeFromCart: (target?: number | string) => void;
  updateQuantity: (target?: string | number, delta?: number) => void;
  clearCart: () => void;
  activeOrder: ActiveOrder | null;
  setActiveOrderData: (order: ActiveOrder | null) => void;
  clearActiveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('laromme_cart');
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch (e) {}
    }
    const savedOrder = localStorage.getItem('laromme_active_order');
    if (savedOrder) {
      try { setActiveOrder(JSON.parse(savedOrder)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('laromme_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const subtotal = items.reduce((acc, item) => acc + (item.priceNumeric || 0) * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (firstArg: any, secondArg?: any, thirdArg?: any) => {
    let newItem: CartItem;

    if (secondArg !== undefined) {
      const product = firstArg;
      const size = secondArg;
      const colorIdx = typeof thirdArg === 'number' ? thirdArg : 0;
      const selectedColor = product.colors && product.colors[colorIdx] 
        ? product.colors[colorIdx] 
        : { name: 'Padrão', hex: '#000000' };

      const cartItemId = `${product.id || product.slug || 'item'}-${size}-${selectedColor.name}`;

      newItem = {
        id: product.id || product.slug || 'item',
        cartItemId,
        productId: product.id || product.slug || 'origo',
        name: product.name || 'Artefato',
        price: product.price || product.priceString || `R$ ${product.priceNumeric || 0}`,
        priceNumeric: product.priceNumeric || (typeof product.price === 'number' ? product.price : 0),
        priceString: product.priceString || product.price || `R$ ${product.priceNumeric || 0}`,
        image: product.image || (product.images && product.images[0]) || '',
        size: size,
        colorName: selectedColor.name || selectedColor || 'Padrão',
        colorHex: selectedColor.hex || '#000000',
        category: product.category || 'ARTEFATO',
        quantity: 1,
      };
    } else {
      const item = firstArg;
      const cartItemId = item.cartItemId || item.id || `${item.productId || 'item'}-${item.size}-${item.colorName}`;
      newItem = {
        id: item.id || item.productId || 'item',
        cartItemId,
        productId: item.productId || item.id || 'origo',
        name: item.name || 'Artefato',
        price: item.price || item.priceString || `R$ ${item.priceNumeric || 0}`,
        priceNumeric: item.priceNumeric || 0,
        priceString: item.priceString || item.price || `R$ ${item.priceNumeric || 0}`,
        image: item.image || '',
        size: item.size || 'ÚNICO',
        colorName: item.colorName || 'Padrão',
        colorHex: item.colorHex || '#000000',
        category: item.category || 'ARTEFATO',
        quantity: item.quantity || 1,
      };
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => (i.cartItemId && i.cartItemId === newItem.cartItemId) || 
               (i.productId === newItem.productId && i.size === newItem.size && i.colorName === newItem.colorName)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeFromCart = (target?: number | string) => {
    if (target === undefined) return;
    setItems((prev) => {
      if (typeof target === 'number') {
        return prev.filter((_, i) => i !== target);
      }
      return prev.filter((item) => item.cartItemId !== target && item.id !== target);
    });
  };

  const updateQuantity = (target?: string | number, delta: number = 0) => {
    if (target === undefined) return;
    setItems((prev) => {
      return prev
        .map((item, idx) => {
          const isTarget = typeof target === 'number' ? idx === target : item.cartItemId === target || item.id === target;
          if (isTarget) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setItems([]);

  const setActiveOrderData = (order: ActiveOrder | null) => {
    setActiveOrder(order);
    if (order) {
      localStorage.setItem('laromme_active_order', JSON.stringify(order));
    } else {
      localStorage.removeItem('laromme_active_order');
    }
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
    localStorage.removeItem('laromme_active_order');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoaded,
        subtotal,
        totalItems,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        activeOrder,
        setActiveOrderData,
        clearActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
}