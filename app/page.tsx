'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  User,
  X,
} from 'lucide-react';
import { SiteLogo } from '@/components/site-logo';
import { useCart } from '@/hooks/use-cart';
import { useProductCatalog } from '@/hooks/use-product-catalog';
import type { ProductCategory } from '@/lib/products';

const NAV_ITEMS: Array<{ label: string; filter: 'all' | ProductCategory }> = [
  { label: 'New Arrivals', filter: 'all' },
  { label: 'Soft Romance', filter: 'soft' },
  { label: 'Playful Icons', filter: 'bold' },
  { label: 'Nature Pop', filter: 'organic' },
];

const FILTERS: Array<{ label: string; value: 'all' | ProductCategory }> = [
  { label: 'All', value: 'all' },
  { label: 'Soft Romance', value: 'soft' },
  { label: 'Playful Icons', value: 'bold' },
  { label: 'Nature Pop', value: 'organic' },
];

export default function KassiLandingPage() {
  const products = useProductCatalog();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | ProductCategory>('all');
  const { detailedItems, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCollection = (filter: 'all' | ProductCategory) => {
    setSelectedFilter(filter);
    setIsMobileMenuOpen(false);

    const collectionSection = document.getElementById('new-arrivals');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts =
    selectedFilter === 'all'
      ? products
      : products.filter((product) => product.categoryId === selectedFilter);
  const softHighlight = products.find((product) => product.categoryId === 'soft') ?? products[0];
  const boldHighlight =
    products.find((product) => product.categoryId === 'bold') ?? products.find((product) => product.id !== softHighlight?.id);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-cream/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button className="md:hidden text-charcoal" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 md:flex-none text-center md:text-left">
            <SiteLogo className="inline-flex items-center justify-center md:justify-start" imageClassName="h-12 w-auto" priority />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToCollection(item.filter)}
                className="text-sm font-medium text-charcoal/80 hover:text-terracotta transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-5">
            <button className="text-charcoal hover:text-terracotta transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </button>
            <button
              className="text-charcoal hover:text-terracotta transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-cream flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <SiteLogo imageClassName="h-10 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-xl font-serif">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToCollection(item.filter)}
                  className="text-left text-charcoal hover:text-terracotta transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pb-8">
              <div className="flex items-center space-x-4 text-charcoal/70">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-cream shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-charcoal/10">
                <h2 className="font-serif text-2xl text-charcoal">Your Bag</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-charcoal hover:text-terracotta transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {detailedItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-charcoal/50 space-y-4">
                    <ShoppingBag className="w-12 h-12 opacity-20" />
                    <p>Your bag is empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-terracotta font-medium hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {detailedItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-charcoal/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-medium text-charcoal">{item.name}</h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-charcoal/40 hover:text-terracotta"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-charcoal/60 mt-1">{item.category}</p>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <div className="flex items-center border border-charcoal/20 rounded-full overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2 text-charcoal hover:bg-charcoal/5 transition-colors"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 text-sm font-medium text-charcoal">Qty: {item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-charcoal hover:bg-charcoal/5 transition-colors"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-medium text-charcoal">{item.lineTotal} MAD</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {detailedItems.length > 0 && (
                <div className="p-6 border-t border-charcoal/10 bg-cream">
                  <div className="flex justify-between items-center mb-4 text-charcoal">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-serif text-xl">{cartTotal} MAD</span>
                  </div>
                  <p className="text-xs text-charcoal/60 mb-6">
                    Shipping and taxes are calculated at checkout. Cash on delivery available.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-terracotta text-white py-4 rounded-full font-medium hover:bg-terracotta/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[851/315] bg-charcoal/5">
            <Image
              src="/banner/hero-banner.png"
              alt="Kassi ceramic mug collection banner"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent md:bg-gradient-to-r md:from-charcoal/80 md:via-charcoal/40 md:to-transparent" />

            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end md:justify-center items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl"
              >
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider uppercase rounded-full mb-6">
                  New Kassi Drop
                </span>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6">
                  KASSI:
                  <br />
                  Cute ceramic mugs at 150 DHS.
                </h1>
                <p className="text-white/80 text-lg md:text-xl mb-8 font-light max-w-md">
                  Discover the latest Kassi collection with playful, giftable mugs designed to brighten every coffee break.
                </p>
                <button
                  onClick={() => scrollToCollection('all')}
                  className="bg-terracotta text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-terracotta transition-colors duration-300 flex items-center gap-2"
                >
                  Shop The Collection <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-charcoal/10 bg-charcoal/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-8 text-charcoal/70">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-sage" />
            <span className="text-sm font-medium">Fast Delivery in Morocco</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-sage" />
            <span className="text-sm font-medium">Cash on Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-sage" />
            <span className="text-sm font-medium">Premium Ceramic Quality</span>
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Curated Collection</h2>
              <p className="text-charcoal/60 text-lg max-w-xl">
                Explore the current Kassi selection and shop every mug at one simple price: 150 DHS.
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-charcoal text-white'
                      : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="masonry">
            {filteredProducts.map((mug, index) => (
              <motion.div
                key={mug.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="masonry-item group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-charcoal/5 mb-4">
                  <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
                    {mug.images.map((image, imageIndex) => (
                      <div key={`${mug.id}-${imageIndex}`} className="relative aspect-[4/5] w-full shrink-0 snap-start">
                        <Image
                          src={image}
                          alt={`${mug.name} view ${imageIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  {mug.tag && (
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full ${
                          mug.tag === 'Low Stock' ? 'bg-terracotta text-white' : 'bg-white text-charcoal'
                        }`}
                      >
                        {mug.tag}
                      </span>
                    </div>
                  )}
                  {mug.images.length > 1 && (
                    <div className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 backdrop-blur-sm">
                      {mug.images.map((image, imageIndex) => (
                        <span
                          key={`${image}-${imageIndex}`}
                          className={`h-1.5 rounded-full ${imageIndex === 0 ? 'w-5 bg-charcoal' : 'w-1.5 bg-charcoal/35'}`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(mug.id);
                        setIsCartOpen(true);
                      }}
                      className="w-full bg-white/90 backdrop-blur-sm text-charcoal py-3 rounded-xl font-medium hover:bg-charcoal hover:text-white transition-colors"
                    >
                      Quick Add - {mug.price} MAD
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <h3 className="font-serif text-xl text-charcoal group-hover:text-terracotta transition-colors">
                        {mug.name}
                      </h3>
                      <p className="text-sm text-charcoal/50 mt-1">{mug.category}</p>
                    </div>
                    <span className="font-medium text-charcoal whitespace-nowrap">{mug.price} MAD</span>
                  </div>
                  <p className="text-sm text-charcoal/60 mt-3">{mug.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => scrollToCollection('soft')}
            className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] group cursor-pointer text-left bg-charcoal/5"
          >
            {softHighlight && (
              <Image
                src={softHighlight.image}
                alt={`${softHighlight.name} from the Kassi collection`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">Soft Romance</h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Floral, pink, and bow-inspired mugs made for gifting and soft table styling.
              </p>
              <span className="inline-flex items-center text-white font-medium gap-2 group-hover:gap-4 transition-all">
                Explore Collection <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => scrollToCollection('bold')}
            className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] group cursor-pointer text-left bg-charcoal/5"
          >
            {boldHighlight && (
              <Image
                src={boldHighlight.image}
                alt={`${boldHighlight.name} from the Kassi collection`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">Playful Icons</h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Character mugs and expressive shapes that give the collection a fun signature look.
              </p>
              <span className="inline-flex items-center text-white font-medium gap-2 group-hover:gap-4 transition-all">
                Explore Collection <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </motion.button>
        </div>
      </section>

      <footer className="bg-charcoal text-cream py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 text-sm font-medium text-cream/70">
            <a href="#" className="hover:text-terracotta transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-terracotta transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-terracotta transition-colors">
              Returns
            </a>
            <a href="#" className="hover:text-terracotta transition-colors">
              Shipping
            </a>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-cream hover:text-terracotta transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-cream hover:text-terracotta transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </a>
          </div>

          <SiteLogo className="inline-flex items-center rounded-full bg-cream px-4 py-2" imageClassName="h-10 w-auto" textClassName="font-serif text-3xl tracking-tight text-charcoal" />
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-cream/10 text-center text-sm text-cream/50">
          &copy; {new Date().getFullYear()} Kassi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
