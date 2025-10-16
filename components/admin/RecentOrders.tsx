import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Activity, Package, Clock, ArrowRight } from 'lucide-react';
import { OrdersAPI } from '@/lib/services/orders';
import Image from 'next/image';

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  products: string;
  amount: number;
  status: 'completed' | 'processing' | 'shipped' | 'pending';
  date: string;
  paymentMethod: string;
  avatar: string;
}

const EnhancedRecentOrders = () => {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'John Kamau',
      customerEmail: 'john@example.com',
      products: 'Dell Laptop XPS 15, Wireless Mouse',
      amount: 125000,
      status: 'completed',
      date: '2024-10-15',
      paymentMethod: 'M-Pesa',
      avatar: 'JK'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Wanjiku',
      customerEmail: 'sarah@example.com',
      products: 'HP Printer, Ink Cartridges',
      amount: 45000,
      status: 'processing',
      date: '2024-10-15',
      paymentMethod: 'Card',
      avatar: 'SW'
    },
    {
      id: 'ORD-003',
      customer: 'David Omondi',
      customerEmail: 'david@example.com',
      products: 'MacBook Pro 14"',
      amount: 280000,
      status: 'shipped',
      date: '2024-10-14',
      paymentMethod: 'M-Pesa',
      avatar: 'DO'
    },
    {
      id: 'ORD-004',
      customer: 'Mary Achieng',
      customerEmail: 'mary@example.com',
      products: 'Gaming Keyboard, RGB Mouse',
      amount: 15000,
      status: 'pending',
      date: '2024-10-14',
      paymentMethod: 'Cash',
      avatar: 'MA'
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      completed: {
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-600'
      },
      processing: {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Activity,
        iconColor: 'text-blue-600'
      },
      shipped: {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Package,
        iconColor: 'text-purple-600'
      },
      pending: {
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600'
      }
    };
    return configs[status] || configs.pending;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Latest customer transactions</p>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-0">{orders.length} orders</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={order.id} 
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {order.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <Badge className={`${statusConfig.color} border text-xs font-medium flex items-center gap-1`}>
                        <StatusIcon className={`h-3 w-3 ${statusConfig.iconColor}`} />
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                    <p className="text-xs text-gray-500 truncate max-w-md">{order.products}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{order.paymentMethod}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{order.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex flex-col items-end gap-2">
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(order.amount)}
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-md transition-all duration-300"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-semibold">
            View All Orders
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecentOrders;
