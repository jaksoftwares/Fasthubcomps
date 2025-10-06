'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Zap, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';

const BestDeals = () => {
  const { addItem } = useCart();
  const [bestDeals, setBestDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        // Calculate discount and sort by highest discount
        const deals = Array.isArray(data)
          ? data
              .filter(p => p.price && p.original_price && p.original_price > p.price)
              .map(p => ({
                ...p,
                discount: Math.round(((p.original_price - p.price) / p.original_price) * 100),
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
                timeLeft: 'Limited',
                rating: p.rating || 4.5,
                reviews: p.reviews || 0,
              }))
              .sort((a, b) => b.discount - a.discount)
              .slice(0, 4)
          : [];
        setBestDeals(deals);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
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
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Best Deals
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Limited time offers with incredible savings - grab them before they&apos;re gone!
          </p>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {bestDeals.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-orange-200">
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
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        -{product.discount}%
                      </Badge>
                      <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {product.timeLeft}
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
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Save {formatPrice(product.original_price - product.price)}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Grab Deal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestDeals;