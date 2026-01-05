'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const submitSearch = (q: string) => {
    const query = q.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/products');
    }
  };
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isClickOpened, setIsClickOpened] = useState(false);
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState<any | null>(null);

  // Keep a local displayUser in sync with context user and localStorage
  useEffect(() => {
    // Always prioritize context user over localStorage
    if (user) {
      setDisplayUser(user);
      return;
    }

    // Only use localStorage if context user is null (not yet loaded or logged out)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fasthub-user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDisplayUser(parsed);
        } catch (e) {
          setDisplayUser(null);
        }
      } else {
        setDisplayUser(null);
      }
    }
  }, [user]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
      }
    };
  }, [closeTimer]);

  // Close account dropdown when user logs in/out
  useEffect(() => {
    setIsAccountOpen(false);
  }, [user]);

  // Promo slides for the top bar
  const promoSlides = [
    { text: 'Up to 30% Off on Selected Items', link: '/products' },
    { text: 'Fast Delivery Across Kenya', link: '/products' },
    { text: 'Latest Laptops & Gaming Gear Available', link: '/products?category=laptops' },
    { text: 'Professional Repair Services', link: '/repairs' },
  ];

  // Background images for the top bar
  const backgroundImages = [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=2000&q=80',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promoSlides.length]);

  // Clear close timer when menu opens
  useEffect(() => {
    if (isCategoryMenuOpen) {
      if (closeTimer) {
        clearTimeout(closeTimer);
        setCloseTimer(null);
      }
    }
  }, [isCategoryMenuOpen, closeTimer]);

  // Update button position when menu opens
  useEffect(() => {
    if (isCategoryMenuOpen && typeof window !== 'undefined' && categoryButtonRef.current) {
      const rect = categoryButtonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const menuWidth = 320; // approximate dropdown width
      const padding = 16; // keep dropdown away from very edge

      const clampedLeft = Math.min(
        Math.max(rect.left, padding),
        Math.max(padding, viewportWidth - menuWidth - padding)
      );

      setButtonPosition({
        top: rect.bottom, // viewport coordinates
        left: clampedLeft,
        width: rect.width,
      });
    }
  }, [isCategoryMenuOpen]);

  // Update position when window scrolls to keep modal aligned
  useEffect(() => {
    const handleScroll = () => {
      if (isCategoryMenuOpen && typeof window !== 'undefined' && categoryButtonRef.current) {
        const rect = categoryButtonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const menuWidth = 320;
        const padding = 16;

        // Close modal if button is too far from viewport (more than 200px away)
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
          setIsCategoryMenuOpen(false);
          setIsClickOpened(false);
          return;
        }

        const clampedLeft = Math.min(
          Math.max(rect.left, padding),
          Math.max(padding, viewportWidth - menuWidth - padding)
        );

        setButtonPosition({
          top: rect.bottom,
          left: clampedLeft,
          width: rect.width,
        });
      }
    };

    if (isCategoryMenuOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isCategoryMenuOpen]);

  // Handle click to toggle menu
  const handleCategoryButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCategoryMenuOpen) {
      setIsCategoryMenuOpen(false);
      setIsClickOpened(false);
    } else {
      setIsCategoryMenuOpen(true);
      setIsClickOpened(true);
    }
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      setCloseTimer(null);
    }
    setIsCategoryMenuOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    if (isClickOpened) {
      // If opened by click, delay closing to allow navigation
      const timer = setTimeout(() => {
        setIsCategoryMenuOpen(false);
        setIsClickOpened(false);
      }, 1000); // 1 second delay
      setCloseTimer(timer);
    } else {
      // If opened by hover, close immediately
      setIsCategoryMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCategoryMenuOpen && categoryButtonRef.current) {
        const target = event.target as Element;
        if (!categoryButtonRef.current.contains(target)) {
          setIsCategoryMenuOpen(false);
          setIsClickOpened(false);
        }
      }
    };

    if (isCategoryMenuOpen && isClickOpened) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoryMenuOpen, isClickOpened]);

  // Comprehensive category menu with detailed brands/subcategories
  const categoryMenu = [
    {
      name: 'Computers',
      // Map to "desktops" category which is backed by the real Supabase category_id
      href: '/products?category=desktops',
      icon: '💻',
      subcategories: [
        {
          title: 'By Type',
          items: [
            { name: 'Desktop Computers', href: '/products?category=desktops&type=desktop' },
            { name: 'All-in-One PCs', href: '/products?category=desktops&type=all-in-one' },
            { name: 'Gaming PCs', href: '/products?category=desktops&type=gaming' },
            { name: 'Workstations', href: '/products?category=desktops&type=workstation' },
          ]
        },
        {
          title: 'By Brand',
          items: [
            { name: 'Dell Computers', href: '/products?category=desktops&brand=dell' },
            { name: 'HP Computers', href: '/products?category=desktops&brand=hp' },
            { name: 'Lenovo Computers', href: '/products?category=desktops&brand=lenovo' },
            { name: 'Apple iMac', href: '/products?category=desktops&brand=apple' },
            { name: 'ASUS Computers', href: '/products?category=desktops&brand=asus' },
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
      // Use the real slug used by the products page/category mapping
      href: '/products?category=phones-tablets',
      icon: '📱',
      subcategories: [
        {
          title: 'By Type',
          items: [
            { name: 'Smartphones', href: '/products?category=phones-tablets&type=smartphone' },
            { name: 'Feature Phones', href: '/products?category=phones-tablets&type=feature' },
            { name: 'Tablets', href: '/products?category=phones-tablets&type=tablet' },
          ]
        },
        {
          title: 'By Brand',
          items: [
            { name: 'Samsung', href: '/products?category=phones-tablets&brand=samsung' },
            { name: 'Apple iPhone', href: '/products?category=phones-tablets&brand=apple' },
            { name: 'Xiaomi', href: '/products?category=phones-tablets&brand=xiaomi' },
            { name: 'Oppo', href: '/products?category=phones-tablets&brand=oppo' },
            { name: 'Tecno', href: '/products?category=phones-tablets&brand=tecno' },
            { name: 'Infinix', href: '/products?category=phones-tablets&brand=infinix' },
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
      // No dedicated "software" category in the main mapping; use search-based links
      href: '/products?search=software',
      icon: '💿',
      subcategories: [
        {
          title: 'Software Categories',
          items: [
            { name: 'Operating Systems', href: '/products?search=operating%20system' },
            { name: 'Microsoft Office', href: '/products?search=microsoft%20office' },
            { name: 'Antivirus & Security', href: '/products?search=antivirus' },
            { name: 'Design Software', href: '/products?search=design%20software' },
            { name: 'Business Software', href: '/products?search=business%20software' },
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
      <div className="relative bg-gray-900 text-white py-2 px-3 sm:px-4 overflow-hidden">
        {/* Rotating Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-50"
          style={{
            backgroundImage: `url('${backgroundImages[currentSlide]}')`
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <a 
              href="tel:+254715242502"
              className="flex items-center space-x-1 hover:text-blue-300 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+254 715 242 502</span>
            </a>
            <a 
              href="mailto:info@fasthub.co.ke"
              className="flex items-center space-x-1 hover:text-blue-300 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">info@fasthub.co.ke</span>
            </a>
          </div>
          
          {/* Rotating Promo Messages */}
          <div className="flex-1 flex justify-center items-center space-x-2 text-center text-[11px] sm:text-xs">
            <Zap className="h-4 w-4 animate-pulse text-yellow-300" />
            <Link href={promoSlides[currentSlide].link} className="hover:underline font-semibold">
              {promoSlides[currentSlide].text}
            </Link>
            <Zap className="h-4 w-4 animate-pulse text-yellow-300" />
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <span className="text-xs">Follow Us:</span>
            <div className="flex space-x-2">
              <a
                href="https://x.com/fasthubcomps"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-200 transition-colors"
              >
                X
              </a>
              <a
                href="https://www.tiktok.com/@fasthubcomps"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-200 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-auto py-3">
            {/* Toggle Menu Button & Logo */}
            <div className="flex items-center space-x-3 py-1 pr-3">
              {/* Category Menu Toggle Button */}
              <Button
                ref={categoryButtonRef}
                variant="outline"
                size="sm"
                onClick={handleCategoryButtonClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center space-x-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 ${
                  isCategoryMenuOpen ? 'bg-orange-50' : ''
                }`}
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline font-semibold">Categories</span>
              </Button>

              {/* Logo (image only) */}
              <Link href="/" className="flex items-center shrink-0">
                <Image
                  src="/fasthub-logo-image.jpg"
                  alt="FastHub Logo"
                  width={200}
                  height={72}
                  className="h-8 sm:h-12 w-auto -mr-[24px] -mt-4 sm:-mt-4"
                />
                <Image
                  src="/fasthub-logo.jpg"
                  alt="FastHub Computers"
                  width={200}
                  height={72}
                  className="h-8 sm:h-12 w-auto"
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 py-2">
              <form
                className="relative w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch(searchQuery);
                }}
              >
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      submitSearch(searchQuery);
                    }
                  }}
                  className="pl-10 pr-12"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-orange-500 text-white rounded"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-4 py-2 flex-shrink-0">
              {/* User Account / Dropdown */}
              <div className="relative">
                {displayUser ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsAccountOpen((s) => !s)}
                      className="flex items-center space-x-2 rounded-md hover:bg-gray-100 px-2 py-1"
                    >
                      <span className="hidden md:block text-sm">Hi, {displayUser.name}</span>
                    </button>

                    {isAccountOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link href="/account/profile" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                            Profile
                          </Link>
                          <Link href="/account/orders" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                            Orders
                          </Link>
                          <Link href="/account/settings" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                            Settings
                          </Link>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              logout();
                              setIsAccountOpen(false);
                            }}
                          >
                            Logout
                          </button>
                          {displayUser.role === 'admin' && (
                            <Link href="/admin" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsAccountOpen(false)}>
                              Admin Panel
                            </Link>
                          )}
                        </div>
                      </div>
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

          {/* Mobile Search (full-width, sits below header row on small screens) */}
          <div className="md:hidden mt-2 px-3 w-full">
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(searchQuery);
              }}
            >
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitSearch(searchQuery);
                  }
                }}
                className="pl-10 pr-12 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-orange-500 text-white rounded"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
                  onClick={() => {
                    setIsCategoryMenuOpen(false);
                    setIsClickOpened(false);
                  }}
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
