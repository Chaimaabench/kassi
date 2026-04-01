import productConfigs from '@/data/products.json';

export type ProductCategory = 'soft' | 'bold' | 'organic';

export type Product = {
  id: number;
  slug: string;
  name: string;
  nameFr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: ProductCategory;
  description: string;
  descriptionFr?: string;
  assetFolder: string;
  tag?: string;
};

export type ProductMediaEntry = {
  folderName: string;
  images: string[];
};

export type ProductConfig = {
  assetFolder: string;
  name?: string;
  nameFr?: string;
  price: number;
  originalPrice?: number;
  categoryId: ProductCategory;
  description: string;
  descriptionFr?: string;
  tag?: string;
};

const DEFAULT_PRODUCT_CONFIG: Omit<ProductConfig, 'assetFolder'> = {
  name: undefined,
  price: 150,
  categoryId: 'soft',
  description: 'This mug is part of the latest Kassi collection, ready to be styled, gifted, and enjoyed every day.',
  descriptionFr: 'Ce mug fait partie de la dernière collection Kassi, prêt à être mis en valeur, offert et apprécié au quotidien.',
};

function asProductConfigMap(configs: ProductConfig[]) {
  const configMap = new Map<string, ProductConfig>();

  configs.forEach((config) => {
    configMap.set(normalizeProductKey(config.assetFolder), config);
  });

  return configMap;
}

export function normalizeProductKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductConfigs() {
  return productConfigs as ProductConfig[];
}

function getProductConfig(folderName: string) {
  const configMap = asProductConfigMap(getProductConfigs());
  const config = configMap.get(normalizeProductKey(folderName));

  if (config) {
    return config;
  }

  return {
    ...DEFAULT_PRODUCT_CONFIG,
    assetFolder: folderName,
    name: folderName,
    description: `${folderName} is part of the latest Kassi collection, ready to be styled, gifted, and enjoyed every day.`,
    descriptionFr: `${folderName} fait partie de la dernière collection Kassi, prêt à être mis en valeur, offert et apprécié au quotidien.`,
  };
}

export function buildProductsFromMedia(entries: ProductMediaEntry[]): Product[] {
  const configs = getProductConfigs();
  const configMap = asProductConfigMap(configs);

  const sortedEntries = [...entries].sort((left, right) => {
    const leftIndex = configs.findIndex(
      (config) => normalizeProductKey(config.assetFolder) === normalizeProductKey(left.folderName),
    );
    const rightIndex = configs.findIndex(
      (config) => normalizeProductKey(config.assetFolder) === normalizeProductKey(right.folderName),
    );

    if (leftIndex === -1 && rightIndex === -1) {
      return left.folderName.localeCompare(right.folderName, undefined, { numeric: true });
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });

  return sortedEntries.map((entry, index) => {
    const config = configMap.get(normalizeProductKey(entry.folderName)) ?? getProductConfig(entry.folderName);

    return {
      id: index + 1,
      slug: normalizeProductKey(entry.folderName),
      name: config.name ?? entry.folderName,
      nameFr: config.nameFr,
      price: config.price,
      originalPrice: config.originalPrice,
      image: entry.images[0] ?? '',
      images: entry.images,
      categoryId: config.categoryId,
      description: config.description,
      descriptionFr: config.descriptionFr,
      assetFolder: entry.folderName,
      tag: config.tag,
    };
  });
}
