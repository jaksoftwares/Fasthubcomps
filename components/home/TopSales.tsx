'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface TopSalesProps {
  initialProducts?: any[];
}

const TopSales: React.FC<TopSalesProps> = ({ initialProducts = [] }) => {
  const { addItem } = useCart();
  const deriveTopSales = (source: any[]) =>
    Array.isArray(source)
      ? source
          .map(p => ({
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

  const topSalesProducts = deriveTopSales(initialProducts);

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

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Background - Left Aligned */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white">
              Top Sales
            </h2>
          </div>
        </div>

        {/* Compact Product Grid - 6 columns on desktop, 2-3 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {topSalesProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl bg-white"
              >
                <CardContent className="p-2">
                  {/* Compact Image */}
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-32 overflow-hidden cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        loading={index < 6 ? 'eager' : 'lazy'}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                        {product.salesCount}
                      </Badge>
                    </div>
                  </Link>

                  {/* Compact Info */}
                  <div className="p-2">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:text-green-600 transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    {/* Compact Rating */}
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

                    {/* Compact Price */}
                    <div className="mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-500 line-through ml-1">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Compact Add to Cart */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 text-xs rounded-lg transition-all transform hover:scale-105"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        {/* Compact View All */}
        <div className="text-center mt-6">
          <Link href="/products">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-semibold rounded-lg"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View All Top Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSales;
