'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Unlocking Your
                <span className="text-orange-400 block">IT Needs</span>
              </h1>
              <p className="text-xl text-blue-100 mt-6 leading-relaxed">
                Discover premium computers, laptops, phones, and accessories. 
                Professional repair services with expert technicians.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/repairs">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-blue-900  hover:bg-orange-600 px-8 py-3"
                >
                  Repair Services
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-orange-400" />
                <div>
                  <h3 className="font-semibold">Quality Guarantee</h3>
                  <p className="text-sm text-blue-100">Certified products</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-orange-400" />
                <div>
                  <h3 className="font-semibold">Free Delivery</h3>
                  <p className="text-sm text-blue-100">Orders over KSh 10,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Headphones className="h-8 w-8 text-orange-400" />
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-blue-100">Expert assistance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-100">Products</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-blue-100">Happy Customers</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm text-blue-100">Years Experience</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-100">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;