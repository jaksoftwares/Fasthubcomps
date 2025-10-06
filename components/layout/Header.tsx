'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, Phone, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistDrawer from '@/components/wishlist/WishlistDrawer';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthModal from '@/components/auth/AuthModal';
import { useAuthModal } from '@/contexts/AuthModalContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isOpen: isAuthOpen, open: openAuthModal, close: closeAuthModal } = useAuthModal();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, logout } = useAuth();

  const baseNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Computers', href: '/products?category=computers' },
    { name: 'Laptops', href: '/products?category=laptops' },
    { name: 'Phones', href: '/products?category=phones' },
    { name: 'Accessories', href: '/products?category=accessories' },
    { name: 'Repairs', href: '/repairs' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Customers', href: '/admin/customers' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  const navigation = user?.role === 'admin' ? [...baseNavigation, ...adminNavigation] : baseNavigation;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+254 700 123 456</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>info@fasthub.co.ke</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Free delivery on orders over KSh 10,000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/fasthub-logo.jpg"
                alt="FastHub Computers"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* User Account */}
              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="hidden md:block text-sm">Hi, {user.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-sm"
                    >
                      Logout
                    </Button>
                    {user.role === 'admin' && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm">
                          Admin
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openAuthModal}
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:block">Sign In</span>
                  </Button>
                )}
              </div>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="relative flex items-center space-x-1" onClick={() => setIsWishlistOpen(true)}>
                <Heart className="h-5 w-5 text-pink-500" />
                {wishlistState.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500 text-white">
                    {wishlistState.items.length}
                  </Badge>
                )}
                <span className="hidden md:block">Wishlist</span>
              </Button>
              <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartState.itemCount}
                  </Badge>
                )}
                <span className="hidden md:block">Cart</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <nav className="space-y-2">
                {baseNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-gray-700 hover:text-orange-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <span className="block py-1 text-sm font-semibold text-gray-500 uppercase">Admin</span>
                      {adminNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block py-2 pl-4 text-gray-700 hover:text-orange-600 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
  <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />
    </>
  );
};

export default Header;