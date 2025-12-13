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

async function getHomeProducts() {
	try {
		const res = await fetch('/api/products', {
			next: { revalidate: 60 },
		});
		if (!res.ok) return [];
		const data = await res.json();
		return Array.isArray(data) ? data : [];
	} catch {
		return [];
	}
}

export default async function Home() {
	const products = await getHomeProducts();

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<Breadcrumb />
			<main>
				{/* Best Deals - Limited time offers - PROMINENT */}
				<BestDeals initialProducts={products} />
				
				{/* Featured Products - Enhanced with wishlist & quick view */}
				<FeaturedProducts initialProducts={products} />
				
				{/* Top Sales - Best selling products */}
				<TopSales initialProducts={products} />
				
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
