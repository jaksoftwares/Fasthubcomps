'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';
import Image from 'next/image';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext';

const ProductDetailPage = () => {
	const params = useParams();
	const rawSlug = (params as any).slug;
	const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) as string;
	const { addItem } = useCart();
	const { state: wishlistState, addWishlistItem, removeWishlistItem } = useWishlist();
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [product, setProduct] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [categories, setCategories] = useState<any[]>([]);

	React.useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await ProductsAPI.getBySlug(slug);
				setProduct(data);
			} catch (err: any) {
				setError(err?.message || 'Failed to fetch product');
			} finally {
				setLoading(false);
			}
		};
		if (slug) fetchProduct();
	}, [slug]);

	React.useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch('/api/categories');
				const data = await res.json();
				setCategories(Array.isArray(data) ? data : []);
			} catch {
				// fail silently
			}
		};
		fetchCategories();
	}, []);

	if (loading) {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	}
	if (error) {
		return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
	}
	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<Breadcrumb />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h1>
						<p className="text-gray-600 text-sm">The product you're looking for doesn't exist.</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/placeholder.png'];

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
		}).format(price);
	};

	const handleAddToCart = () => {
		for (let i = 0; i < quantity; i++) {
			addItem({
				id: product.id,
				name: product.name,
				price: product.price,
				image: images[0],
				category: product.category,
			});
		}
		toast.success(`Added ${quantity} item(s) to cart!`);
	};

	const isWishlisted = wishlistState.items.some((item) => item.id === product.id);
	const handleWishlist = () => {
		if (isWishlisted) {
			removeWishlistItem(product.id);
		} else {
			addWishlistItem({
				id: product.id,
				name: product.name,
				price: product.price,
				image: images[0],
				category: product.category ?? "",
			});
		}
	};

	const handleShare = async () => {
		try {
			const url = window.location.href;
			await navigator.clipboard.writeText(url);
			toast.success('Product link copied!');
		} catch (err) {
			toast.error('Failed to copy link.');
		}
	};

	const discountPercentage = product.old_price 
		? Math.round(((product.old_price - product.price) / product.old_price) * 100)
		: 0;

	const categoryId = product.category_id || product.category || 'Category';
	let categoryName = 'Category';
	if (categoryId) {
		const match = categories.find((c) => c.id === categoryId);
		categoryName = match?.name || categoryId;
	}
	const model = product.model || '';
	const tags: string[] = Array.isArray(product.tags) ? product.tags : [];
	const flags: string[] = Array.isArray(product.flags) ? product.flags : [];

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: categoryName, href: `/products?category=${categoryId}` },
		{ label: product.name, href: `/products/${product.slug}` },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<Breadcrumb items={breadcrumbItems} />
			
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
				{/* Main Product Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8">
					{/* Left Column - Product Images */}
					<div className="lg:sticky lg:top-24 lg:self-start">
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<div className="relative w-full aspect-square">
								<Image
									src={images[selectedImage] || '/placeholder.png'}
									alt={product.name}
									fill
									className="object-contain p-4 md:p-8"
									priority
								/>
								{discountPercentage > 0 && (
									<Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">
										-{discountPercentage}%
									</Badge>
								)}
							</div>
							
							{images.length > 1 && (
								<div className="flex gap-2 p-4 overflow-x-auto">
									{images.map((image: string, index: number) => (
										<button
											key={index}
											type="button"
											onClick={() => setSelectedImage(index)}
											className={`flex-shrink-0 border-2 rounded-md overflow-hidden transition-all ${
												selectedImage === index ? 'border-orange-500' : 'border-gray-200'
											}`}
										>
											<Image
												src={image || '/placeholder.png'}
												alt={`${product.name} ${index + 1}`}
												width={80}
												height={80}
												className="object-cover w-16 h-16 md:w-20 md:h-20"
											/>
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Product Info */}
					<div className="space-y-6">
						{/* Title and Rating */}
						<div>
							<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
								<span className="uppercase font-medium">{product.brand}</span>
								{model && <span>• {model}</span>}
							</div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
							<div className="flex flex-wrap items-center gap-4 mb-3">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-5 w-5 ${
												i < Math.floor(product.rating)
													? 'text-yellow-400 fill-current'
													: 'text-gray-300'
											}`}
										/>
									))}
								</div>
								<span className="text-sm text-gray-600">
									{product.rating} ({product.reviewCount} reviews)
								</span>
								<div className="flex items-center gap-2">
									<div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
									<span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
									</span>
								</div>
							</div>
						</div>

						{/* Pricing */}
						<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
							<div className="flex items-baseline gap-3 mb-2">
								<span className="text-3xl md:text-4xl font-bold text-gray-900">
									{formatPrice(product.price)}
								</span>
								{product.old_price && product.old_price > product.price && (
									<span className="text-xl text-gray-500 line-through">
										{formatPrice(product.old_price)}
									</span>
								)}
							</div>
							{discountPercentage > 0 && (
								<p className="text-sm text-green-600 font-medium">
									You save {formatPrice(product.old_price! - product.price)} ({discountPercentage}% off)
								</p>
							)}
						</div>

						{/* Actions */}
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row gap-3">
								<div className="flex items-center border-2 border-gray-300 rounded-lg">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-4 py-3 hover:bg-gray-100 text-lg font-medium"
									>
										−
									</button>
									<span className="px-6 py-3 border-x-2 border-gray-300 text-lg font-semibold min-w-[4rem] text-center">
										{quantity}
									</span>
									<button
										onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
										className="px-4 py-3 hover:bg-gray-100 text-lg font-medium"
									>
										+
									</button>
								</div>
								<Button
									onClick={handleAddToCart}
									disabled={product.stock === 0}
									className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3 h-auto flex-1"
								>
									<ShoppingCart className="h-5 w-5 mr-2" />
									Add to Cart
								</Button>
							</div>
							
							<div className="flex gap-3">
								<Button
									variant={isWishlisted ? "default" : "outline"}
									onClick={handleWishlist}
									className="flex-1 py-3 h-auto"
								>
									<Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
									{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
								</Button>
								<Button variant="outline" onClick={handleShare} className="flex-1 py-3 h-auto">
									<Share2 className="h-5 w-5 mr-2" />
									Share
								</Button>
							</div>
						</div>

						{/* Service Features */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
								<Truck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-semibold text-blue-900 mb-1">Free Delivery</p>
									<p className="text-xs text-blue-700">On orders over KSh 10,000</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
								<Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-sm font-semibold text-green-900 mb-1">Warranty Protected</p>
									<p className="text-xs text-green-700">Manufacturer warranty included</p>
								</div>
							</div>
						</div>

						{/* Tags and Flags */}
						{(tags.length > 0 || flags.length > 0) && (
							<div className="space-y-3 pt-4 border-t border-gray-200">
								{tags.length > 0 && (
									<div>
										<span className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Tags</span>
										<div className="flex flex-wrap gap-2">
											{tags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								)}
								{flags.length > 0 && (
									<div>
										<span className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Features</span>
										<div className="flex flex-wrap gap-2">
											{flags.map((flag) => (
												<span
													key={flag}
													className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
												>
													{flag}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Description and Details Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
					{/* Description - Takes 2 columns on desktop */}
					<div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
						<div className="prose prose-sm max-w-none">
							<p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
								{product.description || 'No description available for this product.'}
							</p>
							{product.short_specs && (
								<div className="mt-6 pt-6 border-t border-gray-200">
									<h3 className="text-lg font-semibold text-gray-900 mb-3">Key Specifications</h3>
									<p className="text-gray-700 whitespace-pre-line">{product.short_specs}</p>
								</div>
							)}
						</div>
					</div>

					{/* Product Details Sidebar */}
					<div className="bg-white p-6 md:p-8 rounded-lg shadow-sm space-y-6">
						<div>
							<h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
							<dl className="space-y-3">
								<div className="flex justify-between py-2 border-b border-gray-100">
									<dt className="font-medium text-gray-600">Brand</dt>
									<dd className="text-gray-900 font-semibold">{product.brand}</dd>
								</div>
								{model && (
									<div className="flex justify-between py-2 border-b border-gray-100">
										<dt className="font-medium text-gray-600">Model</dt>
										<dd className="text-gray-900 font-semibold">{model}</dd>
									</div>
								)}
								<div className="flex justify-between py-2 border-b border-gray-100">
									<dt className="font-medium text-gray-600">Category</dt>
									<dd className="text-gray-900 font-semibold">{categoryName}</dd>
								</div>
								<div className="flex justify-between py-2">
									<dt className="font-medium text-gray-600">Availability</dt>
									<dd className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? 'In Stock' : 'Out of Stock'}
									</dd>
								</div>
							</dl>
						</div>

						{product.warranty && (
							<div className="pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">Warranty Information</h3>
								<p className="text-sm text-gray-700 leading-relaxed">{product.warranty}</p>
							</div>
						)}
					</div>
				</div>

				{/* Related Products Section */}
				<div className="mt-12">
					<h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
					<RelatedProducts currentProduct={product} />
				</div>
			</main>
			<Footer />
		</div>
	);
};

const RelatedProducts = ({ currentProduct }: { currentProduct: any }) => {
	const [related, setRelated] = React.useState<any[]>([]);
	React.useEffect(() => {
		const fetchRelated = async () => {
			try {
				const all = await ProductsAPI.getAll();
				setRelated(
					all.filter((p: any) =>
						p.id !== currentProduct.id &&
						(p.category === currentProduct.category || p.brand === currentProduct.brand)
					).slice(0, 12)
				);
			} catch {}
		};
		fetchRelated();
	}, [currentProduct]);
	
	if (!related.length) return null;
	
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
			{related.map((product) => (
				<RelatedProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

const RelatedProductCard = ({ product }: { product: any }) => {
	const imageUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png';
	return (
		<Link href={`/products/${product.slug}`}>
			<Card className="group hover:shadow-lg transition-all duration-300 h-full">
				<CardContent className="p-0">
					<div className="relative overflow-hidden rounded-t-lg aspect-square">
						<Image
							src={imageUrl}
							alt={product.name}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</div>
					<div className="p-3">
						<h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
							{product.name}
						</h3>
						<span className="text-base font-bold text-orange-600">
							KSh {product.price.toLocaleString()}
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default ProductDetailPage;