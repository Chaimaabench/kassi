export type CartItem = {
  id: number;
  quantity: number;
};

export const CART_STORAGE_KEY = 'kassi-cart';
export const CART_UPDATED_EVENT = 'kassi-cart-updated';

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(
      (item): item is CartItem =>
        typeof item?.id === 'number' && typeof item?.quantity === 'number' && item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
