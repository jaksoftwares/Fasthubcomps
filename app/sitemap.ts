import type { MetadataRoute } from 'next';

interface Product {
  id: string;
  slug: string;
  updatedAt: string;
  images?: Array<{ url: string; alt?: string }>;
}

interface Category {
  id: string;
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fasthub.co.ke';
  const isProduction = process.env.NODE_ENV === 'production';

  // In non-production, return empty sitemap to prevent indexing
  if (!isProduction) {
    return [];
  }

  const urls: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/products', priority: 0.8, changefreq: 'daily' as const },
    { path: '/repairs', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/orders', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/wishlist', priority: 0.5, changefreq: 'monthly' as const },
  ];

  for (const page of staticPages) {
    urls.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  }

  try {
    // Dynamic products
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (productsResponse.ok) {
      const products: Product[] = await productsResponse.json();

      for (const product of products) {
        if (product.slug) { // Ensure slug exists
          urls.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(product.updatedAt),
            changeFrequency: 'monthly',
            priority: 0.6,
            images: product.images?.map(img => img.url),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  try {
    // Dynamic categories
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories`, {
      next: { revalidate: 3600 },
    });

    if (categoriesResponse.ok) {
      const categories: Category[] = await categoriesResponse.json();

      for (const category of categories) {
        if (category.slug) {
          urls.push({
            url: `${baseUrl}/products?category=${category.slug}`, // Assuming category filter
            lastModified: new Date(category.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // Remove duplicates (safeguard)
  const uniqueUrls = urls.filter((url, index, self) =>
    index === self.findIndex(u => u.url === url.url)
  );

  return uniqueUrls;
}