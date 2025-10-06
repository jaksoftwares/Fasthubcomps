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
        // Sort by salesCount (if available) or stock, pick top 4
        const topSales = Array.isArray(data)
          ? data
              .map(p => ({
                ...p,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
                salesCount: p.salesCount || p.stock || 0,
                rating: p.rating || 4.5,
                reviews: p.reviews || 0,
              }))
              .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
              .slice(0, 4)
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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Top Sales
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our best-selling products loved by customers across Kenya
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {topSalesProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        #{product.salesCount} Sold
                      </Badge>
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
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
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="px-8">
              View All Top Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSales;