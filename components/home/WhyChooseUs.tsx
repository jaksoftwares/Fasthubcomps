'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Shield, Users, Wrench, TrendingUp, Headphones, Package, CreditCard } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We stock only genuine, certified products from trusted manufacturers worldwide.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Shield,
      title: 'Warranty Protection',
      description: 'Comprehensive warranty coverage on all products with hassle-free claims.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Certified technicians with years of experience in IT solutions and repairs.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Wrench,
      title: 'Professional Repairs',
      description: 'Fast, reliable repair services using genuine parts with guaranteed workmanship.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Competitive Prices',
      description: 'Best value for money with regular discounts and flexible payment options.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support via phone, email, and live chat.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Package,
      title: 'Fast Delivery',
      description: 'Quick and secure delivery to your doorstep anywhere in Kenya.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options with SSL encryption for safe transactions.',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            WHY FAST HUB COMPUTERS
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Customers Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional service, quality products, and the best value for your money
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-md overflow-hidden"
              >
                <CardContent className="p-6">
                  {/* Icon with Gradient */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you find the perfect solution for your IT needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Headphones className="h-5 w-5 mr-2" />
              Contact Us
            </a>
            <a 
              href="tel:+254712345678" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg border border-gray-200"
            >
              Call: +254 712 345 678
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;