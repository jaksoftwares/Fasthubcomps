import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import TopSales from '@/components/home/TopSales';
import BestDeals from '@/components/home/BestDeals';
import Newsletter from '@/components/home/Newsletter';
import TrustBadges from '@/components/home/TrustBadges';
import CategoryStrips from '@/components/home/CategoryStrips';
import { unstable_cache } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export const revalidate = 60;

const getHomeProducts = unstable_cache(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data, error } = await supabase
			.from('products')
			.select('*')
			.order('created_at', { ascending: false });

		if (error || !Array.isArray(data)) {
			return [] as any[];
		}

		return data as any[];
	},
	['home-products'],
	{ revalidate: 60 }
);

function deriveDeals(source: any[]) {
	return Array.isArray(source)
		? (() => {
				const withComputed = source.map((p) => {
					const price = Number(p.price);
					const rawOriginal = p.old_price ?? p.original_price;
					const originalPrice = rawOriginal != null ? Number(rawOriginal) : null;
					const hasValidPrices =
						typeof price === 'number' &&
						!Number.isNaN(price) &&
						typeof originalPrice === 'number' &&
						!Number.isNaN(originalPrice) &&
						originalPrice > price;

					const discount = hasValidPrices
						? Math.round(((originalPrice! - price) / originalPrice!) * 100)
						: 0;

					return {
						...p,
						price,
						original_price: hasValidPrices ? originalPrice : null,
						discount,
						image:
							Array.isArray(p.images) && p.images.length > 0
								? p.images[0]
								: '/placeholder.png',
						timeLeft: 'Limited',
						rating: p.rating || 4.5,
						reviews: p.reviews || 0,
					};
				});

				const tagged = withComputed.filter((p) => {
					const tags = Array.isArray(p.tags) ? p.tags : [];
					return tags.includes('best-deals');
				});

				const base = tagged.length > 0 ? tagged : withComputed;

				return base
					.filter((p) => typeof p.discount === 'number')
					.sort((a, b) => (b.discount || 0) - (a.discount || 0))
					.slice(0, 18);
			})()
		: [];
}

function deriveFeatured(source: any[]) {
	return Array.isArray(source)
		? source
				.map((p) => ({
					...p,
					image:
						Array.isArray(p.images) && p.images.length > 0
							? p.images[0]
							: '/placeholder.png',
					badge: p.badge || 'Featured',
					rating: p.rating || 4.5,
					reviews: p.reviews || 0,
				}))
				.sort((a, b) => (b.rating || 0) - (a.rating || 0))
				.slice(0, 18)
		: [];
}

function deriveTopSales(source: any[]) {
	return Array.isArray(source)
		? source
				.map((p) => ({
					...p,
					image:
						Array.isArray(p.images) && p.images.length > 0
							? p.images[0]
							: '/placeholder.png',
					salesCount: p.salesCount || p.stock || 0,
					rating: p.rating || 4.5,
					reviews: p.reviews || 0,
				}))
				.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
				.slice(0, 18)
		: [];
}

export default async function Home() {
	const products = await getHomeProducts();

	const [bestDeals, featuredProducts, topSalesProducts] = await Promise.all([
		Promise.resolve(deriveDeals(products)),
		Promise.resolve(deriveFeatured(products)),
		Promise.resolve(deriveTopSales(products)),
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<Breadcrumb showOnHome />
			<main>
				{/* Best Deals - Limited time offers - PROMINENT */}
				<BestDeals initialProducts={bestDeals} />
				
				{/* Featured Products - Enhanced with wishlist & quick view */}
				<FeaturedProducts initialProducts={featuredProducts} />
				
				{/* Top Sales - Best selling products */}
				<TopSales initialProducts={topSalesProducts} />
				
				{/* Shop by Category - Enhanced with better visuals */}
				<Categories />
				
				{/* Key Product Categories - Compact strips per category */}
				<CategoryStrips initialProducts={products} />
				
				{/* Trust Badges & Brand Partners */}
				<TrustBadges />
				
				{/* Newsletter Subscription */}
				<Newsletter />
			</main>
			<Footer />
		</div>
	);
}

