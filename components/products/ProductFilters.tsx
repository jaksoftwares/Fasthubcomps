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
  search: string;
  category: string;
  priceRange: number[];
  brand: string;
  rating: number;
  sortBy: string;
  tags: string[];
}

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFiltersChange }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'laptops', label: 'Laptops & Notebooks' },
    { value: 'desktops', label: 'Desktop Computers' },
    { value: 'components', label: 'Computer Components' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'tablets', label: 'Tablets & eReaders' },
    { value: 'software', label: 'Software' },
  ];

  const productTags = [
    { value: 'featured', label: 'Featured Products' },
    { value: 'bestseller', label: 'Best Sellers' },
    { value: 'new', label: 'New Arrivals' },
    { value: 'on-sale', label: 'On Sale' },
  ];

  const brands = [
    { value: '', label: 'All Brands' },
    { value: 'Apple', label: 'Apple' },
    { value: 'Samsung', label: 'Samsung' },
    { value: 'Dell', label: 'Dell' },
    { value: 'HP', label: 'HP' },
    { value: 'Lenovo', label: 'Lenovo' },
    { value: 'Asus', label: 'Asus' },
    { value: 'Acer', label: 'Acer' },
    { value: 'MSI', label: 'MSI' },
    { value: 'Logitech', label: 'Logitech' },
    { value: 'Razer', label: 'Razer' },
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

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      priceRange: [0, 500000],
      brand: 'all',
      rating: 0,
      sortBy: 'name',
      tags: [],
    });
  };

  return (
    <div className="space-y-6">
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
                checked={filters.category === category.value || (category.value === 'all' && filters.category === 'all')}
                onCheckedChange={(checked) => 
                  handleFilterChange('category', checked ? category.value : 'all')
                }
              />
              <Label htmlFor={`category-${category.value}`} className="text-sm">
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Product Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {productTags.map((tag) => (
            <div key={tag.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.value}`}
                checked={filters.tags.includes(tag.value)}
                onCheckedChange={(checked) => handleTagChange(tag.value, checked as boolean)}
              />
              <Label htmlFor={`tag-${tag.value}`} className="text-sm">
                {tag.label}
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
                checked={filters.brand === brand.value || (brand.value === 'all' && filters.brand === 'all')}
                onCheckedChange={(checked) => 
                  handleFilterChange('brand', checked ? brand.value : 'all')
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