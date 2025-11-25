import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  brand?: string;
  rating?: number;
  reviews?: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  discount?: number;
}

interface FeaturedProductsProps {
  products: Product[];
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  viewAllLink?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  title,
  subtitle,
  badge,
  className,
  viewAllLink = '#'
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = (product: Product) => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return product.discount || 0;
  };

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {badge && (
            <Badge className="bg-red-600 text-white animate-pulse">
              {badge}
            </Badge>
          )}
        </div>
        <Link 
          href={viewAllLink}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All →
        </Link>
      </div>
      
      {subtitle && (
        <p className="text-gray-600 mb-6">{subtitle}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.slice(0, 12).map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow border">
            <CardContent className="p-2">
              <div className="relative">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-32 cursor-pointer">
                    <Image
                      src={
                        Array.isArray(product.images) && product.images.length > 0
                          ? product.images[0]
                          : '/placeholder.png'
                      }
                      alt={product.name}
                      fill
                      className="object-cover rounded-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-1 left-1 flex flex-col space-y-1">
                  {product.is_new && (
                    <Badge className="bg-green-600 text-white text-xs px-1.5 py-0.5">
                      New
                    </Badge>
                  )}
                  {product.is_bestseller && (
                    <Badge className="bg-orange-600 text-white text-xs px-1.5 py-0.5">
                      <TrendingUp className="h-2 w-2 mr-1" />
                      Best
                    </Badge>
                  )}
                </div>

                {/* Discount */}
                {getDiscountPercentage(product) > 0 && (
                  <Badge className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5">
                    -{getDiscountPercentage(product)}%
                  </Badge>
                )}

                {/* Timer for limited deals */}
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white px-1.5 py-0.5 rounded text-xs flex items-center">
                  <Clock className="h-2 w-2 mr-1" />
                  24H
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">
                  <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">
                    ({product.reviews || 0})
                  </span>
                </div>
                
                <div className="mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;