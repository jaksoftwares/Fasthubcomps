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
import { motion } from 'framer-motion';

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
        const deals = Array.isArray(data)
          ? data
              .filter(p => p.price && p.original_price && p.original_price > p.price)
              .map(p => ({
                ...p,
                discount: Math.round(((p.original_price - p.price) / p.original_price) * 100),
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
                timeLeft: 'Ends soon!',
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);

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
    <section className="relative py-20 bg-gradient-to-br from-[#fff5ef] via-[#fff1e5] to-[#ffe5d2] overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-30 bg-[url('/patterns/sales-bg.svg')] bg-cover bg-center mix-blend-overlay"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Zap className="h-4 w-4 mr-2" />
            HOT DEALS OF THE WEEK
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-orange-600 to-red-500 text-transparent bg-clip-text">
              Best Deals
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Limited-time offers you can’t resist — big savings on trending products.
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading best deals...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestDeals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group border-0 shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Discount badge */}
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full shadow-md">
                          -{product.discount}%
                        </Badge>
                        {/* Timer badge */}
                        <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {product.timeLeft}
                        </div>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                        <Link href={`/products/${product.slug}`} className="hover:text-orange-600 transition-colors">
                          {product.name}
                        </Link>
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
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
                        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                      </div>

                      {/* Prices */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-red-600">
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

                      {/* CTA */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-semibold py-5 rounded-lg transition-all transform hover:scale-105"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Grab This Deal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestDeals;
