import type { Metadata } from 'next';

type OGType = 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
type TwitterCard = 'summary_large_image' | 'summary' | 'player' | 'app';

export interface RobotsDirectives {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  'max-image-preview'?: 'none' | 'standard' | 'large';
  'max-snippet'?: number;
  'max-video-preview'?: number;
}

export interface CustomMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: OGType;
  twitterCard?: TwitterCard;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  keywords?: string[];
  robots?: RobotsDirectives;
  isCore?: boolean;
}

const isProduction = process.env.NODE_ENV === 'production';

const defaultMetadata: CustomMetadata = {
  title: 'FastHub Computers - Unlocking your IT needs',
  description: 'Your one-stop shop for computers, laptops, phones and accessories. Professional repair services available.',
  keywords: ['computers', 'laptops', 'phones', 'accessories', 'repairs', 'IT services', 'FastHub'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: {
    index: isProduction,
    follow: isProduction,
  },
};

export function generateCanonicalUrl(pathname: string, searchParams?: URLSearchParams): string {
  const baseUrl = 'https://fasthub.co.ke';
  const url = new URL(pathname, baseUrl);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  // Strip tracking and unwanted query parameters
  const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'msclkid'];
  for (const param of trackingParams) {
    url.searchParams.delete(param);
  }

  return url.toString();
}

export function generateMetadata(overrides: Partial<CustomMetadata> = {}): Metadata {
  const merged = { ...defaultMetadata, ...overrides };

  // Merge robots directives
  merged.robots = { ...defaultMetadata.robots, ...merged.robots };

  // Safeguard: force index for core pages
  if (merged.isCore) {
    merged.robots.index = true;
  }

  return {
    title: merged.title,
    description: merged.description,
    keywords: merged.keywords,
    alternates: merged.canonical ? { canonical: merged.canonical } : undefined,
    robots: merged.robots,
    openGraph: {
      title: merged.ogTitle || merged.title,
      description: merged.ogDescription || merged.description,
      url: merged.ogUrl,
      type: merged.ogType,
      images: merged.ogImage ? [{ url: merged.ogImage, alt: merged.ogTitle || merged.title }] : undefined,
      siteName: 'FastHub Computers',
    },
    twitter: {
      card: merged.twitterCard,
      title: merged.twitterTitle || merged.title,
      description: merged.twitterDescription || merged.description,
      images: merged.twitterImage ? [merged.twitterImage] : undefined,
    },
  };
}

export function createPageMetadata(pathname: string, overrides: Partial<CustomMetadata> = {}): Metadata {
  return generateMetadata({
    canonical: generateCanonicalUrl(pathname),
    ...overrides,
  });
}