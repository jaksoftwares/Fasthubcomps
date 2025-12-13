'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Zap, Timer } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';
import { motion } from 'framer-motion';

const BestDeals = () => {
  const { addItem } = useCart();
  const [bestDeals, setBestDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        const deals = Array.isArray(data)
          ? data
              .filter(p => {
                const tags = Array.isArray(p.tags) ? p.tags : [];
                return tags.includes('best-deals');
              })
              .map(p => ({
                ...p,
                discount:
                  p.original_price && p.price
                    ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                    : 0,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
                timeLeft: 'Limited',
                rating: p.rating || 4.5,
                reviews: p.reviews || 0,
              }))
              .slice(0, 18) // Show 18 tagged products
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

  // Gentle auto-scroll for the horizontal list, but still
  // allows the user to manually scroll.
  useEffect(() => {
    if (!bestDeals.length) return;

    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      // If near the end, bounce back to start
      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [bestDeals.length]);

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
    <section className="relative py-8 bg-gradient-to-br from-[#fff5ef] via-[#fff1e5] to-[#ffe5d2] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Background - Left Aligned */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white">
              Best Deals
            </h2>
          </div>
        </div>

        {/* Compact Product Row - horizontal scroll when many items */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="border-0 rounded-xl overflow-hidden bg-white animate-pulse">
                <div className="h-32 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {bestDeals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-48 sm:w-52 md:w-56"
              >
                <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white h-full">
                  <CardContent className="p-2">
                    {/* Compact Product Image */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className="relative h-32 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Compact discount badge */}
                        <Badge className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                          -{product.discount}%
                        </Badge>
                        {/* Timer badge */}
                        <div className="absolute top-1 right-1 bg-orange-600 text-white px-1.5 py-0.5 rounded text-xs font-medium flex items-center">
                          <Timer className="h-2.5 w-2.5 mr-0.5" />
                        </div>
                      </div>
                    </Link>

                    {/* Compact Details */}
                    <div className="p-2">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
                        <Link href={`/products/${product.slug}`} className="hover:text-orange-600 transition-colors">
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
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>

                      {/* Compact Prices */}
                      <div className="mb-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-red-600">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Save {formatPrice(product.original_price - product.price)}
                        </div>
                      </div>

                      {/* Compact CTA */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-medium py-2 text-xs rounded-lg transition-all transform hover:scale-105"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Compact View All CTA */}
        <div className="text-center mt-6">
          <Link href="/products?deals=true">
            <Button 
              className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white px-6 py-2 text-sm font-semibold rounded-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              View All Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestDeals;
