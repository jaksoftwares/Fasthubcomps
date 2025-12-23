'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Wrench, Users, Settings, Menu, X, LogOut, Chrome as Home, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // If there's no user or the user is not an admin, redirect away
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    router.push('/');
  };

  const mainNavigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Repairs', href: '/admin/repairs', icon: Wrench },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <Link href="/admin" className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Fasthub</span>
            <span className="text-xs text-gray-500">Admin panel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="px-2 py-4 space-y-4 text-sm">
          <div>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Management</p>
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center rounded-md px-3 py-2 font-medium transition-colors ${
                      active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Configuration</p>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center rounded-md px-3 py-2 font-medium transition-colors ${
                      active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="mt-auto px-2 py-4 border-t border-gray-200 space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start text-sm">
              <Home className="h-4 w-4 mr-2" />
              Back to store
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>

        <footer className="flex-shrink-0 border-t border-gray-200 px-4 py-3 text-xs text-gray-500 flex items-center justify-between bg-white">
          <span>© {new Date().getFullYear()} Fasthub Computers</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;