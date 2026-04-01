import type { ProductMediaEntry } from '@/lib/products';

function normalizeMediaKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function compareProductEntries(left: ProductMediaEntry, right: ProductMediaEntry) {
  return normalizeMediaKey(left.folderName).localeCompare(normalizeMediaKey(right.folderName), undefined, {
    numeric: true,
  });
}
