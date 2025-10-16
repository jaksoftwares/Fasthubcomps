'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


const DashboardStats = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Revenue',
      value: 'KES 2,456,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      accentColor: 'border-emerald-500',
      description: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      accentColor: 'border-blue-500',
      description: '45 pending'
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      accentColor: 'border-purple-500',
      description: '23 new this week'
    },
    {
      title: 'Products Listed',
      value: '456',
      change: '+3.1%',
      trend: 'up',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      accentColor: 'border-orange-500',
      description: '12 low stock'
    }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const isPositive = stat.trend === 'up';
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className={`border-l-4 ${stat.accentColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-semibold">{stat.change}</span>
                </div>
                <span className="text-xs text-gray-500">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;