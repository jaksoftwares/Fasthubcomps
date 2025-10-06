import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { OrdersAPI } from '@/lib/services/orders';
import Image from 'next/image';

const RecentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await OrdersAPI.getAll();
        // Map backend order data to frontend format
        const mapped = Array.isArray(data)
          ? data.map(order => ({
              id: order.id ?? order.order_id ?? '',
              customer: order.customer?.name || order.customer_name || '',
              customerEmail: order.customer?.email || order.customer_email || '',
              products: Array.isArray(order.products)
                ? order.products.map((p: any) => p.name).join(', ')
                : '',
              productImages: Array.isArray(order.products)
                ? order.products.map((p: any) => p.image || p.images?.[0] || '').filter(Boolean)
                : [],
              amount: order.total,
              status: order.status || 'pending',
              date: order.date || '',
              paymentMethod: order.payment_method || '',
              shippingAddress: order.shipping_address?.street || '',
            }))
          : [];
        // Sort by date descending and take the latest 5
        const sorted = mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
        setOrders(sorted);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch recent orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse flex flex-col space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 bg-gray-200 rounded w-1/4 h-4"></span>
                    <div className="bg-gray-200 rounded-full w-20 h-6"></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 bg-gray-200 rounded h-4 w-3/4"></p>
                  <p className="text-sm text-gray-500 bg-gray-200 rounded h-4 w-1/2"></p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900 mb-1 bg-gray-200 rounded h-4 w-1/4"></p>
                  <p className="text-xs text-gray-500 mb-2 bg-gray-200 rounded h-3 w-1/3"></p>
                  <div className="bg-gray-200 rounded-full w-24 h-8"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 flex items-center space-x-4">
                {/* Show first product image if available */}
                {order.productImages.length > 0 && (
                  <Image
                    src={order.productImages[0]}
                    alt={order.products}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.products}</p>
                  <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                  <p className="text-xs text-gray-400">{order.shippingAddress}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-gray-900 mb-1">
                  {formatPrice(order.amount)}
                </p>
                <p className="text-xs text-gray-500 mb-2">{order.date}</p>
                <Button size="sm" variant="outline">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Orders</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;