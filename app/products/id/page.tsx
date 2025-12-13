'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ProductsAPI } from '@/lib/services/products';
import { useWishlist } from '@/contexts/WishlistContext';
import Image from 'next/image';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const params = useParams();

  // Ensure params.id is always a string for API calls
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { addItem } = useCart();
  const { state: wishlistState, addWishlistItem, removeWishlistItem } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure productId is a string before calling the API
        if (typeof productId !== 'string') {
          setError('Invalid product ID');
          setLoading(false);
          return;
        }
        const data = await ProductsAPI.get(productId);
        setProduct(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/placeholder.png'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        category: product.category,
      });
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
  };


  const isWishlisted = wishlistState.items.some((item) => item.id === product.id);
  const handleWishlist = () => {
    if (isWishlisted) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        category: product.category ?? "",
      });
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success('Product link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Safely handle features
  const features: string[] = Array.isArray(product.features)
    ? product.features
    : typeof product.features === 'string' && product.features
      ? [product.features]
      : [];

  // Safely group specifications if present
  const groupedSpecs = Array.isArray(product.specifications)
    ? product.specifications.reduce((acc: Record<string, any[]>, spec: any) => {
        const group = spec.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(spec);
        return acc;
      }, {} as Record<string, any[]>)
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/placeholder.png'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              {Array.isArray(product.tags) && product.tags.map((tag: any, idx: number) => (
                <Badge key={tag.id ?? idx} className="absolute top-4 right-4" style={{ backgroundColor: tag.color }}>
                  {tag.name ?? tag}
                </Badge>
              ))}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto mt-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden focus:outline-none transition-all duration-150 ${
                      selectedImage === index ? 'border-blue-600' : 'border-transparent'
                    }`}
                    style={{ minWidth: 80, minHeight: 80 }}
                  >
                    <Image
                      src={image || '/placeholder.png'}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-20 h-20"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-green-600 font-medium">
                  You save {formatPrice(product.originalPrice! - product.price)} ({discountPercentage}% off)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant={isWishlisted ? "default" : "outline"}
                  className="px-6"
                  onClick={handleWishlist}
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'text-white fill-pink-500' : 'text-pink-500'}`} />
                  {isWishlisted ? 'Wishlisted' : ''}
                </Button>
                <Button variant="outline" className="px-6" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Free Delivery</p>
                  <p className="text-sm text-blue-700">Orders over KSh 10,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Warranty</p>
                  <p className="text-sm text-green-700">1 year manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Easy Returns</p>
                  <p className="text-sm text-orange-700">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Support</p>
                  <p className="text-sm text-purple-700">24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2 mb-4">
                      {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Main product fields as key features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Category</span><span className="text-gray-600">{product.category}</span></div>
                      {product.sub_category && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Sub Category</span><span className="text-gray-600">{product.sub_category}</span></div>}
                      {product.brand && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Brand</span><span className="text-gray-600">{product.brand}</span></div>}
                      {product.model && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Model</span><span className="text-gray-600">{product.model}</span></div>}
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">SKU</span><span className="text-gray-600">{product.sku}</span></div>
                      {product.warranty && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Warranty</span><span className="text-gray-600">{product.warranty}</span></div>}
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Condition</span><span className="text-gray-600">{product.condition}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Status</span><span className="text-gray-600">{product.status}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Stock</span><span className="text-gray-600">{product.stock}</span></div>
                      {product.color && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Color</span><span className="text-gray-600">{product.color}</span></div>}
                      {product.weight && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Weight</span><span className="text-gray-600">{product.weight}</span></div>}
                      {product.dimensions && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Dimensions</span><span className="text-gray-600">{product.dimensions}</span></div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Main product fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Category</span><span className="text-gray-600">{product.category}</span></div>
                      {product.sub_category && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Sub Category</span><span className="text-gray-600">{product.sub_category}</span></div>}
                      {product.brand && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Brand</span><span className="text-gray-600">{product.brand}</span></div>}
                      {product.model && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Model</span><span className="text-gray-600">{product.model}</span></div>}
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">SKU</span><span className="text-gray-600">{product.sku}</span></div>
                      {product.warranty && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Warranty</span><span className="text-gray-600">{product.warranty}</span></div>}
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Condition</span><span className="text-gray-600">{product.condition}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Status</span><span className="text-gray-600">{product.status}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Stock</span><span className="text-gray-600">{product.stock}</span></div>
                      {product.color && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Color</span><span className="text-gray-600">{product.color}</span></div>}
                      {product.weight && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Weight</span><span className="text-gray-600">{product.weight}</span></div>}
                      {product.dimensions && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Dimensions</span><span className="text-gray-600">{product.dimensions}</span></div>}
                    </div>
                    {/* Tech specs */}
                    <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">Technical Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.processor && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Processor</span><span className="text-gray-600">{product.processor}</span></div>}
                      {product.ram && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">RAM</span><span className="text-gray-600">{product.ram}</span></div>}
                      {product.storage && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Storage</span><span className="text-gray-600">{product.storage}</span></div>}
                      {product.storage_type && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Storage Type</span><span className="text-gray-600">{product.storage_type}</span></div>}
                      {product.graphics && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Graphics</span><span className="text-gray-600">{product.graphics}</span></div>}
                      {product.screen_size && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Screen Size</span><span className="text-gray-600">{product.screen_size}</span></div>}
                      {product.os && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Operating System</span><span className="text-gray-600">{product.os}</span></div>}
                      {product.camera && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Camera</span><span className="text-gray-600">{product.camera}</span></div>}
                      {product.battery && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Battery</span><span className="text-gray-600">{product.battery}</span></div>}
                      {product.connectivity && <div className="flex justify-between py-2 border-b border-gray-200"><span className="font-medium text-gray-700">Connectivity</span><span className="text-gray-600">{product.connectivity}</span></div>}
                    </div>
                    {/* Additional specs (JSON) */}
                    {product.additional_specs && Array.isArray(product.additional_specs) && product.additional_specs.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900">Additional Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {product.additional_specs.map((spec: any, idx: number) => (
                            <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                              <span className="font-medium text-gray-700">{spec.name || spec.key}</span>
                              <span className="text-gray-600">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500">Reviews feature coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <RelatedProducts currentProduct={product} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Related Products Component
const RelatedProducts = ({ currentProduct }: { currentProduct: any }) => {
  const [related, setRelated] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchRelated = async () => {
    	try {
    		const all = await ProductsAPI.getAll();
    		setRelated(
    			all.filter((p: any) =>
    				p.id !== currentProduct.id &&
    				(p.category === currentProduct.category || p.brand === currentProduct.brand)
    			).slice(0, 4)
    		);
    	} catch {}
    };
    fetchRelated();
  }, [currentProduct]);
  if (!related.length) return <div className="text-gray-500">No related products found.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {related.map((product) => (
        <RelatedProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const RelatedProductCard = ({ product }: { product: any }) => {
  const imageUrl = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.png';
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <a href={`/products/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={imageUrl}
              alt={product.name}
              width={400}
              height={192}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            <span className="font-bold text-orange-600">Ksh{product.price.toLocaleString()}</span>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default ProductDetailPage;