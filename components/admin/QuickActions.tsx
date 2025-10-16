'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Package,
  Users,
  Wrench,
  BarChart3,
  Settings,
  ShoppingCart,
  FileText
} from 'lucide-react';
import Link from 'next/link';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add Product',
      description: 'Add a new product to inventory',
      icon: Plus,
      href: '/admin/products',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'New Order',
      description: 'Create a new customer order',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Repair Request',
      description: 'Create a new repair request',
      icon: Wrench,
      href: '/admin/repairs',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'View Reports',
      description: 'Check analytics and reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
        <p className="text-sm text-gray-600">Common administrative tasks</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 flex flex-col items-center gap-3 border-2 hover:border-transparent transition-all duration-300 ${action.color} text-white border-transparent hover:shadow-lg`}
                >
                  <IconComponent className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-90 mt-1">{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;