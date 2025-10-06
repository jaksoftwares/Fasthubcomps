'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface Filters {
  category: string;
  priceRange: number[];
  brand: string;
  rating: number;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFiltersChange }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'computers', label: 'Computers' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'phones', label: 'Phones' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const productTags = [
    { value: '', label: 'All Products' },
    { value: 'featured', label: 'Featured' },
    { value: 'top_sales', label: 'Top Sales' },
    { value: 'best_deals', label: 'Best Deals' },
    { value: 'new', label: 'New Arrivals' },
    { value: 'popular', label: 'Popular' },
  ];

  const brands = [
    { value: '', label: 'All Brands' },
    { value: 'Apple', label: 'Apple' },
    { value: 'Samsung', label: 'Samsung' },
    { value: 'Dell', label: 'Dell' },
    { value: 'HP', label: 'HP' },
    { value: 'Logitech', label: 'Logitech' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      priceRange: [0, 500000],
      brand: '',
      rating: 0,
      sortBy: 'name',
    });
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Product Tags (removed, not in Filters interface) */}

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.category === category.value}
                onCheckedChange={(checked) => 
                  handleFilterChange('category', checked ? category.value : '')
                }
              />
              <Label htmlFor={`category-${category.value}`} className="text-sm">
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={500000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.value} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.value}`}
                checked={filters.brand === brand.value}
                onCheckedChange={(checked) => 
                  handleFilterChange('brand', checked ? brand.value : '')
                }
              />
              <Label htmlFor={`brand-${brand.value}`} className="text-sm">
                {brand.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) => 
                  handleFilterChange('rating', checked ? rating : 0)
                }
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                & up
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default ProductFilters;