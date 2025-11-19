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
	const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
	const { addItem } = useCart();
	const { state: wishlistState, addWishlistItem, removeWishlistItem } = useWishlist();
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [product, setProduct] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	const discountPercentage = product.originalPrice 
		? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
		: 0;

	const features: string[] = Array.isArray(product.features)
		? product.features
		: typeof product.features === 'string' && product.features
			? [product.features]
			: [];

	// Generate breadcrumb items
	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: product.category || 'Category', href: `/products?category=${product.category}` },
		{ label: product.name, href: `/products/${product.slug}` },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<Breadcrumb items={breadcrumbItems} />
			
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Product Images - Much Smaller */}
					<div className="lg:col-span-4">
						<div className="sticky top-24">
							<div className="relative w-full h-64 md:h-80 bg-white rounded-lg overflow-hidden shadow-sm">
								<Image
									src={images[selectedImage] || '/placeholder.png'}
									alt={product.name}
									fill
									className="object-contain p-4"
								/>
								{discountPercentage > 0 && (
									<Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs">
										-{discountPercentage}%
									</Badge>
								)}
							</div>
							{images.length > 1 && (
								<div className="flex gap-2 mt-3 overflow-x-auto">
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
												width={50}
												height={50}
												className="object-cover w-12 h-12"
											/>
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Product Info & Description Combined */}
					<div className="lg:col-span-8 space-y-3">
						{/* Product Title & Basic Info */}
						<div>
							<div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
								<span className="uppercase">{product.brand}</span>
								<span>•</span>
								<span>SKU: {product.sku}</span>
							</div>
							<h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
							<div className="flex items-center gap-3 mb-2">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-3 w-3 ${
												i < Math.floor(product.rating)
													? 'text-yellow-400 fill-current'
													: 'text-gray-300'
											}`}
										/>
									))}
								</div>
								<span className="text-xs text-gray-600">
									{product.rating} ({product.reviewCount})
								</span>
								<div className="flex items-center gap-2 ml-auto">
									<div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
									<span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
									</span>
								</div>
							</div>
						</div>

						{/* Pricing & Actions Combined */}
						<div className="bg-gray-50 p-3 rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<div className="flex items-baseline gap-2">
										<span className="text-2xl font-bold text-gray-900">
											{formatPrice(product.price)}
										</span>
										{product.originalPrice && product.originalPrice > product.price && (
											<span className="text-sm text-gray-500 line-through">
												{formatPrice(product.originalPrice)}
											</span>
										)}
									</div>
									{discountPercentage > 0 && (
										<p className="text-xs text-green-600 font-medium">
											Save {formatPrice(product.originalPrice! - product.price)} ({discountPercentage}% off)
										</p>
									)}
								</div>
								<div className="flex items-center gap-2">
									<div className="flex items-center border rounded-md">
										<button
											onClick={() => setQuantity(Math.max(1, quantity - 1))}
											className="px-2 py-1 hover:bg-gray-100 text-sm"
										>
											-
										</button>
										<span className="px-3 py-1 border-x text-sm font-medium">{quantity}</span>
										<button
											onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
											className="px-2 py-1 hover:bg-gray-100 text-sm"
										>
											+
										</button>
									</div>
									<Button
										onClick={handleAddToCart}
										disabled={product.stock === 0}
										className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4"
									>
										<ShoppingCart className="h-4 w-4 mr-1" />
										Add to Cart
									</Button>
									<Button
										variant={isWishlisted ? "default" : "outline"}
										onClick={handleWishlist}
										className="px-3"
										size="sm"
									>
										<Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
									</Button>
									<Button variant="outline" onClick={handleShare} className="px-3" size="sm">
										<Share2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>

						{/* Description & Specs in 2 columns */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{/* Description */}
							<div className="bg-white p-3 rounded-lg shadow-sm">
								<h2 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase">Description</h2>
								<p className="text-xs text-gray-700 leading-relaxed line-clamp-4">{product.description || product.shortDescription}</p>
							</div>

							{/* Key Specifications */}
							<div className="bg-white p-3 rounded-lg shadow-sm">
								<h2 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase">Specifications</h2>
								<div className="space-y-1 text-xs">
									{product.processor && (
										<div className="flex justify-between">
											<span className="text-gray-600">Processor:</span>
											<span className="font-medium text-gray-900">{product.processor}</span>
										</div>
									)}
									{product.ram && (
										<div className="flex justify-between">
											<span className="text-gray-600">RAM:</span>
											<span className="font-medium text-gray-900">{product.ram}</span>
										</div>
									)}
									{product.storage && (
										<div className="flex justify-between">
											<span className="text-gray-600">Storage:</span>
											<span className="font-medium text-gray-900">{product.storage}</span>
										</div>
									)}
									{product.screen_size && (
										<div className="flex justify-between">
											<span className="text-gray-600">Screen:</span>
											<span className="font-medium text-gray-900">{product.screen_size}</span>
										</div>
									)}
									{product.warranty && (
										<div className="flex justify-between">
											<span className="text-gray-600">Warranty:</span>
											<span className="font-medium text-gray-900">{product.warranty}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Key Features - Compact */}
						{features.length > 0 && (
							<div className="bg-white p-3 rounded-lg shadow-sm">
								<h2 className="text-xs font-semibold text-gray-900 mb-2 uppercase">Key Features</h2>
								<div className="grid grid-cols-2 gap-x-4 gap-y-1">
									{features.slice(0, 6).map((feature: string, index: number) => (
										<div key={index} className="flex items-start gap-1.5 text-xs text-gray-700">
											<Check className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
											<span className="line-clamp-1">{feature}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Service Features - Compact */}
						<div className="grid grid-cols-2 gap-2">
							<div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
								<Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
								<div>
									<p className="text-xs font-medium text-blue-900">Free Delivery</p>
									<p className="text-xs text-blue-700">Orders over KSh 10K</p>
								</div>
							</div>
							<div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
								<Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
								<div>
									<p className="text-xs font-medium text-green-900">Warranty</p>
									<p className="text-xs text-green-700">Manufacturer warranty</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Related Products Section */}
				<div className="mt-12">
					<h2 className="text-xl font-bold mb-4">You May Also Like</h2>
					<RelatedProducts currentProduct={product} />
				</div>
			</main>
			<Footer />
		</div>
	);
};

// Related Products Component - Show more products
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
					).slice(0, 12) // Show 12 products
				);
			} catch {}
		};
		fetchRelated();
	}, [currentProduct]);
	
	if (!related.length) return null;
	
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
			<Card className="group hover:shadow-lg transition-shadow duration-300 h-full">
				<CardContent className="p-0">
					<div className="relative overflow-hidden rounded-t-lg">
						<Image
							src={imageUrl}
							alt={product.name}
							width={200}
							height={200}
							className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					</div>
					<div className="p-3">
						<h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
						<span className="text-sm font-bold text-orange-600">
							KSh {product.price.toLocaleString()}
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default ProductDetailPage;
