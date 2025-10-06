'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift } from 'lucide-react';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <Mail className="h-8 w-8 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Stay Updated
                </h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter and be the first to know about new products, 
                exclusive deals, and tech tips from our experts.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Exclusive subscriber discounts</span>
                </div>
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Early access to new products</span>
                </div>
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Tech tips and tutorials</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 px-8"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </form>
            </div>

            {/* Visual */}
            <div className="bg-gradient-to-br from-blue-900 to-orange-600 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join 5,000+ Subscribers</h3>
                <p className="text-blue-100">
                  Get the latest tech news and exclusive offers delivered to your inbox
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;