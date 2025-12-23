'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, ShoppingCart, Users, Package, Zap, BarChart3, User, Mail, Clock } from 'lucide-react';

interface AdminDashboardClientProps {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    newCustomersThisMonth: number;
    newOrdersThisMonth: number;
    fulfillmentRate: number;
    fulfilledOrders: number;
  };
  formattedRevenue: string;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  trend?: string;
  color: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-green-600 font-medium">{trend}</p>}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const ActionCard = ({ 
  href, 
  icon: Icon, 
  title, 
  description 
}: { 
  href: string; 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <Link 
    href={href} 
    className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all"
  >
    <div className="flex items-start space-x-4">
      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-gray-400 group-hover:text-gray-600 transition-colors">→</div>
    </div>
  </Link>
);

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ stats, formattedRevenue }) => {
  const { user, isLoading } = useAuth();

  // Format current date for display
  const currentDate = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, []);

  const getTrendMessage = (value: number, label: string) => {
    if (value === 0) return 'No new ' + label.toLowerCase() + ' yet';
    if (value === 1) return `${value} new ${label.toLowerCase().slice(0, -1)}`;
    return `${value} new ${label.toLowerCase()}`;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 py-8 lg:px-8 space-y-8">
        {/* Admin User Info Section */}
        {!isLoading && user && (
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-500 text-white">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Signed in as</p>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name || user.email}</h2>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-blue-700 font-medium">
                    <Clock className="h-3 w-3" />
                    <span>{currentDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Admin</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Full Access</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Here's your store overview with real-time statistics.</p>
        </div>

        {/* Key Metrics - with real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={stats.totalOrders}
            trend={getTrendMessage(stats.newOrdersThisMonth, 'orders this month')}
            color="bg-blue-500"
          />
          <StatCard
            icon={Package}
            label="Total Products"
            value={stats.totalProducts}
            trend={stats.totalProducts > 0 ? `${stats.totalProducts} in catalog` : 'No products yet'}
            color="bg-green-500"
          />
          <StatCard
            icon={Users}
            label="Total Customers"
            value={stats.totalCustomers}
            trend={getTrendMessage(stats.newCustomersThisMonth, 'customers this month')}
            color="bg-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Revenue"
            value={formattedRevenue}
            trend={`${stats.fulfillmentRate}% orders fulfilled`}
            color="bg-amber-500"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600 mt-1">Access your most-used features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              href="/admin/products"
              icon={Package}
              title="Manage Products"
              description={`${stats.totalProducts} products in your catalog`}
            />
            <ActionCard
              href="/admin/orders"
              icon={ShoppingCart}
              title="View Orders"
              description={`${stats.totalOrders} total orders (${stats.fulfillmentRate}% fulfilled)`}
            />
            <ActionCard
              href="/admin/categories"
              icon={Zap}
              title="Manage Categories"
              description="Organize products into categories"
            />
            <ActionCard
              href="/admin/customers"
              icon={Users}
              title="Manage Customers"
              description={`${stats.totalCustomers} customer${stats.totalCustomers !== 1 ? 's' : ''} in database`}
            />
            <ActionCard
              href="/admin/repairs"
              icon={BarChart3}
              title="Repair Requests"
              description="Handle device repair requests"
            />
            <ActionCard
              href="/admin/settings"
              icon={Zap}
              title="Settings"
              description="Configure store settings and preferences"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900">💡 Tip</h3>
            <p className="mt-2 text-sm text-blue-800">
              Keep your product inventory updated regularly to avoid overselling and maintain accurate stock levels.
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-semibold text-green-900">✨ What's New</h3>
            <p className="mt-2 text-sm text-green-800">
              Your dashboard now shows real-time statistics based on your actual store data. All metrics are accurate and up-to-date!
            </p>
          </div>
        </div>

        {/* Stats Summary - with real data */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Store Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.fulfilledOrders}</p>
              <p className="text-xs text-gray-600 mt-1">Orders Fulfilled ({stats.fulfillmentRate}%)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-600 mt-1">Total Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-gray-600 mt-1">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-600 mt-1">Total Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
