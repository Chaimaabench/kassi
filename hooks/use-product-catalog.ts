'use client';

import { useEffect, useState } from 'react';
import { buildProductsFromMedia, type Product, type ProductMediaEntry } from '@/lib/products';

export function useProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const loadProductMedia = async () => {
      try {
        const response = await fetch('/api/product-media', {cache: 'no-store'});
        if (!response.ok) {
          return;
        }

        const mediaEntries = (await response.json()) as ProductMediaEntry[];
        if (!isCancelled) {
          setProducts(buildProductsFromMedia(mediaEntries));
        }
      } catch {
        // Leave the catalog empty if the media manifest is unavailable.
      }
    };

    loadProductMedia();

    return () => {
      isCancelled = true;
    };
  }, []);

  return products;
}
