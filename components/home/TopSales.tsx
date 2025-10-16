'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';

const TopSales = () => {
  const { addItem } = useCart();
  const [topSalesProducts, setTopSalesProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        const topSales = Array.isArray(data)
          ? data
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
              .slice(0, 8)
          : [];
        setTopSalesProducts(topSales);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch top sales');
      } finally {
        setLoading(false);
      }
    };
    fetchTopSales();
  }, []);

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

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center text-gray-600">Loading top sales...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            TOP SELLING PRODUCTS
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Top Sales</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our most popular and best-performing products trusted by customers across Kenya.
          </p>
        </div>

        {/* Scrollable Product Row */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {topSalesProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-72 snap-center"
              >
                <Card className="group border-0 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl">
                  <CardContent className="p-0">
                    {/* Image */}
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-52 bg-gray-100 overflow-hidden cursor-pointer">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 left-3 bg-green-600 text-white shadow-md">
                          {product.salesCount} Sold
                        </Badge>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hover:text-green-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-5 rounded-lg transition-all transform hover:scale-105"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="px-12 py-6 text-lg border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all"
            >
              View All Top Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSales;
