'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  Truck,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Unlocking Your',
      highlight: 'IT Needs',
      description:
        'Discover premium computers, laptops, phones, and accessories with expert support.',
      image:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80', // Tech workspace
      cta: { text: 'Shop Now', link: '/products' },
    },
    {
      title: 'Latest Laptops',
      highlight: 'Up to 30% Off',
      description:
        'Premium laptops from top brands. Fast performance, stunning displays, all-day battery.',
      image:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80', // Laptop
      cta: { text: 'Browse Laptops', link: '/products?category=laptops' },
    },
    {
      title: 'Professional',
      highlight: 'Repair Services',
      description:
        'Expert technicians, genuine parts, fast turnaround. Get your device fixed today.',
      image:
        'https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80', // Phone repair
      cta: { text: 'Book Repair', link: '/repairs' },
    },
    {
    title: 'Gaming Setups',
    highlight: 'Ready to Play',
    description:
      'High-performance gaming PCs, monitors, and accessories for the ultimate experience.',
    image:
      'https://images.unsplash.com/photo-1616628188460-8b5f1f8d49e3?auto=format&fit=crop&w=1600&q=80', // Modern gaming setup
    cta: { text: 'Explore Gaming', link: '/products?category=gaming' },
  }

  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Enhanced overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl animate-fadeIn space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                {slide.title}{' '}
                <span className="text-orange-400 block mt-2">
                  {slide.highlight}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed drop-shadow-md">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={slide.cta.link}>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg">
                    {slide.cta.text}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/contact">
                  {/* Changed to transparent black button */}
                  <Button
                    size="lg"
                    variant="ghost"
                    className="bg-black/40 hover:bg-black/60 text-white px-8 py-6 text-lg font-medium border-none backdrop-blur-md"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-orange-400' : 'w-2 bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Features Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md z-20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex items-center space-x-3 text-white">
              <Shield className="h-8 w-8 text-orange-400" />
              <div>
                <h3 className="font-semibold">Quality Guarantee</h3>
                <p className="text-sm text-blue-100">Certified products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Truck className="h-8 w-8 text-orange-400" />
              <div>
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-blue-100">Orders over KSh 10,000</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <Headphones className="h-8 w-8 text-orange-400" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-blue-100">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
