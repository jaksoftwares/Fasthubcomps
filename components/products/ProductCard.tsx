import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Truck, Shield, Headphones } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    original_price?: number;
    originalPrice?: number;
    images?: string[];
    category?: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    status?: string;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new?: boolean;
    discount?: number;
  };
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const imageUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png';
  const { addItem } = useCart();
  const { state: wishlistState, addWishlistItem, removeWishlistItem } = useWishlist();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      category: product.category ?? "",
    });
  };

  const isWishlisted = wishlistState.items.some(item => item.id === product.id);
  const handleWishlist = () => {
    if (isWishlisted) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
        category: product.category ?? "",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = () => {
    const originalPrice = product.original_price || product.originalPrice;
    if (originalPrice && originalPrice > product.price) {
      return Math.round(((originalPrice - product.price) / originalPrice) * 100);
    }
    return product.discount || 0;
  };

  const discountPercentage = getDiscountPercentage();

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex space-x-4">
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price || product.originalPrice || product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {product.is_new && (
                      <Badge className="bg-green-100 text-green-800">New</Badge>
                    )}
                    {product.is_bestseller && (
                      <Badge className="bg-orange-100 text-orange-800">Bestseller</Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                    )}
                    {discountPercentage > 0 && (
                      <Badge className="bg-red-100 text-red-800">-{discountPercentage}%</Badge>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-4 w-4 mr-1" />
                      Free delivery
                    </div>
                  </div>
                </div>
                
                {/* Wishlist button - Stop propagation */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWishlist();
                  }}
                  className={`flex flex-col items-end space-y-2 ${
                    isWishlisted ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="text-xs">Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="group relative hover:shadow-lg transition-all duration-300 overflow-hidden border-0 cursor-pointer h-full">
        <CardContent className="p-2 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 flex-shrink-0">
            <div className="relative h-40">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col space-y-1">
              {product.is_new && (
                <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-1.5 py-0.5 rounded">
                  New
                </Badge>
              )}
              {product.is_bestseller && (
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-1.5 py-0.5 rounded">
                  Best
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-1.5 py-0.5 rounded">
                  Featured
                </Badge>
              )}
            </div>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {/* Quick Wishlist Action - Stop propagation */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist();
              }}
              className="absolute top-1 right-1 bg-white hover:bg-orange-50 text-gray-700 p-1 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
              style={{ top: discountPercentage > 0 ? '2.5rem' : '0.25rem' }}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-3 w-3 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>

            {/* Trust Indicators */}
            <div className="absolute bottom-1 left-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-green-600 text-white p-0.5 rounded-full">
                <Truck className="h-2 w-2" />
              </div>
              <div className="bg-blue-600 text-white p-0.5 rounded-full">
                <Shield className="h-2 w-2" />
              </div>
            </div>
          </div>

          {/* Product Info - Takes remaining space */}
          <div className="p-2 flex-1 flex flex-col">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight flex-shrink-0">
              {product.name}
            </h3>
            
            <div className="text-xs text-gray-600 mb-1 flex-shrink-0">
              {product.brand}
            </div>
            
            <div className="flex items-center mb-1 flex-shrink-0">
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
            
            <div className="mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.original_price || product.originalPrice || product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;