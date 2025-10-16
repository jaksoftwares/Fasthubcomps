'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wrench, 
  Users, 
  Settings, 
  ChartBar as BarChart3, 
  Menu, 
  X, 
  LogOut, 
  Chrome as Home,
  Bell,
  Search,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EnhancedAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
    { name: 'Products', href: '/admin/products', icon: Package, badge: '12' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: '45' },
    { name: 'Repairs', href: '/admin/repairs', icon: Wrench, badge: '8' },
    { name: 'Customers', href: '/admin/customers', icon: Users, badge: null },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, badge: null },
    { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">FastHub</h2>
                <p className="text-xs text-blue-200">Admin Panel</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                AD
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Admin User</p>
                <p className="text-blue-200 text-xs">admin@fasthub.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-blue-200" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider px-3 mb-3">
              Main Menu
            </p>
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-red-500 text-white border-0 text-xs px-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white">
                <Home className="h-4 w-4 mr-3" />
                Back to Store
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-96">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search products, orders, customers..." 
                    className="bg-transparent outline-none text-sm text-gray-700 w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </Button>

                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white/50 backdrop-blur-lg border-t border-gray-200 px-6 py-4 mt-12">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 FastHub Computers. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="hover:text-blue-600">Privacy</Link>
              <Link href="#" className="hover:text-blue-600">Terms</Link>
              <Link href="#" className="hover:text-blue-600">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EnhancedAdminLayout;