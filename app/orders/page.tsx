"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { OrdersAPI } from "@/lib/services/orders";
import { Loader2, PackageCheck, PackageX } from "lucide-react";

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // You may need to pass a token or user id depending on your API
        const data = await OrdersAPI.getMyOrders(user.id);
        setOrders(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Please sign in to view your orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 py-16">
          <PackageX className="mx-auto mb-4 h-10 w-10 text-gray-400" />
          <p>You have not placed any orders yet.</p>
          <Link href="/products">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <div className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  {order.status === "delivered" ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <PackageCheck className="h-5 w-5 mr-1" /> Delivered
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 font-medium">
                      <Loader2 className="h-5 w-5 mr-1 animate-spin" /> {order.status}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Total:</span> KSh {order.total}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Payment:</span> {order.payment_method}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Shipping:</span> {order.shipping_method}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" className="w-full md:w-auto">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
