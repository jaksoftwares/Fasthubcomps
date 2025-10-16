'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrders from '@/components/admin/RecentOrders';
import SalesChart from '@/components/admin/SalesChart';
import QuickActions from '@/components/admin/QuickActions';
import PerformanceMetrix from '@/components/admin/PerformanceMetrix';

const EnhancedAdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-lg font-semibold text-gray-900">Today, 2:45 PM</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <DashboardStats />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart />
            <PerformanceMetrix />
          </div>

          {/* Orders and Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentOrders />
            </div>
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EnhancedAdminDashboard;