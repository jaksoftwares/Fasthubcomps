import React from 'react';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  className
}) => {
  if (viewMode === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex space-x-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : '/placeholder.png'
                  }
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
                          <span
                            key={i}
                            className={cn(
                              "text-sm",
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            )}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews || 0} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          KES {product.original_price.toLocaleString()}
                        </span>
                      )}
                      {product.discount && product.discount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Add to Cart
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
      className
    )}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;