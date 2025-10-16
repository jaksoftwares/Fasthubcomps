'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        const featured = Array.isArray(data)
          ? data
              .map(p => ({
                ...p,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
                badge: p.badge || 'Featured',
                rating: p.rating || 4.5,
                reviews: p.reviews || 0,
              }))
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 10)
          : [];
        setFeaturedProducts(featured);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading featured products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center text-red-500 bg-gradient-to-b from-white to-gray-50">
        {error}
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            HANDPICKED FOR YOU
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech products at unbeatable prices
          </p>
        </div>

        {/* Scroll Buttons (Desktop) */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-orange-100 text-gray-700 rounded-full p-3 shadow-lg z-20"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-orange-100 text-gray-700 rounded-full p-3 shadow-lg z-20"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4"
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] snap-start flex-shrink-0"
            >
              <Card className="group relative hover:shadow-xl transition-all duration-300 overflow-hidden border-0">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-64 cursor-pointer">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Badge */}
                    <Badge className="absolute top-3 left-3 bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                      {product.badge}
                    </Badge>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="bg-white hover:bg-orange-50 text-gray-700 p-2 rounded-full shadow-lg transition-all"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            wishlist.has(product.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>
                      <Link href={`/products/${product.slug}`}>
                        <button className="bg-white hover:bg-orange-50 text-gray-700 p-2 rounded-full shadow-lg transition-all">
                          <Eye className="h-5 w-5" />
                        </button>
                      </Link>
                    </div>

                    {/* Discount */}
                    {product.originalPrice > product.price && (
                      <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 h-12">
                      <Link href={`/products/${product.slug}`} className="hover:text-orange-600 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
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
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg transition-all transform hover:scale-105"
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

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/products">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-12 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Hide Scrollbar Utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;


// 'use client';

// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Star, ShoppingCart } from 'lucide-react';
// import { useCart } from '@/contexts/CartContext';
// import { ProductsAPI } from '@/lib/services/products';

// const FeaturedProducts = () => {
//   const { addItem } = useCart();
//   const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await ProductsAPI.getAll();
//         // Sort by rating or badge, pick top 4
//         const featured = Array.isArray(data)
//           ? data
//               .map(p => ({
//                 ...p,
//                 image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.png',
//                 badge: p.badge || 'Featured',
//                 rating: p.rating || 4.5,
//                 reviews: p.reviews || 0,
//               }))
//               .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//               .slice(0, 4)
//           : [];
//         setFeaturedProducts(featured);
//       } catch (err: any) {
//         setError(err?.message || 'Failed to fetch featured products');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeatured();
//   }, []);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: 'KES',
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   const handleAddToCart = (product: any) => {
//     addItem({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       category: product.category,
//     });
//   };

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Featured Products
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover our handpicked selection of premium tech products at unbeatable prices
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center py-8">Loading...</div>
//         ) : error ? (
//           <div className="text-center text-red-500 py-8">{error}</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {featuredProducts.map((product) => (
//               <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
//                 <CardContent className="p-0">
//                   <Link href={`/products/${product.slug}`} className="block">
//                     <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
//                       <Image
//                         src={product.image}
//                         alt={product.name}
//                         width={400}
//                         height={192}
//                         className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <Badge className="absolute top-2 left-2 bg-orange-600">
//                         {product.badge}
//                       </Badge>
//                     </div>
//                   </Link>
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
//                       <Link href={`/products/${product.slug}`}>{product.name}</Link>
//                     </h3>
                    
//                     <div className="flex items-center mb-2">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${
//                               i < Math.floor(product.rating)
//                                 ? 'text-yellow-400 fill-current'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-sm text-gray-600 ml-2">
//                         ({product.reviews})
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <span className="text-lg font-bold text-gray-900">
//                           {formatPrice(product.price)}
//                         </span>
//                         {product.originalPrice > product.price && (
//                           <span className="text-sm text-gray-500 line-through ml-2">
//                             {formatPrice(product.originalPrice)}
//                           </span>
//                         )}
//                       </div>
//                     </div>
                    
//                     <Button
//                       onClick={() => handleAddToCart(product)}
//                       className="w-full bg-blue-600 hover:bg-blue-700"
//                     >
//                       <ShoppingCart className="h-4 w-4 mr-2" />
//                       Add to Cart
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         <div className="text-center">
//           <Link href="/products">
//             <Button size="lg" variant="outline" className="px-8">
//               View All Products
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;