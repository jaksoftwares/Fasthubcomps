import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
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
    images?: string[];
    category?: string;
    brand?: string;
    rating?: number;
    reviews?: number;
    status?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={imageUrl}
              alt={product.name}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.status && (
              <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                {product.status}
              </Badge>
            )}
          </div>
        </Link>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <div className="flex items-center mb-2">
            <span className="font-bold text-orange-600 mr-2">Ksh{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="line-through text-gray-400 text-sm">Ksh{product.original_price.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Button size="sm" variant="outline" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
            </Button>
            <Button size="sm" variant={isWishlisted ? "default" : "ghost"} onClick={handleWishlist} aria-label="Add to Wishlist">
              <Heart className={`h-4 w-4 ${isWishlisted ? 'text-white fill-pink-500' : 'text-pink-500'}`} />
              {isWishlisted ? 'Wishlisted' : ''}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;