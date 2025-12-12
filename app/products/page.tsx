'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid2x2 as Grid, List, Filter, ChevronLeft, ChevronRight, Star, TrendingUp, Tag } from 'lucide-react';
import { ProductsAPI } from '@/lib/services/products';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 24;

// Product interface
interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number;
  images: string[];
  brand: string;
  rating: number;
  reviews: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  discount: number;
  category?: string;
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  
  // View and layout states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    priceRange: [0, 500000],
    brand: 'all',
    rating: 0,
    sortBy: 'name',
    tags: [] as string[],
  });

  // Products state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categories
  const categories = [
    { id: 'laptops', name: 'Laptops' },
    { id: 'desktops', name: 'Desktop Computers' },
    { id: 'components', name: 'Components' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'tablets', name: 'Tablets' },
    { id: 'software', name: 'Software' },
  ];

  // Brands
  const brands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 
    'Samsung', 'Logitech', 'Razer', 'Corsair', 'Microsoft', 'MSI'
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductsAPI.getAll();
        const mapped: Product[] = Array.isArray(data)
          ? data.map((p): Product => ({
              id: p.id || '',
              slug: p.slug || p.id || '',
              name: p.name || '',
              price: Number(p.price) || 0,
              original_price: Number(p.old_price) || Number(p.price) || 0,
              images: Array.isArray(p.images) ? p.images : ['/placeholder.png'],
              category: p.category_id || 'accessories',
              brand: p.brand || 'Generic',
              rating: Number(p.rating) || 4.5,
              reviews: Number(p.reviews) || Math.floor(Math.random() * 500) + 10,
              is_featured: Boolean(p.is_featured) || false,
              is_bestseller: Boolean(p.is_bestseller) || false,
              is_new: Boolean(p.is_new) || false,
              discount: Number(p.discount) || 0,
            }))
          : [];
        setAllProducts(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = allProducts;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Brand filter
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(product =>
        product.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(product => {
        return filters.tags.some(tag => {
          switch (tag) {
            case 'featured':
              return product.is_featured;
            case 'bestseller':
              return product.is_bestseller;
            case 'new':
              return product.is_new;
            case 'on-sale':
              return product.discount > 0;
            default:
              return false;
          }
        });
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, allProducts]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Sales-focused product collections
  const onSaleProducts = allProducts.filter(product => product.discount > 0).slice(0, 8);
  const popularProducts = allProducts.filter(product => product.is_bestseller || product.rating >= 4.5).slice(0, 8);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: [0, 500000],
      brand: 'all',
      rating: 0,
      sortBy: 'name',
      tags: [],
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb />
      
      {/* Clean Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full sm:w-64"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <Button
              variant={filters.category === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange({ category: 'all' })}
              className="whitespace-nowrap"
            >
              All
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterChange({ category: category.id })}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Sales-Focused Quick Sections */}
      {!loading && !filters.search && !filters.category || filters.category === 'all' ? (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* On Sale Section */}
            {onSaleProducts.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-red-600" />
                        Special Offers
                      </h3>
                      <p className="text-sm text-gray-600">Up to 50% off selected items</p>
                      <Button 
                        variant="link" 
                        className="text-red-600 p-0 h-auto font-medium"
                        onClick={() => handleFilterChange({ tags: ['on-sale'] })}
                      >
                        Shop Now →
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{onSaleProducts.length}</div>
                      <div className="text-xs text-gray-600">Deals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : null}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "w-80 space-y-6",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange({ sortBy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Brand</label>
                    <Select
                      value={filters.brand}
                      onValueChange={(value) => handleFilterChange({ brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
                    <Select
                      value={filters.rating.toString()}
                      onValueChange={(value) => handleFilterChange({ rating: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">View:</span>
                <div className="flex items-center space-x-1 border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                )}>
                  {currentProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Horizontal Product Sections - After Main Grid */}
        {!loading && !filters.search && !filters.category || filters.category === 'all' ? (
          <div className="mt-8 space-y-8">
            {/* Black Friday - Refurbished Laptops Section */}
            <div className="bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Black Friday | Refurbished Laptops | From 11K</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'laptops', tags: ['on-sale'] })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'laptops' && p.discount > 0).slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Black Friday - New Laptop Deals Section */}
            <div className="bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Black Friday | New Laptop Deals | From 30K</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'laptops' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'laptops').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Computers Section */}
            <div className="bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Desktop Computers & Workstations</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'desktops' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'desktops').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Components Section */}
            <div className="bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Computer Components & Hardware</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'components' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'components').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accessories Section */}
            <div className="bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">IT Accessories & Peripherals</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'accessories' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'accessories').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tablets Section */}
            <div className="bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Tablets & Mobile Devices</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'tablets' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'tablets').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Software Section */}
            <div className="bg-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-600 text-white px-6 py-3 rounded mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Software & Licenses</h3>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-orange-700"
                    onClick={() => handleFilterChange({ category: 'software' })}
                  >
                    See All →
                  </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {allProducts.filter(p => p.category === 'software').slice(0, 12).map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                      <ProductCard product={product} viewMode="grid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;