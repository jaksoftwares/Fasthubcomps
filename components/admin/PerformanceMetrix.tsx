'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
  progress?: number;
}

const PerformanceMetrix = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    // Mock data for performance metrics
    const mockMetrics: Metric[] = [
      {
        title: 'Total Revenue',
        value: 'KSh 2,450,000',
        change: 12.5,
        changeType: 'increase',
        icon: DollarSign,
        color: 'text-green-600',
        progress: 85
      },
      {
        title: 'Orders Completed',
        value: '1,247',
        change: 8.2,
        changeType: 'increase',
        icon: CheckCircle,
        color: 'text-blue-600',
        progress: 92
      },
      {
        title: 'Customer Satisfaction',
        value: '94.8%',
        change: -2.1,
        changeType: 'decrease',
        icon: Users,
        color: 'text-purple-600',
        progress: 95
      },
      {
        title: 'Average Order Value',
        value: 'KSh 1,970',
        change: 5.7,
        changeType: 'increase',
        icon: ShoppingCart,
        color: 'text-orange-600',
        progress: 78
      },
      {
        title: 'Conversion Rate',
        value: '3.24%',
        change: 15.3,
        changeType: 'increase',
        icon: Target,
        color: 'text-indigo-600',
        progress: 65
      },
      {
        title: 'Processing Time',
        value: '2.3 hrs',
        change: -8.5,
        changeType: 'decrease',
        icon: Clock,
        color: 'text-red-600',
        progress: 88
      }
    ];
    setMetrics(mockMetrics);
  }, []);

  const formatChange = (change: number, type: 'increase' | 'decrease') => {
    const sign = type === 'increase' ? '+' : '';
    return `${sign}${change}%`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Performance Metrics
        </CardTitle>
        <p className="text-sm text-gray-600">Key performance indicators</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            const TrendIcon = metric.changeType === 'increase' ? TrendingUp : TrendingDown;
            const trendColor = metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600';

            return (
              <div
                key={metric.title}
                className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  <Badge
                    className={`flex items-center gap-1 ${
                      metric.changeType === 'increase'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    } border text-xs font-medium`}
                  >
                    <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                    {formatChange(metric.change, metric.changeType)}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>

                {metric.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{metric.progress}%</span>
                    </div>
                    <Progress
                      value={metric.progress}
                      className={cn(
                        "h-2",
                        metric.changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrix;
