"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OrderConfirmationPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Thank you for your order!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-gray-700 text-center">
            Your order has been placed successfully.<br />
            We&apos;ve sent a confirmation email and SMS with your order details.
          </p>
          <div className="w-full flex flex-col md:flex-row gap-2 mt-4">
            <Link href="/orders" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View My Orders
              </Button>
            </Link>
            <Link href="/products" className="w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
