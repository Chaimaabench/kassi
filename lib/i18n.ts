export type Locale = 'en' | 'fr';

export const defaultLocale: Locale = 'en';

export function getLocaleFromPathname(pathname: string | null): Locale {
  return pathname?.startsWith('/fr') ? 'fr' : 'en';
}

export function localizePath(path: string, locale: Locale) {
  if (locale === 'fr') {
    return path === '/' ? '/fr' : `/fr${path}`;
  }

  if (path === '/fr') {
    return '/';
  }

  return path.replace(/^\/fr(?=\/|$)/, '') || '/';
}

export function stripLocalePrefix(pathname: string) {
  return pathname.replace(/^\/fr(?=\/|$)/, '') || '/';
}

export function getCategoryLabel(categoryId: 'soft' | 'bold' | 'organic', locale: Locale) {
  const labels = {
    en: {
      soft: 'Soft Romance',
      bold: 'Playful Icons',
      organic: 'Nature Pop',
    },
    fr: {
      soft: 'Romance Douce',
      bold: 'Icônes Ludiques',
      organic: 'Nature Pop',
    },
  } as const;

  return labels[locale][categoryId];
}

export function getTagLabel(tag: string | undefined, locale: Locale) {
  if (!tag) {
    return undefined;
  }

  const translatedTags: Record<string, { en: string; fr: string }> = {
    New: { en: 'New', fr: 'Nouveau' },
    Bestseller: { en: 'Bestseller', fr: 'Best-seller' },
    'Low Stock': { en: 'Low Stock', fr: 'Stock limité' },
  };

  return translatedTags[tag]?.[locale] ?? tag;
}

