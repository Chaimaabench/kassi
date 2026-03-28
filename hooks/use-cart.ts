'use client';

import { useEffect, useState } from 'react';
import { CART_UPDATED_EVENT, readCart, type CartItem, writeCart } from '@/lib/cart';
import { getProductById } from '@/lib/products';

type DetailedCartItem = CartItem & {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  lineTotal: number;
};

function buildDetailedCart(items: CartItem[]): DetailedCartItem[] {
  return items
    .map((item) => {
      const product = getProductById(item.id);

      if (!product) {
        return null;
      }

      return {
        ...item,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is DetailedCartItem => item !== null);
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      setCartItems(readCart());
      setIsReady(true);
    };

    syncCart();
    window.addEventListener('storage', syncCart);
    window.addEventListener(CART_UPDATED_EVENT, syncCart);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
    };
  }, []);

  const setAndPersistCart = (nextItems: CartItem[]) => {
    setCartItems(nextItems);
    writeCart(nextItems);
  };

  const addToCart = (id: number) => {
    const existingItem = cartItems.find((item) => item.id === id);

    if (existingItem) {
      setAndPersistCart(
        cartItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
      );
      return;
    }

    setAndPersistCart([...cartItems, { id, quantity: 1 }]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setAndPersistCart(cartItems.filter((item) => item.id !== id));
      return;
    }

    setAndPersistCart(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id: number) => {
    setAndPersistCart(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setAndPersistCart([]);
  };

  const detailedItems = buildDetailedCart(cartItems);
  const cartCount = detailedItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = detailedItems.reduce((total, item) => total + item.lineTotal, 0);

  return {
    cartItems,
    detailedItems,
    cartCount,
    cartTotal,
    isReady,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}
