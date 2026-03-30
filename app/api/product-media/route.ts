import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { compareProductEntries } from '@/lib/product-media';
import type { ProductMediaEntry } from '@/lib/products';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function toPublicAssetUrl(...segments: string[]) {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

function isImageFile(fileName: string) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

export async function GET() {
  const productsDir = path.join(process.cwd(), 'public', 'products');
  const mediaEntries: ProductMediaEntry[] = [];

  try {
    const entries = await fs.readdir(productsDir, {withFileTypes: true});

    const folders = entries
      .filter((entry) => entry.isDirectory())
      .sort((left, right) => left.name.localeCompare(right.name, undefined, {numeric: true}));

    for (const folder of folders) {
      const folderPath = path.join(productsDir, folder.name);
      const folderEntries = await fs.readdir(folderPath, {withFileTypes: true});
      const folderImages = folderEntries
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right, undefined, {numeric: true}))
        .map((fileName) => toPublicAssetUrl('products', folder.name, fileName));

      if (folderImages.length > 0) {
        mediaEntries.push({
          folderName: folder.name,
          images: folderImages,
        });
      }
    }

    return NextResponse.json(mediaEntries.sort(compareProductEntries));
  } catch {
    return NextResponse.json(mediaEntries);
  }
}
