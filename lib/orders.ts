export type SubmittedOrder = {
  customerName: string;
  itemsCount: number;
  total: number;
  orderId: string;
  submittedAt: string;
};

export const LAST_ORDER_STORAGE_KEY = 'kassi-last-order';

export function readLastOrder(): SubmittedOrder | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawOrder = window.localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!rawOrder) {
      return null;
    }

    const parsedOrder = JSON.parse(rawOrder);
    if (
      typeof parsedOrder?.customerName !== 'string' ||
      typeof parsedOrder?.itemsCount !== 'number' ||
      typeof parsedOrder?.total !== 'number' ||
      typeof parsedOrder?.orderId !== 'string' ||
      typeof parsedOrder?.submittedAt !== 'string'
    ) {
      return null;
    }

    return parsedOrder as SubmittedOrder;
  } catch {
    return null;
  }
}

export function writeLastOrder(order: SubmittedOrder) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function clearLastOrder() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(LAST_ORDER_STORAGE_KEY);
}
