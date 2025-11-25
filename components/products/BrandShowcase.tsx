import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
  featured?: boolean;
}

interface BrandShowcaseProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({
  title = "Top Brands",
  subtitle = "Discover products from your favorite brands",
  className = ""
}) => {
  const brands: Brand[] = [
    { id: 'apple', name: 'Apple', logo: '🍎', description: 'Premium laptops & tablets' },
    { id: 'dell', name: 'Dell', logo: '💻', description: 'Business & gaming PCs' },
    { id: 'hp', name: 'HP', logo: '🏢', description: 'Innovative computing' },
    { id: 'lenovo', name: 'Lenovo', logo: '🔴', description: 'Reliable technology' },
    { id: 'asus', name: 'ASUS', logo: '⚡', description: 'Gaming & performance' },
    { id: 'acer', name: 'Acer', logo: '🎯', description: 'Affordable computing' },
    { id: 'msi', name: 'MSI', logo: '🔥', description: 'Gaming excellence' },
    { id: 'microsoft', name: 'Microsoft', logo: '🪟', description: 'Software & hardware' },
    { id: 'samsung', name: 'Samsung', logo: '📱', description: 'Innovative devices' },
    { id: 'logitech', name: 'Logitech', logo: '🖱️', description: 'Premium accessories' },
    { id: 'razer', name: 'Razer', logo: '⚡', description: 'Gaming peripherals' },
    { id: 'corsair', name: 'Corsair', logo: '💾', description: 'Gaming memory & power' },
  ];

  const featuredBrands = brands.filter(brand => ['apple', 'dell', 'hp', 'lenovo', 'asus', 'logitech'].includes(brand.id));

  return (
    <div className={`mb-8 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Featured Brands Row */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Brands</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {featuredBrands.map((brand) => (
            <Card key={brand.id} className="group hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{brand.logo}</div>
                <h4 className="font-semibold text-gray-900 text-sm">{brand.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{brand.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Brands Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Brands</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="group hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-1">{brand.logo}</div>
                <h4 className="font-medium text-gray-900 text-xs">{brand.name}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Brand Promotion Banner */}
      <Card className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Exclusive Brand Deals</h3>
              <p className="text-blue-100 mb-4">Save up to 30% on top brand electronics</p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Shop Brand Deals
              </Button>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs text-blue-100">Brands</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-xs text-blue-100">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-blue-100">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-blue-100">Authentic</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandShowcase;