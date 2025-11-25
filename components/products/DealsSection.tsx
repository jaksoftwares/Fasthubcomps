import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Tag, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  timeLeft?: string;
  isFlash?: boolean;
  isLimited?: boolean;
}

interface DealsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const DealsSection: React.FC<DealsSectionProps> = ({
  title = "Hot Deals",
  subtitle = "Limited time offers you don't want to miss",
  className = ""
}) => {
  const deals: Deal[] = [
    {
      id: '1',
      title: 'MacBook Pro 14" M3',
      description: 'Powerful laptop for professionals',
      originalPrice: 320000,
      salePrice: 280000,
      discount: 13,
      image: '/placeholder.png',
      timeLeft: '2h 45m',
      isFlash: true
    },
    {
      id: '2',
      title: 'Dell XPS 13',
      description: 'Ultra-portable premium laptop',
      originalPrice: 180000,
      salePrice: 145000,
      discount: 19,
      image: '/placeholder.png',
      timeLeft: '5h 12m',
      isFlash: true
    },
    {
      id: '3',
      title: 'Gaming Mouse RGB',
      description: 'High-precision gaming mouse',
      originalPrice: 15000,
      salePrice: 8999,
      discount: 40,
      image: '/placeholder.png',
      timeLeft: '1d 3h',
      isLimited: true
    },
    {
      id: '4',
      title: '4K Monitor 27"',
      description: 'Crisp 4K display for professionals',
      originalPrice: 95000,
      salePrice: 75000,
      discount: 21,
      image: '/placeholder.png',
      timeLeft: '3h 20m',
      isFlash: true
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <Badge className="bg-red-600 text-white animate-pulse">
            <Flame className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        </div>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id} className="group hover:shadow-lg transition-shadow relative overflow-hidden">
            <CardContent className="p-0">
              {/* Flash/Limited Deal Badges */}
              <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
                {deal.isFlash && (
                  <Badge className="bg-red-600 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    Flash
                  </Badge>
                )}
                {deal.isLimited && (
                  <Badge className="bg-orange-600 text-white">
                    Limited
                  </Badge>
                )}
                <Badge className="bg-green-600 text-white">
                  -{deal.discount}%
                </Badge>
              </div>

              {/* Timer */}
              {deal.timeLeft && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs z-10">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  {deal.timeLeft}
                </div>
              )}

              {/* Product Image */}
              <Link href={`/products/${deal.id}`}>
                <div className="relative h-48 cursor-pointer">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  
                  {/* Overlay with discount percentage */}
                  <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-lg">
                    -{deal.discount}%
                  </div>
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  <Link href={`/products/${deal.id}`} className="hover:text-blue-600">
                    {deal.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {deal.description}
                </p>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(deal.salePrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(deal.originalPrice)}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    You save {formatPrice(deal.originalPrice - deal.salePrice)}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Categories */}
      <Card className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">More Amazing Deals</h3>
            <p className="text-purple-100 mb-4">
              Discover incredible discounts across all categories
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">30%</div>
                <div className="text-sm text-purple-100">Max Discount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-purple-100">Deals Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-purple-100">Flash Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-purple-100">Genuine</div>
              </div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Tag className="h-4 w-4 mr-2" />
              View All Deals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealsSection;