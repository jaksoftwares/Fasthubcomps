import { Metadata } from 'next';

type Props = {
  params: Promise<any>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id || 'default';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fasthub.co.ke';

  try {
    // Fetch product data on the server
    const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return {
        title: 'Product Not Found | FastHub Computers',
      };
    }
    
    const product = await res.json();
    if (!product || !product.id) {
      return {
        title: 'Product Not Found | FastHub Computers',
      };
    }

    const title = `${product.name} | FastHub Computers`;
    const description = (product.description || product.shortDescription || `Buy ${product.name} at the best price in Kenya from FastHub Computers. Fast delivery and reliable support.`).substring(0, 160);
    const images = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : ['/fasthub-logo.jpg'];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/products/${id}`,
        siteName: 'FastHub Computers',
        images: images.map((img: string) => ({ url: img })),
        locale: 'en_KE',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images,
      },
      alternates: {
        canonical: `${baseUrl}/products/${id}`,
      }
    };
  } catch (error) {
    return {
      title: 'Product | FastHub Computers',
    };
  }
}

export default function ProductIdLayout({ children }: Props) {
  return <>{children}</>;
}
