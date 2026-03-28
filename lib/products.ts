export type ProductCategory = 'soft' | 'bold' | 'organic';

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId: ProductCategory;
  description: string;
  tag?: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: 'pink-bow-mug',
    name: 'Pink Bow Mug',
    price: 150,
    image: '/products/bow-mug-main.png',
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A glossy cream mug finished with a statement pink bow for soft, feminine coffee moments.',
    tag: 'Bestseller',
  },
  {
    id: 2,
    slug: 'kitty-mug',
    name: 'Kitty Mug',
    price: 150,
    image: '/products/kitty-mug.png',
    category: 'Playful Icons',
    categoryId: 'bold',
    description: 'A cute character mug with a red handle and glossy details made to stand out instantly.',
  },
  {
    id: 3,
    slug: 'avocado-mug',
    name: 'Avocado Mug',
    price: 150,
    image: '/products/avocado-mug.png',
    category: 'Nature Pop',
    categoryId: 'organic',
    description: 'A smiling avocado design with a rounded silhouette and a playful ceramic finish.',
    tag: 'Low Stock',
  },
  {
    id: 4,
    slug: 'flower-bloom-cup',
    name: 'Flower Bloom Cup',
    price: 150,
    image: '/products/flower-cup.png',
    category: 'Soft Romance',
    categoryId: 'soft',
    description: 'A floral sculpted cup in soft pink ceramic designed for gifting and cozy table styling.',
  },
  {
    id: 5,
    slug: 'pearl-heart-mug',
    name: 'Pearl Heart Mug',
    price: 150,
    image: '/products/heart-mug.png',
    category: 'Playful Icons',
    categoryId: 'bold',
    description: 'A peach ceramic mug with a deep red heart and beaded handle for a romantic statement look.',
  },
];

export function getProductById(id: number) {
  return products.find((product) => product.id === id);
}