export const copy = {
  en: {
    nav: {
      newArrivals: 'New Arrivals',
      soft: 'Soft Romance',
      bold: 'Playful Icons',
      organic: 'Nature Pop',
      account: 'Account',
    },
    cart: {
      title: 'Your Bag',
      empty: 'Your bag is empty.',
      continue: 'Continue Shopping',
      subtotal: 'Subtotal',
      shippingTax: 'Shipping and taxes are calculated at checkout. Free shipping from',
      checkout: 'Checkout',
      qty: 'Qty',
      remove: 'Remove',
    },
    home: {
      badge: 'New Kassi Drop',
      heroTitle1: 'Tiny treasures made to be loved',
      heroTitle2: '(and gifted).',
      heroTextPrefix: 'Elevate your everyday',
      heroTextSuffix: 'starting at',
      heroTextOnly: 'only.',
      heroButton: 'Shop The Collection',
      freeShipping: 'Free shipping from',
      delivery: 'Fast Delivery in Morocco',
      cod: 'Cash on Delivery',
      quality: 'Premium Ceramic Quality',
      collectionTitle: 'Curated Collection',
      collectionText: 'Explore the current Kassi selection, compare promo prices, and swipe through every mug gallery.',
      all: 'All',
      viewDetails: 'View details',
      quickAdd: 'Quick Add',
      softTitle: 'Soft Romance',
      softText: 'Floral, pink, and bow-inspired mugs made for gifting and soft table styling.',
      boldTitle: 'Playful Icons',
      boldText: 'Character mugs and expressive shapes that give the collection a fun signature look.',
      exploreCollection: 'Explore Collection',
      contact: 'Contact',
      faq: 'FAQ',
      returns: 'Returns',
      shipping: 'Shipping',
      rights: 'All rights reserved.',
    },
    product: {
      back: 'Back to store',
      loading: 'Loading product details...',
      notFoundTitle: 'Product not found',
      notFoundText: 'This mug could not be found in the current collection.',
      backToCollection: 'Back to collection',
      off: 'off',
      freeShipping: 'Free shipping from',
      cod: 'Cash on delivery available across Morocco.',
      gallery: 'Swipe gallery with all available photos',
      standardShipping: 'Standard and express shipping options',
      leadCapture: 'Secure lead capture at checkout',
      addToBag: 'Add to bag',
      goToCheckout: 'Go to checkout',
    },
    checkout: {
      back: 'Back to shopping',
      badge: 'Checkout',
      title: 'Complete your Kassi order',
      intro: 'The front-end flow is now ready for major edits. You can keep this cash-on-delivery version or connect a payment provider later.',
      fastDelivery: 'Fast delivery',
      fastDeliveryText: 'Standard and express shipping options for Morocco.',
      cod: 'Cash on delivery',
      codText: 'Simple checkout now, payment gateway can be added later.',
      liveSummary: 'Live summary',
      liveSummaryText: 'Your order total updates instantly with the cart content.',
      customerDetails: 'Customer details',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone number',
      email: 'Email address',
      deliveryAddress: 'Delivery address',
      street: 'Street address',
      city: 'City',
      postalCode: 'Postal code',
      note: 'Order note',
      shippingPayment: 'Shipping and payment',
      freeShippingUnlocked: 'Free shipping is unlocked automatically from',
      casablancaDelivery: 'Casablanca delivery',
      standardDeliveryText: 'Delivery in Casablanca',
      outsideCasablancaDelivery: 'Outside Casablanca delivery',
      outsideCasablancaDeliveryText: 'Delivery outside Casablanca',
      paymentMethod: 'Payment method',
      paymentText: 'Cash on delivery is active for now. If you want, I can next connect Stripe, PayPal, CMI, or another payment provider.',
      saving: 'Saving order...',
      confirm: 'Confirm order',
      orderSummary: 'Order summary',
      yourBag: 'Your bag',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      free: 'Free',
      freeDeliveryUnlocked: 'Free delivery unlocked on orders from',
      loading: 'Loading your checkout...',
      orderReceived: 'Order received',
      thankYouPrefix: 'Thank you',
      thankYouSuffix: 'your checkout flow is now in place and your order summary has been captured on the front-end.',
      orderId: 'Order ID',
      items: 'Items',
      placedAt: 'Placed at',
      continueShopping: 'Continue shopping',
      updateProducts: 'Update products and prices',
      emptyTitle: 'Your bag is empty',
      emptyText: 'Add a few products from the collection first, then your checkout summary will appear here.',
      backToProducts: 'Back to products',
    },
  },
  fr: {
    nav: {
      newArrivals: 'Nouveautés',
      soft: 'Romance Douce',
      bold: 'Icônes Ludiques',
      organic: 'Nature Pop',
      account: 'Compte',
    },
    cart: {
      title: 'Votre panier',
      empty: 'Votre panier est vide.',
      continue: 'Continuer vos achats',
      subtotal: 'Sous-total',
      shippingTax: 'La livraison et les taxes sont calculées au checkout. Livraison offerte dès',
      checkout: 'Commander',
      qty: 'Qté',
      remove: 'Retirer',
    },
    home: {
      badge: 'Nouvelle collection Kassi',
      heroTitle1: 'De petits trésors faits pour être aimés',
      heroTitle2: '(et offerts).',
      heroTextPrefix: 'Sublimez votre quotidien',
      heroTextSuffix: 'à partir de',
      heroTextOnly: 'seulement.',
      heroButton: 'Découvrir la collection',
      freeShipping: 'Livraison offerte dès',
      delivery: 'Livraison rapide au Maroc',
      cod: 'Paiement à la livraison',
      quality: 'Céramique premium',
      collectionTitle: 'Collection sélectionnée',
      collectionText: 'Explorez la collection Kassi du moment et faites glisser chaque galerie produit.',
      all: 'Tout',
      viewDetails: 'Voir les détails',
      quickAdd: 'Ajout rapide',
      softTitle: 'Romance Douce',
      softText: 'Des mugs floraux, roses et ornés de nœuds, parfaits pour offrir et pour une table délicate.',
      boldTitle: 'Icônes Ludiques',
      boldText: 'Des mugs expressifs et originaux qui donnent à la collection une vraie personnalité.',
      exploreCollection: 'Explorer la collection',
      contact: 'Contact',
      faq: 'FAQ',
      returns: 'Retours',
      shipping: 'Livraison',
      rights: 'Tous droits réservés.',
    },
    product: {
      back: 'Retour à la boutique',
      loading: 'Chargement des détails du produit...',
      notFoundTitle: 'Produit introuvable',
      notFoundText: 'Ce mug est introuvable dans la collection actuelle.',
      backToCollection: 'Retour à la collection',
      off: 'de réduction',
      freeShipping: 'Livraison offerte dès',
      cod: 'Paiement à la livraison disponible partout au Maroc.',
      gallery: 'Galerie complète avec toutes les photos',
      standardShipping: 'Livraison standard et express disponibles',
      leadCapture: 'Enregistrement sécurisé du lead au checkout',
      addToBag: 'Ajouter au panier',
      goToCheckout: 'Aller au checkout',
    },
    checkout: {
      back: 'Retour aux achats',
      badge: 'Checkout',
      title: 'Finalisez votre commande Kassi',
      intro: 'Le parcours checkout est prêt pour évoluer. Vous pouvez garder cette version paiement à la livraison ou connecter un prestataire plus tard.',
      fastDelivery: 'Livraison rapide',
      fastDeliveryText: 'Options standard et express partout au Maroc.',
      cod: 'Paiement à la livraison',
      codText: 'Checkout simple pour le moment, un prestataire de paiement pourra être ajouté plus tard.',
      liveSummary: 'Résumé en direct',
      liveSummaryText: 'Votre total se met à jour instantanément avec le panier.',
      customerDetails: 'Informations client',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      email: 'Adresse e-mail',
      deliveryAddress: 'Adresse de livraison',
      street: 'Adresse',
      city: 'Ville',
      postalCode: 'Code postal',
      note: 'Note de commande',
      shippingPayment: 'Livraison et paiement',
      freeShippingUnlocked: 'La livraison offerte s’active automatiquement à partir de',
      casablancaDelivery: 'Livraison sur Casablanca',
      standardDeliveryText: 'Livraison dans Casablanca',
      outsideCasablancaDelivery: 'Livraison hors Casablanca',
      outsideCasablancaDeliveryText: 'Livraison en dehors de Casablanca',
      paymentMethod: 'Mode de paiement',
      paymentText: 'Le paiement à la livraison est actif pour le moment. Si vous voulez, je peux ensuite connecter Stripe, PayPal, CMI ou un autre prestataire.',
      saving: 'Enregistrement...',
      confirm: 'Confirmer la commande',
      orderSummary: 'Résumé de commande',
      yourBag: 'Votre panier',
      quantity: 'Quantité',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      total: 'Total',
      free: 'Offerte',
      freeDeliveryUnlocked: 'Livraison offerte débloquée à partir de',
      loading: 'Chargement du checkout...',
      orderReceived: 'Commande reçue',
      thankYouPrefix: 'Merci',
      thankYouSuffix: 'votre parcours checkout est en place et votre résumé de commande a bien été enregistré côté front.',
      orderId: 'Commande',
      items: 'Articles',
      placedAt: 'Créée le',
      continueShopping: 'Continuer vos achats',
      updateProducts: 'Mettre à jour les produits et prix',
      emptyTitle: 'Votre panier est vide',
      emptyText: 'Ajoutez d’abord quelques produits depuis la collection pour afficher votre résumé de commande ici.',
      backToProducts: 'Retour aux produits',
    },
  },
} as const;
