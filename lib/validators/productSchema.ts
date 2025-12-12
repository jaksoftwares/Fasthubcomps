import { z } from 'zod';

// This schema represents the payload we accept from the admin UI
// when creating/updating a product. It is aligned with the Supabase
// `products` table columns and intentionally excludes DB-managed
// timestamps (created_at, updated_at).

export const productSchema = z.object({
  // Core identifiers
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().optional(),

  // Category relations (FKs)
  category_id: z.string().min(1, 'Category is required'),
  subcategory_id: z.string().nullable().optional(),

  // Branding / model
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().nullable().optional(),

  // Pricing & stock
  price: z.number().positive('Price must be positive'),
  old_price: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),

  // Media
  thumbnail: z.string().url('Thumbnail URL is invalid'),
  images: z
    .array(z.string().url('Image URL is invalid'))
    .min(1, 'At least one image is required'),

  // Content
  description: z.string().min(1, 'Description is required'),
  short_specs: z.string().optional(), // plain text/markup paragraph
  warranty: z.string().nullable().optional(),

  // Classification
  tags: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),

  // Visibility / lifecycle
  status: z.enum(['active', 'inactive']).default('active'),
});

export type ProductInput = z.infer<typeof productSchema>;