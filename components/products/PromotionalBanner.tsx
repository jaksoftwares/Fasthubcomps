import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, Clock } from 'lucide-react';

interface PromotionalBannerProps {
  className?: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ className }) => {
  return (
    <div className={`mb-8 ${className || ''}`}>
      {/* Main Promotional Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1">
              <Badge className="bg-white text-orange-600 font-bold mb-4">
                <Tag className="h-4 w-4 mr-1" />
                LIMITED TIME OFFER
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Up to 50% OFF
              </h2>
              <p className="text-xl mb-6 text-orange-100">
                On Premium Laptops & Gaming Accessories
              </p>
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Shop Now
              </Button>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="text-center">
                <div className="text-4xl font-bold">24H</div>
                <div className="text-sm text-orange-100">Limited Offer</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Promotional Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-full">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Reliable nationwide shipping</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 text-white p-2 rounded-full">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Prices</h3>
                <p className="text-sm text-gray-600">Guaranteed lowest prices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 text-white p-2 rounded-full">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-600">Expert technical support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionalBanner;