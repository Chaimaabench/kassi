export type ProductCategory = 'soft' | 'bold' | 'organic';

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  categoryId: ProductCategory;
  description: string;
  assetFolder: string;
  tag?: string;
};

export type ProductMediaEntry = {
  folderName: string;
  images: string[];
};

type ProductOverride = {
  category: string;
  categoryId: ProductCategory;
  description: string;
  tag?: string;
};

const DEFAULT_PRICE = 150;

const PRODUCT_OVERRIDES: Record<string, ProductOverride> = {
  'baby-mode-activated': {
    category: 'Playful Icons',
    categoryId: 'bold',
    description: 'A playful statement mug with a soft silhouette and a cheeky design that instantly stands out.',
    tag: 'New',
  },
  'bite-me-gentley': {
    category: 'Playful Icons',
    categoryId: 'bold',
    description: 'A cute bold design made for expressive coffee breaks and playful gifting moments.',
  },
  'calm-is-the-new-rich': {
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A calm, elegant mug designed for slow mornings, soft styling, and peaceful rituals.',
    tag: 'Bestseller',
  },
  'double-temptation': {
    category: 'Playful Icons',
    categoryId: 'bold',
    description: 'A fun character-forward mug with enough personality to become the star of the table.',
  },
  'eyes-that-dont-sleep': {
    category: 'Nature Pop',
    categoryId: 'organic',
    description: 'An expressive design with a dreamy edge, perfect for late-night tea and cozy desk setups.',
  },
  'gentle-days-only': {
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A soft and comforting mug style built for giftable, feminine, feel-good moments.',
  },
  'lucky-feels-like-this': {
    category: 'Nature Pop',
    categoryId: 'organic',
    description: 'A cheerful mug with an uplifting energy and an easy, everyday collectible feel.',
  },
  'silk-mood': {
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A polished mug design with smooth lines and a refined mood made for styled shelves.',
  },
  'sky-blush': {
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A light, airy mug with a dreamy palette and a gentle, romantic visual language.',
  },
  'the-gentle-escape': {
    category: 'Nature Pop',
    categoryId: 'organic',
    description: 'A serene collectible mug made for calm spaces, quiet routines, and beautiful gifting.',
    tag: 'Low Stock',
  },
};

export function normalizeProductKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getProductOverride(folderName: string): ProductOverride {
  return (
    PRODUCT_OVERRIDES[normalizeProductKey(folderName)] ?? {
      category: 'Soft Romance',
      categoryId: 'soft',
      description: `${folderName} is part of the latest Kassi mug collection, ready to be styled, gifted, and enjoyed every day.`,
    }
  );
}

export function buildProductsFromMedia(entries: ProductMediaEntry[]): Product[] {
  return entries.map((entry, index) => {
    const override = getProductOverride(entry.folderName);

    return {
      id: index + 1,
      slug: normalizeProductKey(entry.folderName),
      name: entry.folderName,
      price: DEFAULT_PRICE,
      image: entry.images[0] ?? '',
      images: entry.images,
      category: override.category,
      categoryId: override.categoryId,
      description: override.description,
      assetFolder: entry.folderName,
      tag: override.tag,
    };
  });
}
