// utils/slugify.ts

/**
 * Converts a string into a URL-friendly slug.
 * Examples:
 *   "Cool Product Name" → "cool-product-name"
 *   "Men's Shoes (2025)" → "mens-shoes-2025"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // normalize accents like é → e
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with -
    .replace(/^-+|-+$/g, ""); // remove leading/trailing dashes
}
