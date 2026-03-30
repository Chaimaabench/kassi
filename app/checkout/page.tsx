'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { clearLastOrder, readLastOrder, writeLastOrder, type SubmittedOrder } from '@/lib/orders';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shop';

export default function CheckoutPage() {
  const { detailedItems, cartCount, cartTotal, isReady, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const activeSubmittedOrder = submittedOrder ?? (isReady ? readLastOrder() : null);

  const shippingCost = useMemo(() => {
    if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    return deliveryMethod === 'express' ? 45 : 25;
  }, [cartTotal, deliveryMethod]);

  const total = cartTotal + shippingCost;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const city = String(formData.get('city') || '').trim();
    const postalCode = String(formData.get('postalCode') || '').trim();
    const note = String(formData.get('note') || '').trim();
    const orderId = `KASSI-${Date.now().toString().slice(-6)}`;
    const nextSubmittedOrder = {
      customerName: firstName || 'Customer',
      itemsCount: cartCount,
      total,
      orderId,
      submittedAt: new Date().toLocaleString('fr-MA', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    try {
      const response = await fetch('/api/checkout-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerName: `${firstName} ${lastName}`.trim() || firstName || 'Customer',
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          postalCode,
          note,
          deliveryMethod,
          shippingCost,
          subtotal: cartTotal,
          total,
          itemsCount: cartCount,
          items: detailedItems.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            lineTotal: item.lineTotal,
          })),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Unable to save the checkout lead.');
      }

      setSubmittedOrder(nextSubmittedOrder);
      writeLastOrder(nextSubmittedOrder);
      clearCart();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save the checkout lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center text-charcoal/70">
          <p className="font-medium">Loading your checkout...</p>
        </div>
      </main>
    );
  }

  if (activeSubmittedOrder) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-charcoal/70 hover:text-terracotta transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to the store
          </Link>

          <section className="mt-10 rounded-[2rem] bg-white border border-charcoal/10 shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-sage/15 text-sage flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-4xl text-charcoal mb-4">Order received</h1>
            <p className="text-charcoal/70 text-lg max-w-xl mx-auto">
              Thank you {activeSubmittedOrder.customerName}, your checkout flow is now in place and your order summary
              has been captured on the front-end.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl bg-cream p-5">
                <p className="text-sm text-charcoal/50 mb-2">Order ID</p>
                <p className="text-xl font-serif text-charcoal">{activeSubmittedOrder.orderId}</p>
              </div>
              <div className="rounded-2xl bg-cream p-5">
                <p className="text-sm text-charcoal/50 mb-2">Items</p>
                <p className="text-2xl font-serif text-charcoal">{activeSubmittedOrder.itemsCount}</p>
              </div>
              <div className="rounded-2xl bg-cream p-5">
                <p className="text-sm text-charcoal/50 mb-2">Total</p>
                <p className="text-2xl font-serif text-charcoal">{activeSubmittedOrder.total} MAD</p>
              </div>
              <div className="rounded-2xl bg-cream p-5">
                <p className="text-sm text-charcoal/50 mb-2">Placed at</p>
                <p className="text-xl font-serif text-charcoal">{activeSubmittedOrder.submittedAt}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                onClick={() => {
                  clearLastOrder();
                  setSubmittedOrder(null);
                }}
                className="px-6 py-3 rounded-full bg-charcoal text-white font-medium hover:bg-charcoal/90 transition-colors"
              >
                Continue shopping
              </Link>
              <Link
                href="/"
                onClick={() => {
                  clearLastOrder();
                  setSubmittedOrder(null);
                }}
                className="px-6 py-3 rounded-full border border-charcoal/15 text-charcoal font-medium hover:border-terracotta hover:text-terracotta transition-colors"
              >
                Update products and prices
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (detailedItems.length === 0) {
    return (
      <main className="min-h-screen bg-cream px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-charcoal/5 text-charcoal/60 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl text-charcoal mb-4">Your bag is empty</h1>
          <p className="text-charcoal/60 text-lg max-w-lg mx-auto">
            Add a few products from the collection first, then your checkout summary will appear here.
          </p>
          <Link
            href="/"
            onClick={() => {
              clearLastOrder();
              setSubmittedOrder(null);
            }}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <section className="flex-1">
            <Link href="/" className="inline-flex items-center gap-2 text-charcoal/70 hover:text-terracotta transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to shopping
            </Link>

            <div className="mt-8">
              <span className="inline-block px-3 py-1 rounded-full bg-charcoal/5 text-charcoal/70 text-xs font-medium tracking-[0.2em] uppercase">
                Checkout
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl text-charcoal leading-tight">
                Complete your Kassi order
              </h1>
              <p className="mt-4 text-charcoal/65 text-lg max-w-2xl">
                The front-end flow is now ready for major edits. You can keep this cash-on-delivery version or
                connect a payment provider later.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
                <Truck className="w-5 h-5 text-sage mb-3" />
                <p className="font-medium text-charcoal">Fast delivery</p>
                <p className="text-sm text-charcoal/55 mt-2">Standard and express shipping options for Morocco.</p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
                <ShieldCheck className="w-5 h-5 text-sage mb-3" />
                <p className="font-medium text-charcoal">Cash on delivery</p>
                <p className="text-sm text-charcoal/55 mt-2">Simple checkout now, payment gateway can be added later.</p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
                <ShoppingBag className="w-5 h-5 text-sage mb-3" />
                <p className="font-medium text-charcoal">Live summary</p>
                <p className="text-sm text-charcoal/55 mt-2">Your order total updates instantly with the cart content.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-10">
              <div className="rounded-[2rem] bg-white border border-charcoal/10 shadow-sm p-6 md:p-8">
                <h2 className="font-serif text-3xl text-charcoal">Customer details</h2>
                <div className="mt-6 grid md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">First name</span>
                    <input
                      name="firstName"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="Sara"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">Last name</span>
                    <input
                      name="lastName"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="Bennani"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">Phone number</span>
                    <input
                      name="phone"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="+212 6 00 00 00 00"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">Email address</span>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white border border-charcoal/10 shadow-sm p-6 md:p-8">
                <h2 className="font-serif text-3xl text-charcoal">Delivery address</h2>
                <div className="mt-6 grid md:grid-cols-2 gap-5">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-charcoal/70">Street address</span>
                    <input
                      name="address"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="Apartment, street, landmark"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">City</span>
                    <input
                      name="city"
                      required
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="Casablanca"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-charcoal/70">Postal code</span>
                    <input
                      name="postalCode"
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta"
                      placeholder="20250"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-charcoal/70">Order note</span>
                    <textarea
                      name="note"
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 outline-none focus:border-terracotta resize-none"
                      placeholder="Optional delivery instructions"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white border border-charcoal/10 shadow-sm p-6 md:p-8">
                <h2 className="font-serif text-3xl text-charcoal">Shipping and payment</h2>
                <div className="mt-6 rounded-2xl bg-sage/10 px-5 py-4 text-sm text-charcoal/75">
                  Free shipping is unlocked automatically from {FREE_SHIPPING_THRESHOLD} MAD.
                </div>
                <div className="mt-6 grid gap-4">
                  <label className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-cream p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-charcoal">Standard delivery</span>
                      <span className="block text-sm text-charcoal/55 mt-1">2 to 4 business days - 25 MAD</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-4 rounded-2xl border border-charcoal/10 bg-cream p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-charcoal">Express delivery</span>
                      <span className="block text-sm text-charcoal/55 mt-1">Next-day dispatch where available - 45 MAD</span>
                    </span>
                  </label>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-charcoal/15 p-5">
                  <p className="font-medium text-charcoal">Payment method</p>
                  <p className="text-charcoal/60 mt-2 text-sm">
                    Cash on delivery is active for now. If you want, I can next connect Stripe, PayPal, CMI, or
                    another payment provider.
                  </p>
                </div>

                {submitError && (
                  <div className="mt-6 rounded-2xl border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 w-full sm:w-auto px-8 py-4 rounded-full bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors"
                >
                  {isSubmitting ? 'Saving order...' : 'Confirm order'}
                </button>
              </div>
            </form>
          </section>

          <aside className="lg:w-[420px]">
            <div className="lg:sticky lg:top-8 rounded-[2rem] bg-white border border-charcoal/10 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-charcoal/50">Order summary</p>
                  <h2 className="font-serif text-3xl text-charcoal mt-2">Your bag</h2>
                </div>
                <span className="text-sm font-medium text-charcoal/60">{cartCount} items</span>
              </div>

              <div className="mt-8 space-y-5">
                {detailedItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-20 rounded-2xl overflow-hidden bg-cream shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-charcoal">{item.name}</h3>
                          <p className="text-sm text-charcoal/50 mt-1">{item.category}</p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="font-medium text-charcoal">{item.lineTotal} MAD</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-charcoal/45 line-through">
                              {item.originalPrice * item.quantity} MAD
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-charcoal/60 mt-3 leading-6">{item.description}</p>
                      <p className="text-sm text-charcoal/45 mt-2">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

                <div className="mt-8 pt-6 border-t border-charcoal/10 space-y-3">
                <div className="flex items-center justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>{cartTotal} MAD</span>
                </div>
                <div className="flex items-center justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `${shippingCost} MAD`}</span>
                </div>
                <div className="flex items-center justify-between font-medium text-charcoal text-lg pt-3">
                  <span>Total</span>
                  <span>{total} MAD</span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-sm text-sage pt-2">Free delivery unlocked on orders from {FREE_SHIPPING_THRESHOLD} MAD.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
