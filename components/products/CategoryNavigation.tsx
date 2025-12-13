import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className
}) => {
  return (
    <div className={`bg-white border-b shadow-sm ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-4 overflow-x-auto scrollbar-hide">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className="whitespace-nowrap"
          >
            All Categories
          </Button>
          
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              <Button
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className="whitespace-nowrap flex items-center space-x-2"
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </Button>
              
              {/* Subcategory dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </h4>
                  <div className="space-y-1">
                    {category.subcategories.map((subcategory, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          onCategoryChange(category.id);
                        }}
                      >
                        {subcategory}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected category details */}
        {selectedCategory !== 'all' && (
          <div className="py-3 border-t">
            {(() => {
              const category = categories.find(c => c.id === selectedCategory);
              if (!category) return null;
              
              return (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{category.subcategories.length} subcategories</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Fast delivery</Badge>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNavigation;