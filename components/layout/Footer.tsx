import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/fasthub-logo.jpg"
                alt="FastHub Computers"
                width={200}
                height={80}
                className="h-16 sm:h-20 w-auto"
                priority
              />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xl sm:text-2xl font-bold text-orange-500">FastHub</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-wide">Computers</span>
              </div>
            </div>
            
            {/* Mobile Logo Text */}
            <div className="sm:hidden text-center">
              <span className="text-lg font-bold text-orange-500">FastHub</span>
              <span className="block text-xs font-semibold text-blue-400 uppercase tracking-wide">Computers</span>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Unlocking your IT needs with quality computers, laptops, phones, and professional repair services.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-300 hover:text-orange-500">All Products</Link></li>
              <li><Link href="/products?category=computers" className="text-gray-300 hover:text-orange-500">Computers</Link></li>
              <li><Link href="/products?category=laptops" className="text-gray-300 hover:text-orange-500">Laptops</Link></li>
              <li><Link href="/products?category=phones" className="text-gray-300 hover:text-orange-500">Phones</Link></li>
              <li><Link href="/repairs" className="text-gray-300 hover:text-orange-500">Repair Services</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-500">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-500">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-orange-500">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-orange-500">Returns & Exchanges</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-orange-500">Warranty</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-orange-500">FAQ</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-orange-500">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 text-orange-500" />
                <span className="text-gray-300">123 Tech Street, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-300">info@fasthub.co.ke</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Business Hours</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Mon - Fri: 8:00 AM - 6:00 PM<br />
                Sat: 9:00 AM - 4:00 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2024 FastHub Computers. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-orange-500 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-orange-500 text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
