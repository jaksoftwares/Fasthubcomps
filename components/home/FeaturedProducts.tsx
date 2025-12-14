'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface FeaturedProductsProps {
  initialProducts?: any[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ initialProducts = [] }) => {
  const { addItem } = useCart();
  const deriveFeatured = (source: any[]) =>
    Array.isArray(source)
      ? source
          .map(p => ({
            ...p,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
            badge: p.badge || 'Featured',
            rating: p.rating || 4.5,
            reviews: p.reviews || 0,
          }))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 18)
      : [];

  const featuredProducts = deriveFeatured(initialProducts);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-8 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Background - Left Aligned */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white">
              Featured Products
            </h2>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-2"
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start flex-shrink-0"
            >
              <Card className="group relative hover:shadow-lg transition-all duration-300 overflow-hidden border-0">
                <CardContent className="p-2">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-32 cursor-pointer">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 30vw, 18vw"
                          loading={index < 4 ? 'eager' : 'lazy'}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Compact Badge */}
                    <Badge className="absolute top-1 left-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-1.5 py-0.5 rounded">
                      {product.badge}
                    </Badge>

                    {/* Quick Actions */}
                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="bg-white hover:bg-orange-50 text-gray-700 p-1 rounded-full shadow-lg transition-all"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>
                      <Link href={`/products/${product.slug}`}>
                        <button className="bg-white hover:bg-orange-50 text-gray-700 p-1 rounded-full shadow-lg transition-all">
                          <Eye className="h-3 w-3" />
                        </button>
                      </Link>
                    </div>

                    {/* Discount */}
                    {product.originalPrice > product.price && (
                      <div className="absolute bottom-1 left-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Compact Product Info */}
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
                      <Link href={`/products/${product.slug}`} className="hover:text-blue-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-xs rounded-lg transition-all transform hover:scale-105"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Compact View All Button */}
        <div className="text-center mt-4">
          <Link href="/products">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-semibold rounded-lg"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-100 text-gray-700 rounded-full p-2 shadow-lg z-20"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-100 text-gray-700 rounded-full p-2 shadow-lg z-20"
        aria-label="Scroll Right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Hide Scrollbar Utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;