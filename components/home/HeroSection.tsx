'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  Headphones,
  Star,
  Clock,
} from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      highlight: 'Up to 30% Off',
      cta: { text: 'Shop Tech Deals', link: '/products' },
    },
    {
      highlight: 'Latest Laptops',
      cta: { text: 'Browse Laptops', link: '/products?category=laptops' },
    },
    {
      highlight: 'Gaming Gear',
      cta: { text: 'Explore Gaming', link: '/products?category=gaming' },
    },
    {
      highlight: 'Repair Services',
      cta: { text: 'Book Repair', link: '/repairs' },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Compact horizontal hero bar */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-white font-bold text-lg">FasHub</span>
            </Link>
          </div>

          {/* Main Message */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-4 text-center">
              <Zap className="h-5 w-5 text-orange-400" />
              <span className="text-white font-semibold text-lg">
                {slides[currentSlide].highlight}
              </span>
              <Zap className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link href={slides[currentSlide].cta.link}>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm font-semibold">
                {slides[currentSlide].cta.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all ${
                index === currentSlide ? 'w-6 bg-orange-400' : 'w-1 bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </section>
  );
};

export default HeroSection;
