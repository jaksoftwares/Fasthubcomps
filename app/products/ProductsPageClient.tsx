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

const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  networking: '01de6a8b-6347-4310-9b08-ae0a108b9f80',
  laptops: '93d6ba2c-91aa-4c5d-8a85-5161533d96c4',
  desktops: 'ea116946-4593-4376-9100-c595bba48a7b',
  servers: '69d5f35f-a41e-4efd-be3f-ac00acb016fb',
  printers: '87870d8c-4cbd-4b39-a43a-b8f08cac0873',
  'phones-tablets': '05a23952-7ba0-4ad5-a708-1999034bc7fd',
  tvs: '59d99502-78f6-4eb2-aa26-8059ec31d5fe',
  monitors: '948e5fa7-080c-47ba-9c20-d63d119231b0',
  accessories: '614896bb-8cad-4690-9d60-617857092e56',
  storage: 'aaaf46a9-6363-4b85-8192-95af924d8f5a',
  gaming: '1ba300ed-82f9-4c3e-8cfc-961f684a4cd5',
};

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

const ProductsPageClient = () => {
  const searchParams = useSearchParams();
  const rawCategoryParam = searchParams.get('category');

  const initialCategory: string = (() => {
    if (!rawCategoryParam) return 'all';
    if (rawCategoryParam === 'all') return 'all';
    const bySlug = CATEGORY_SLUG_TO_ID[rawCategoryParam];
    return bySlug || rawCategoryParam;
  })();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: initialCategory,
    priceRange: [0, 500000],
    brand: 'all',
    rating: 0,
    sortBy: 'name',
    tags: [] as string[],
  });

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: CATEGORY_SLUG_TO_ID.laptops, name: 'Laptops' },
    { id: CATEGORY_SLUG_TO_ID.desktops, name: 'Desktop Computers' },
    { id: CATEGORY_SLUG_TO_ID.servers, name: 'Servers' },
    { id: CATEGORY_SLUG_TO_ID.networking, name: 'Networking' },
    { id: CATEGORY_SLUG_TO_ID['phones-tablets'], name: 'Phones & Tablets' },
    { id: CATEGORY_SLUG_TO_ID.tvs, name: 'TVs' },
    { id: CATEGORY_SLUG_TO_ID.monitors, name: 'Monitors' },
    { id: CATEGORY_SLUG_TO_ID.gaming, name: 'Gaming' },
    { id: CATEGORY_SLUG_TO_ID.storage, name: 'Storage' },
    { id: CATEGORY_SLUG_TO_ID.printers, name: 'Printers' },
    { id: CATEGORY_SLUG_TO_ID.accessories, name: 'Accessories' },
  ];

  const brands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 
    'Samsung', 'Logitech', 'Razer', 'Corsair', 'Microsoft', 'MSI'
  ];

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
              category: p.category_id || '',
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

  useEffect(() => {
    let filtered = allProducts;

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(product =>
        product.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const onSaleProducts = allProducts.filter(product => product.discount > 0).slice(0, 8);
  const popularProducts = allProducts.filter(product => product.is_bestseller || product.rating >= 4.5).slice(0, 8);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Breadcrumb />
      {/* ...rest of the JSX copied from original ProductsPage return... */}
    </div>
  );
};

export default ProductsPageClient;
