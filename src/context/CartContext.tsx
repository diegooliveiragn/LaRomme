'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  category: string;
  priceString: string;
  priceNumeric: number;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, colorIndex: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('laromme_cart');
      if (saved) {
        const parsedItems = JSON.parse(saved);
        
        // Sanitização: Filtrar itens corrompidos do array salvo e garantir que propriedades importantes existem
        const validItems = parsedItems.filter((item: any) => 
          item && 
          item.cartItemId && 
          item.name && 
          typeof item.priceNumeric === 'number' &&
          !isNaN(item.priceNumeric) &&
          item.image && 
          typeof item.quantity === 'number'
        );

        // Se encontrou itens com formato invalido no banco do storage do browser, vai atualizar limpando os ruins
        if (validItems.length !== parsedItems.length) {
          console.warn("Removidos itens corrompidos ou legados do localStorage do Carrinho.");
          localStorage.setItem('laromme_cart', JSON.stringify(validItems));
        }

        setItems(validItems);
      }
    } catch (e) {
      console.error('Erro ao carregar o carrinho do LocalStorage:', e);
      localStorage.removeItem('laromme_cart'); // Limpar dados corrompidos inteiros
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('laromme_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    // Pega valor exemplo: "R$ 159,90" e transforma em numérico: 159.9
    const clean = priceStr.replace('R$', '').replace('.', '').replace(',', '.').trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const addToCart = (product: Product, size: string, colorIndex: number) => {
    const color = product.colors && product.colors[colorIndex] 
      ? product.colors[colorIndex] 
      : { name: 'PADRÃO', hex: '#000000', images: product.defaultImages || [] };
      
    const image = (color.images && color.images.length > 0) ? color.images[0] : (product.defaultImages && product.defaultImages[0] ? product.defaultImages[0] : '');
    const colorName = color.name || 'PADRÃO';
    const cartItemId = `${product.id}-${colorName}-${size}`;
    const priceNumeric = parsePrice(product.price);

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            category: product.category,
            priceString: product.price,
            priceNumeric,
            size,
            colorName,
            colorHex: color.hex || '#000000',
            image,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.priceNumeric * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart precisa ser utilizado dentro de um CartProvider');
  }
  return context;
}