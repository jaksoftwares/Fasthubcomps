'use client';

import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Heart, Share2, Shield, ZoomIn } from 'lucide-react';
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
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<Breadcrumb />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 animate-pulse">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6">
						<div className="lg:sticky lg:top-24 lg:self-start">
							<div className="bg-white rounded-lg shadow-sm overflow-hidden">
								<div className="w-full h-64 md:h-80 bg-gray-200" />
								<div className="flex gap-2 p-3">
									{Array.from({ length: 4 }).map((_, i) => (
										<div key={i} className="w-14 h-14 rounded-md bg-gray-200" />
									))}
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<div className="h-4 w-24 bg-gray-200 rounded" />
								<div className="h-6 w-3/4 bg-gray-200 rounded" />
								<div className="flex items-center gap-3">
									<div className="flex gap-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<div key={i} className="h-4 w-4 bg-gray-200 rounded" />
										))}
									</div>
									<div className="h-4 w-20 bg-gray-200 rounded" />
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
								<div className="h-7 w-32 bg-gray-200 rounded" />
								<div className="h-4 w-28 bg-gray-200 rounded" />
							</div>

							<div className="space-y-3">
								<div className="flex flex-col sm:flex-row gap-2">
									<div className="h-11 w-full sm:w-36 bg-gray-200 rounded-lg" />
									<div className="h-11 flex-1 bg-gray-200 rounded-lg" />
								</div>
								<div className="flex gap-2">
									<div className="h-10 flex-1 bg-gray-200 rounded-lg" />
									<div className="h-10 flex-1 bg-gray-200 rounded-lg" />
								</div>
							</div>
						</div>
					</div>

					<div className="mt-4 bg-white rounded-lg shadow-sm">
						<div className="h-10 border-b border-gray-200 bg-gray-50" />
						<div className="p-4 md:p-6 space-y-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-4 w-full bg-gray-200 rounded" />
							))}
						</div>
					</div>
				</main>
				<Footer />
			</div>
		);
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

	// Normalize rating values for consistent display
	const ratingValue: number = typeof product.rating === 'number' && product.rating > 0 ? product.rating : 4.5;
	const reviewCount: number = typeof product.reviewCount === 'number' && product.reviewCount >= 0 ? product.reviewCount : 0;

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
			
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-6">
				{/* Main Product Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6">
					{/* Left Column - Product Images */}
					<div className="lg:sticky lg:top-24 lg:self-start">
						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<ImageMagnifier
								src={images[selectedImage] || '/placeholder.png'}
								alt={product.name}
								discount={discountPercentage}
							/>
							
							{images.length > 1 && (
								<div className="flex gap-2 p-3 overflow-x-auto">
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
												width={60}
												height={60}
												className="object-cover w-14 h-14"
											/>
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Product Info */}
					<div className="space-y-4">
						{/* Title and Rating */}
						<div>
							<div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
								<span className="uppercase font-medium">{product.brand}</span>
								{model && <span>• {model}</span>}
							</div>
							<h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
							<div className="flex flex-wrap items-center gap-3 mb-2">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(ratingValue)
													? 'text-yellow-400 fill-current'
													: 'text-gray-300'
											}`}
										/>
									))}
								</div>
								<span className="text-xs text-gray-600">
									{ratingValue.toFixed(1)} ({reviewCount} reviews)
								</span>
								<div className="flex items-center gap-1.5">
									<div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
									<span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
										{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
									</span>
								</div>
							</div>
						</div>

						{/* Pricing */}
						<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<div className="flex items-baseline gap-2 mb-1.5">
								<span className="text-2xl md:text-3xl font-bold text-gray-900">
									{formatPrice(product.price)}
								</span>
								{product.old_price && product.old_price > product.price && (
									<span className="text-lg text-gray-500 line-through">
										{formatPrice(product.old_price)}
									</span>
								)}
							</div>
							{discountPercentage > 0 && (
								<p className="text-xs text-green-600 font-medium">
									You save {formatPrice(product.old_price! - product.price)} ({discountPercentage}% off)
								</p>
							)}
						</div>

						{/* Actions */}
						<div className="space-y-3">
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="flex items-center border-2 border-gray-300 rounded-lg">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-3 py-2 hover:bg-gray-100 text-base font-medium"
									>
										−
									</button>
									<span className="px-4 py-2 border-x-2 border-gray-300 text-base font-semibold min-w-[3rem] text-center">
										{quantity}
									</span>
									<button
										onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
										className="px-3 py-2 hover:bg-gray-100 text-base font-medium"
									>
										+
									</button>
								</div>
								<Button
									onClick={handleAddToCart}
									disabled={product.stock === 0}
									className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 h-auto flex-1"
								>
									<ShoppingCart className="h-4 w-4 mr-1.5" />
									Add to Cart
								</Button>
							</div>
							
							<div className="flex gap-2">
								<Button
									variant={isWishlisted ? "default" : "outline"}
									onClick={handleWishlist}
									className="flex-1 py-2.5 h-auto text-sm"
								>
									<Heart className={`h-4 w-4 mr-1.5 ${isWishlisted ? 'fill-current' : ''}`} />
									{isWishlisted ? 'Wishlisted' : 'Wishlist'}
								</Button>
								<Button variant="outline" onClick={handleShare} className="flex-1 py-2.5 h-auto text-sm">
									<Share2 className="h-4 w-4 mr-1.5" />
									Share
								</Button>
							</div>
						</div>

						{/* Warranty Badge */}
						{product.warranty && (
							<div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100 w-fit">
								<Shield className="h-4 w-4 text-green-600" />
								<span className="text-xs font-medium text-green-900">Warranty Included</span>
							</div>
						)}

						{/* Tags and Flags */}
						{(tags.length > 0 || flags.length > 0) && (
							<div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-200">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
									>
										{tag}
									</span>
								))}
								{flags.map((flag) => (
									<span
										key={flag}
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
									>
										{flag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Tabbed Description and Details Section */}
				<div className="bg-white rounded-lg shadow-sm mb-6">
					<Tabs productDescription={product.description} shortSpecs={product.short_specs} warranty={product.warranty} />
				</div>

				{/* Related Products Section */}
				<div className="mt-8">
					<h2 className="text-xl font-bold mb-4">You May Also Like</h2>
					<RelatedProducts currentProduct={product} />
				</div>
			</main>
			<Footer />
		</div>
	);
};

// Image Magnifier Component with Hover Zoom Effect
const ImageMagnifier = ({ src, alt, discount }: { src: string; alt: string; discount: number }) => {
	const [showMagnifier, setShowMagnifier] = useState(false);
	const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
	const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
	const imgRef = useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		setShowMagnifier(true);
	};

	const handleMouseLeave = () => {
		setShowMagnifier(false);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!imgRef.current) return;

		const rect = imgRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setMagnifierPosition({ x, y });

		if (imgSize.width === 0) {
			setImgSize({ width: rect.width, height: rect.height });
		}
	};

	const magnifierSize = 150;
	const zoomLevel = 2.5;

	return (
		<div
			ref={imgRef}
			className="relative w-full h-64 md:h-80 bg-white cursor-crosshair overflow-hidden"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
		>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-contain p-4"
				priority
			/>
			
			{discount > 0 && (
				<Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-0.5">
					-{discount}%
				</Badge>
			)}

			<div className="absolute bottom-3 right-3 bg-black/60 text-white rounded-full p-1.5">
				<ZoomIn className="h-4 w-4" />
			</div>

			{showMagnifier && (
				<div
					className="absolute border-2 border-gray-400 bg-white rounded-full pointer-events-none shadow-xl"
					style={{
						width: `${magnifierSize}px`,
						height: `${magnifierSize}px`,
						left: `${magnifierPosition.x - magnifierSize / 2}px`,
						top: `${magnifierPosition.y - magnifierSize / 2}px`,
						backgroundImage: `url(${src})`,
						backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
						backgroundPositionX: `-${magnifierPosition.x * zoomLevel - magnifierSize / 2}px`,
						backgroundPositionY: `-${magnifierPosition.y * zoomLevel - magnifierSize / 2}px`,
						backgroundRepeat: 'no-repeat',
					}}
				/>
			)}
		</div>
	);
};

// Tabs Component for Description, Specs, and Warranty
const Tabs = ({ productDescription, shortSpecs, warranty }: { productDescription: string; shortSpecs?: string; warranty?: string }) => {
	const [activeTab, setActiveTab] = useState(shortSpecs ? 'specs' : 'description');

	return (
		<div>
			<div className="border-b border-gray-200">
				<div className="flex overflow-x-auto">
					{shortSpecs && (
						<button
							onClick={() => setActiveTab('specs')}
							className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
								activeTab === 'specs'
									? 'border-orange-500 text-orange-600'
									: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
							}`}
						>
							Specifications
						</button>
					)}
					<button
						onClick={() => setActiveTab('description')}
						className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
							activeTab === 'description'
								? 'border-orange-500 text-orange-600'
								: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
						}`}
					>
						Description
					</button>
					{warranty && (
						<button
							onClick={() => setActiveTab('warranty')}
							className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
								activeTab === 'warranty'
									? 'border-orange-500 text-orange-600'
									: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
							}`}
						>
							Warranty
						</button>
					)}
				</div>
			</div>

			<div className="p-4 md:p-6">
				{activeTab === 'description' && (
					<div className="prose prose-sm max-w-none">
						<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
							{productDescription || 'No description available for this product.'}
						</p>
					</div>
				)}
				
				{activeTab === 'specs' && shortSpecs && (
					<div className="prose prose-sm max-w-none">
						<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{shortSpecs}</p>
					</div>
				)}
				
				{activeTab === 'warranty' && warranty && (
					<div className="prose prose-sm max-w-none">
						<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{warranty}</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Related Products Component
const RelatedProducts = ({ currentProduct }: { currentProduct: any }) => {
	const [related, setRelated] = React.useState<any[]>([]);
	React.useEffect(() => {
		const fetchRelated = async () => {
			try {
				const all = await ProductsAPI.getAll();
				const currentCategory = currentProduct.category_id || currentProduct.category || '';
				const currentBrand = currentProduct.brand || '';
				const currentTags: string[] = Array.isArray(currentProduct.tags)
					? currentProduct.tags
					: typeof currentProduct.tags === 'string'
						? [currentProduct.tags]
						: [];

				const scored = all
					.filter((p: any) => p.id !== currentProduct.id)
					.map((p: any) => {
						const cat = p.category_id || p.category || '';
						const brand = p.brand || '';
						const tags: string[] = Array.isArray(p.tags)
							? p.tags
							: typeof p.tags === 'string'
								? [p.tags]
								: [];

						let score = 0;
						if (currentCategory && cat && cat === currentCategory) score += 3; // strong boost
						if (currentBrand && brand && brand === currentBrand) score += 2;
						if (currentTags.length && tags.length) {
							const overlap = tags.filter((t) => currentTags.includes(t));
							if (overlap.length > 0) score += Math.min(2, overlap.length); // up to +2
						}

						// small random jitter so lists aren't always identical for ties
						const jitter = Math.random() * 0.3;
						return { product: p, score: score + jitter };
					})
					.filter((item) => item.score > 0)
					.sort((a, b) => b.score - a.score)
					.slice(0, 12)
					.map((item) => item.product);

				setRelated(scored);
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

// Related Product Card Component
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
					<div className="p-2.5">
						<h3 className="text-xs font-medium text-gray-900 mb-1.5 line-clamp-2 min-h-[2rem]">
							{product.name}
						</h3>
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