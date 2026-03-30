import { normalizeProductKey, type ProductMediaEntry } from '@/lib/products';

export function compareProductEntries(left: ProductMediaEntry, right: ProductMediaEntry) {
  return normalizeProductKey(left.folderName).localeCompare(normalizeProductKey(right.folderName), undefined, {
    numeric: true,
  });
}
