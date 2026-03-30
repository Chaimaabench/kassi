'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import { useCart } from '@/hooks/use-cart';
import { useProductCatalog } from '@/hooks/use-product-catalog';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop';

function getDiscountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const products = useProductCatalog();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = useMemo(
    () => products.find((entry) => entry.slug === params.slug),
    [params.slug, products],
  );

  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SiteLogo className="inline-flex" imageClassName="h-12 w-auto" priority />
          <p className="mt-10 text-charcoal/60">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <SiteLogo className="inline-flex" imageClassName="h-12 w-auto" priority />
          <div className="mt-12 rounded-[2rem] border border-charcoal/10 bg-white p-10">
            <h1 className="font-serif text-4xl text-charcoal">Product not found</h1>
            <p className="mt-4 text-charcoal/60">This mug could not be found in the current collection.</p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-medium text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to collection
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedImage = product.images[selectedImageIndex] ?? product.image;
  const discountPercent = getDiscountPercent(product.price, product.originalPrice);

  return (
    <main className="min-h-screen bg-cream px-6 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-6">
          <SiteLogo className="inline-flex" imageClassName="h-12 w-auto" priority />
          <Link href="/" className="inline-flex items-center gap-2 text-charcoal/70 hover:text-terracotta transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <section>
            <div className="relative overflow-hidden rounded-[2rem] bg-white">
              <div className="relative aspect-[4/5]">
                <Image src={selectedImage} alt={product.name} fill className="object-cover" />
              </div>
              {discountPercent && (
                <div className="absolute right-6 top-6 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-white">
                  -{discountPercent}% off
                </div>
              )}
              {product.tag && (
                <div className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal">
                  {product.tag}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-2xl border ${
                      selectedImageIndex === index ? 'border-terracotta' : 'border-charcoal/10'
                    } bg-white`}
                  >
                    <div className="relative aspect-square">
                      <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-[2rem] border border-charcoal/10 bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-charcoal/45">{product.category}</p>
              <h1 className="mt-3 font-serif text-4xl text-charcoal">{product.name}</h1>
              <p className="mt-5 text-lg leading-8 text-charcoal/70">{product.description}</p>

              <div className="mt-8 flex items-end gap-4">
                <p className="font-serif text-4xl text-charcoal">{product.price} MAD</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="pb-1 text-lg text-charcoal/45 line-through">{product.originalPrice} MAD</p>
                )}
              </div>

              <div className="mt-8 rounded-2xl bg-sage/10 p-5 text-sm text-charcoal/75">
                Free shipping from {FREE_SHIPPING_THRESHOLD} MAD. Cash on delivery available across Morocco.
              </div>

              <div className="mt-8 space-y-3 text-sm text-charcoal/70">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-sage" />
                  Swipe gallery with all available photos
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-sage" />
                  Standard and express shipping options
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-sage" />
                  Secure lead capture at checkout
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-4 font-medium text-white hover:bg-terracotta/90 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to bag
                </button>
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/15 px-7 py-4 font-medium text-charcoal hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Go to checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
