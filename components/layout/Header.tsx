'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, Menu, X, Phone, Mail, Heart, ChevronRight, Zap, Tag, Package } from 'lucide-react';
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isOpen: isAuthOpen, open: openAuthModal, close: closeAuthModal } = useAuthModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, logout } = useAuth();

  // Promo slides for the top bar
  const promoSlides = [
    { text: 'Up to 30% Off on Selected Items', link: '/products' },
    { text: 'Free Delivery on Orders Over KSh 10,000', link: '/products' },
    { text: 'Latest Laptops & Gaming Gear Available', link: '/products?category=laptops' },
    { text: 'Professional Repair Services', link: '/repairs' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  // Update button position when menu opens
  useEffect(() => {
    if (isCategoryMenuOpen && categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isCategoryMenuOpen]);

  // Comprehensive category menu with detailed brands/subcategories
  const categoryMenu = [
    {
      name: 'Computers',
      href: '/products?category=computers',
      icon: '💻',
      subcategories: [
        {
          title: 'By Type',
          items: [
            { name: 'Desktop Computers', href: '/products?category=computers&type=desktop' },
            { name: 'All-in-One PCs', href: '/products?category=computers&type=all-in-one' },
            { name: 'Gaming PCs', href: '/products?category=computers&type=gaming' },
            { name: 'Workstations', href: '/products?category=computers&type=workstation' },
          ]
        },
        {
          title: 'By Brand',
          items: [
            { name: 'Dell Computers', href: '/products?category=computers&brand=dell' },
            { name: 'HP Computers', href: '/products?category=computers&brand=hp' },
            { name: 'Lenovo Computers', href: '/products?category=computers&brand=lenovo' },
            { name: 'Apple iMac', href: '/products?category=computers&brand=apple' },
            { name: 'ASUS Computers', href: '/products?category=computers&brand=asus' },
          ]
        }
      ]
    },
    {
      name: 'Laptops',
      href: '/products?category=laptops',
      icon: '💼',
      subcategories: [
        {
          title: 'By Type',
          items: [
            { name: 'Business Laptops', href: '/products?category=laptops&type=business' },
            { name: 'Gaming Laptops', href: '/products?category=laptops&type=gaming' },
            { name: 'Ultrabooks', href: '/products?category=laptops&type=ultrabook' },
            { name: '2-in-1 Laptops', href: '/products?category=laptops&type=2in1' },
          ]
        },
        {
          title: 'By Brand',
          items: [
            { name: 'Dell Laptops', href: '/products?category=laptops&brand=dell' },
            { name: 'HP Laptops', href: '/products?category=laptops&brand=hp' },
            { name: 'Lenovo Laptops', href: '/products?category=laptops&brand=lenovo' },
            { name: 'Apple MacBook', href: '/products?category=laptops&brand=apple' },
            { name: 'ASUS Laptops', href: '/products?category=laptops&brand=asus' },
            { name: 'Acer Laptops', href: '/products?category=laptops&brand=acer' },
          ]
        }
      ]
    },
    {
      name: 'Phones & Tablets',
      href: '/products?category=phones',
      icon: '📱',
      subcategories: [
        {
          title: 'By Type',
          items: [
            { name: 'Smartphones', href: '/products?category=phones&type=smartphone' },
            { name: 'Feature Phones', href: '/products?category=phones&type=feature' },
            { name: 'Tablets', href: '/products?category=phones&type=tablet' },
          ]
        },
        {
          title: 'By Brand',
          items: [
            { name: 'Samsung', href: '/products?category=phones&brand=samsung' },
            { name: 'Apple iPhone', href: '/products?category=phones&brand=apple' },
            { name: 'Xiaomi', href: '/products?category=phones&brand=xiaomi' },
            { name: 'Oppo', href: '/products?category=phones&brand=oppo' },
            { name: 'Tecno', href: '/products?category=phones&brand=tecno' },
            { name: 'Infinix', href: '/products?category=phones&brand=infinix' },
          ]
        }
      ]
    },
    {
      name: 'Accessories',
      href: '/products?category=accessories',
      icon: '🎧',
      subcategories: [
        {
          title: 'Input Devices',
          items: [
            { name: 'Keyboards', href: '/products?category=accessories&type=keyboard' },
            { name: 'Mice', href: '/products?category=accessories&type=mouse' },
            { name: 'Webcams', href: '/products?category=accessories&type=webcam' },
          ]
        },
        {
          title: 'Audio & Display',
          items: [
            { name: 'Monitors', href: '/products?category=accessories&type=monitor' },
            { name: 'Headsets', href: '/products?category=accessories&type=headset' },
            { name: 'Speakers', href: '/products?category=accessories&type=speaker' },
            { name: 'Microphones', href: '/products?category=accessories&type=microphone' },
          ]
        }
      ]
    },
    {
      name: 'Storage & Memory',
      href: '/products?category=storage',
      icon: '💾',
      subcategories: [
        {
          title: 'Storage Devices',
          items: [
            { name: 'Hard Drives (HDD)', href: '/products?category=storage&type=hdd' },
            { name: 'Solid State Drives (SSD)', href: '/products?category=storage&type=ssd' },
            { name: 'USB Flash Drives', href: '/products?category=storage&type=usb' },
            { name: 'Memory Cards', href: '/products?category=storage&type=card' },
          ]
        },
        {
          title: 'Memory',
          items: [
            { name: 'RAM Modules', href: '/products?category=storage&type=ram' },
            { name: 'External Storage', href: '/products?category=storage&type=external' },
          ]
        }
      ]
    },
    {
      name: 'Networking',
      href: '/products?category=networking',
      icon: '🌐',
      subcategories: [
        {
          title: 'Network Equipment',
          items: [
            { name: 'Routers', href: '/products?category=networking&type=router' },
            { name: 'Switches', href: '/products?category=networking&type=switch' },
            { name: 'WiFi Adapters', href: '/products?category=networking&type=adapter' },
            { name: 'Network Cables', href: '/products?category=networking&type=cable' },
            { name: 'Modems', href: '/products?category=networking&type=modem' },
          ]
        }
      ]
    },
    {
      name: 'Printers & Scanners',
      href: '/products?category=printers',
      icon: '🖨️',
      subcategories: [
        {
          title: 'Printers',
          items: [
            { name: 'Inkjet Printers', href: '/products?category=printers&type=inkjet' },
            { name: 'Laser Printers', href: '/products?category=printers&type=laser' },
            { name: 'All-in-One Printers', href: '/products?category=printers&type=allinone' },
          ]
        },
        {
          title: 'Brands & Supplies',
          items: [
            { name: 'HP Printers', href: '/products?category=printers&brand=hp' },
            { name: 'Canon Printers', href: '/products?category=printers&brand=canon' },
            { name: 'Epson Printers', href: '/products?category=printers&brand=epson' },
            { name: 'Printer Supplies', href: '/products?category=printers&type=supplies' },
          ]
        }
      ]
    },
    {
      name: 'Software',
      href: '/products?category=software',
      icon: '💿',
      subcategories: [
        {
          title: 'Software Categories',
          items: [
            { name: 'Operating Systems', href: '/products?category=software&type=os' },
            { name: 'Microsoft Office', href: '/products?category=software&type=office' },
            { name: 'Antivirus & Security', href: '/products?category=software&type=antivirus' },
            { name: 'Design Software', href: '/products?category=software&type=design' },
            { name: 'Business Software', href: '/products?category=software&type=business' },
          ]
        }
      ]
    },
    {
      name: 'Repairs & Services',
      href: '/repairs',
      icon: '🔧',
      subcategories: [
        {
          title: 'Repair Services',
          items: [
            { name: 'Computer Repair', href: '/repairs?type=computer' },
            { name: 'Laptop Repair', href: '/repairs?type=laptop' },
            { name: 'Phone Repair', href: '/repairs?type=phone' },
            { name: 'Data Recovery', href: '/repairs?type=data-recovery' },
          ]
        },
        {
          title: 'Other Services',
          items: [
            { name: 'Hardware Upgrades', href: '/repairs?type=upgrade' },
            { name: 'Software Installation', href: '/repairs?type=software' },
            { name: 'Network Setup', href: '/repairs?type=network' },
          ]
        }
      ]
    },
  ];

  return (
    <>
      {/* Top Promo Bar with Contact Info */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+254 700 123 456</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">info@fasthub.co.ke</span>
            </div>
          </div>
          
          {/* Rotating Promo Messages */}
          <div className="flex-1 flex justify-center items-center space-x-2">
            <Zap className="h-4 w-4 animate-pulse" />
            <Link href={promoSlides[currentSlide].link} className="hover:underline font-semibold">
              {promoSlides[currentSlide].text}
            </Link>
            <Zap className="h-4 w-4 animate-pulse" />
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-xs">Follow Us:</span>
            <div className="flex space-x-2">
              <a href="#" className="hover:text-orange-200 transition-colors">FB</a>
              <a href="#" className="hover:text-orange-200 transition-colors">TW</a>
              <a href="#" className="hover:text-orange-200 transition-colors">IG</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Toggle Menu Button & Logo */}
            <div className="flex items-center space-x-4">
              {/* Category Menu Toggle Button */}
              <Link href="/products">
                <Button
                  ref={categoryButtonRef}
                  variant="outline"
                  size="sm"
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  className="flex items-center space-x-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="hidden sm:inline font-semibold">Categories</span>
                </Button>
              </Link>

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
            </div>

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
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
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
        </div>
      </header>

      {/* Category Dropdown Menu */}
      {isCategoryMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-50 pointer-events-none"
          />
          
          {/* Dropdown Menu - Positioned below button */}
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${buttonPosition.top + 8}px`,
              left: `${buttonPosition.left}px`,
              minWidth: '280px',
            }}
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            {/* Pointer Arrow */}
            <div 
              className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"
              style={{ left: '20px' }}
            />
            
            {/* Desktop Layout */}
            <div className="hidden md:flex rounded-lg overflow-hidden border border-gray-200">
              {/* Left Sidebar - Categories */}
              <div className="w-64 bg-gradient-to-b from-orange-50 to-white border-r border-gray-200 max-h-[70vh] overflow-y-auto">
                <div className="p-3 bg-orange-600 text-white sticky top-0 z-10">
                  <h3 className="text-sm font-bold">All Categories</h3>
                </div>
                
                <nav className="p-2">
                  {categoryMenu.map((category) => (
                    <div
                      key={category.name}
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      className="mb-1"
                    >
                      <Link
                        href={category.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm ${
                          hoveredCategory === category.name
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'hover:bg-orange-100 text-gray-700'
                        }`}
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>
              
              {/* Right Panel - Subcategories */}
              <div className="w-96 p-4 max-h-[70vh] overflow-y-auto bg-white">
                {hoveredCategory ? (
                  <div>
                    {categoryMenu
                      .find((cat) => cat.name === hoveredCategory)
                      ?.subcategories.map((subcat, idx) => (
                        <div key={idx} className="mb-4">
                          <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2 flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {subcat.title}
                          </h4>
                          <div className="space-y-1">
                            {subcat.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all"
                                onClick={() => setIsCategoryMenuOpen(false)}
                              >
                                <Package className="h-3 w-3 text-gray-400" />
                                <span>{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    
                    {/* View All Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        href={categoryMenu.find((cat) => cat.name === hoveredCategory)?.href || '/products'}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        View All {hoveredCategory}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Hover over a category</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden rounded-lg overflow-hidden border border-gray-200 max-h-[80vh] overflow-y-auto">
              <div className="p-3 bg-orange-600 text-white flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-sm font-bold">All Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  className="text-white hover:bg-orange-700 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-2 bg-white">
                {categoryMenu.map((category) => (
                  <div key={category.name} className="mb-2">
                    <Link
                      href={category.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-orange-50 text-gray-700 text-sm font-medium"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} />
    </>
  );
};

export default Header;
