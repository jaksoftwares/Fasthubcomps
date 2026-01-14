import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fasthub.co.ke';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    rules: [
      {
        userAgent: '*',
        allow: isProduction ? '/' : [],
        disallow: isProduction
          ? ['/admin/', '/api/', '/checkout/', '/order-confirmation/', '/_next/']
          : ['/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: isProduction ? baseUrl : undefined,
  };
}