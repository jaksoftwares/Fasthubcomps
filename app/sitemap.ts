import type { MetadataRoute } from 'next';

interface Product {
  id: string;
  slug: string;
  updatedAt: string;
  images?: string[];
}

interface Category {
  id: string;
  slug: string;
  updatedAt: string;
}

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fasthub.co.ke';
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
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://fasthub.co.ke'}/api/products`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (productsResponse.ok) {
      const products: Product[] = await productsResponse.json();

      for (const product of products) {
        if (product.slug) { // Ensure slug exists
          urls.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
            images: Array.isArray(product.images) ? product.images.filter(Boolean) : undefined,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  try {
    // Dynamic categories
    const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://fasthub.co.ke'}/api/categories`, {
      next: { revalidate: 3600 },
    });

    if (categoriesResponse.ok) {
      const categories: Category[] = await categoriesResponse.json();

      for (const category of categories) {
        if (category.slug) {
          urls.push({
            url: `${baseUrl}/products?category=${category.slug}`, // Assuming category filter
            lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
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