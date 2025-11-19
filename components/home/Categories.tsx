'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Monitor, Laptop, Smartphone, Headphones, Keyboard, Mouse, HardDrive, Cpu } from 'lucide-react';

const Categories = () => {
  const mainCategories = [
    {
      name: 'Computers',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=computers',
      icon: Monitor,
      count: '150+',
    },
    {
      name: 'Laptops',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=laptops',
      icon: Laptop,
      count: '200+',
    },
    {
      name: 'Phones',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=phones',
      icon: Smartphone,
      count: '300+',
    },
    {
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=accessories',
      icon: Headphones,
      count: '500+',
    },
    {
      name: 'Keyboards',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=keyboards',
      icon: Keyboard,
      count: '80+',
    },
    {
      name: 'Mouse',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
      href: '/products?category=mouse',
      icon: Mouse,
      count: '120+',
    },
  ];

  return (
    <section className="py-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Background - Left Aligned */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white">
              Categories
            </h2>
          </div>
        </div>

        {/* Compact Category Grid - 6 columns on desktop, 2-3 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Compact Image Container */}
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Compact Icon */}
                  <div className="absolute top-1 left-1 bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>

                  {/* Compact Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-bold leading-tight">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-orange-300 font-medium">
                      {category.count} items
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Compact View All Button */}
        <div className="text-center mt-6">
          <Link href="/products">
            <button className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
              <ArrowRight className="mr-2 h-4 w-4" />
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;