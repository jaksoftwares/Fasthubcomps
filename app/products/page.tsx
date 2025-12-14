import { Suspense } from 'react';
import ProductsPageClient from './ProductsPageClient';
import { unstable_cache } from 'next/cache';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export const revalidate = 60;

const getAllProducts = unstable_cache(
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
	['products-page-all'],
	{ revalidate: 60 }
);

export default async function ProductsPage() {
	const raw = await getAllProducts();

	const initialProducts = Array.isArray(raw)
		? raw.map((p: any) => ({
				id: p.id || '',
				slug: p.slug || p.id || '',
				name: p.name || '',
				price: Number(p.price) || 0,
				original_price: Number(p.old_price) || Number(p.price) || 0,
				images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/placeholder.png'],
				category: p.category_id || '',
				brand: p.brand || 'Generic',
				rating: Number(p.rating) || 4.5,
				reviews: Number(p.reviews) || Math.floor(Math.random() * 500) + 10,
				is_featured: Boolean(p.is_featured) || false,
				is_bestseller: Boolean(p.is_bestseller) || false,
				is_new: Boolean(p.is_new) || false,
				discount: Number(p.discount) || 0,
			}))
		: [];

	return (
		<Suspense fallback={null}>
			<ProductsPageClient initialProducts={initialProducts} />
		</Suspense>
	);
}