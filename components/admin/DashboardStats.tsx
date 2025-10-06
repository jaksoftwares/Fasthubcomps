import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { AnalyticsAPI } from '@/lib/services/analytics';

const DashboardStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await AnalyticsAPI.stats();
        // Map backend data to UI format if needed
        setStats(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatChange = (change: string, trend: string) => {
    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center ${colorClass}`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">{change}</span>
      </div>
    );
  };

  // Remove window.* usage and use backend stats data
  // Map backend stats to UI format for cards
  const mappedStats = Array.isArray(stats) ? stats.map((stat: any) => ({
    title: stat.title || stat.name || '',
    value: stat.value ?? stat.count ?? 0,
    change: stat.change ?? '0%',
    trend: stat.trend ?? 'up',
    icon:
      stat.title?.toLowerCase().includes('order') ? ShoppingCart :
      stat.title?.toLowerCase().includes('customer') ? Users :
      stat.title?.toLowerCase().includes('product') ? Package :
      stat.title?.toLowerCase().includes('repair') ? TrendingUp :
      DollarSign,
    color:
      stat.title?.toLowerCase().includes('order') ? 'text-yellow-600' :
      stat.title?.toLowerCase().includes('customer') ? 'text-blue-600' :
      stat.title?.toLowerCase().includes('product') ? 'text-red-600' :
      stat.title?.toLowerCase().includes('repair') ? 'text-green-600' :
      'text-gray-600',
    bgColor:
      stat.title?.toLowerCase().includes('order') ? 'bg-yellow-100' :
      stat.title?.toLowerCase().includes('customer') ? 'bg-blue-100' :
      stat.title?.toLowerCase().includes('product') ? 'bg-red-100' :
      stat.title?.toLowerCase().includes('repair') ? 'bg-green-100' :
      'bg-gray-100',
  })) : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mappedStats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              {formatChange(stat.change, stat.trend)}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;