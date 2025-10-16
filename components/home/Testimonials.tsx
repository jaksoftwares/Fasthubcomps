'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'James Kimani',
      role: 'Business Owner',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 5,
      text: 'Fast Hub Computers provided excellent service when my laptop crashed. They recovered all my data and fixed it within 24 hours. Highly professional!',
    },
    {
      name: 'Sarah Wanjiru',
      role: 'Graphic Designer',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 5,
      text: 'I bought a Dell workstation for my design work. The team helped me choose the perfect specs and the price was very competitive. Love the after-sales support!',
    },
    {
      name: 'David Omondi',
      role: 'Student',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 5,
      text: 'Great place for students! Got a quality refurbished laptop at an amazing price. The warranty and support give me peace of mind.',
    },
    {
      name: 'Mary Achieng',
      role: 'Entrepreneur',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 5,
      text: 'The repair service is top-notch. My phone screen was replaced perfectly and they even cleaned the entire device. Will definitely come back!',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Fast Hub Computers
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="relative">
                {/* Quote Icon */}
                <Quote className="absolute -top-4 -left-4 h-16 w-16 text-orange-400 opacity-20" />

                {/* Testimonial Content */}
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-white">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-blue-200">
                        {testimonials[currentIndex].role}
                      </p>
                      <div className="flex items-center mt-2">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-white leading-relaxed italic">
                    "{testimonials[currentIndex].text}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden lg:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden lg:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-8 lg:hidden">
            <button
              onClick={prevTestimonial}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5000+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-blue-200">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10,000+</div>
            <div className="text-blue-200">Repairs Done</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5+</div>
            <div className="text-blue-200">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;