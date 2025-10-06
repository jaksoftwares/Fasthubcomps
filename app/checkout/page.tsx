'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { OrdersAPI } from '@/lib/services/orders';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuthModal } from '@/contexts/AuthModalContext';

const CheckoutPage = () => {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { isOpen: isAuthOpen, open: openAuthModal, close: closeAuthModal } = useAuthModal();
  const [currentStep, setCurrentStep] = useState(1);

  const [orderData, setOrderData] = useState({
    orderId: null as number | null,
    shipping: {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
    },
    payment: {
      method: '',
      type: '',
      data: {},
      status: '',
      reference: null,
    },
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);



  useEffect(() => {
    if (!isLoading && !user) {
      openAuthModal();
    }
  }, [user, isLoading, openAuthModal]);

  if (!user && !isLoading) {
    // Block checkout UI, show header/footer only, modal will be open
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to continue checkout</h1>
            <p className="text-gray-600 mb-8">Please sign in to proceed with your order.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart before checking out.</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Shipping Information', completed: currentStep > 1 },
    { id: 2, name: 'Payment Method', completed: currentStep > 2 },
    { id: 3, name: 'Review & Place Order', completed: false },
  ];



  const handleStepComplete = async (stepData: any) => {
    if (stepData.shipping) {
      // Create order when shipping is completed
      try {
        const orderPayload = {
          customer_id: user!.id,
          products: cartState.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cartState.total,
          payment_method: 'Pending', // Will be updated later
          shipping_address: stepData.shipping,
        };
        const order = await OrdersAPI.create(orderPayload);
        stepData.orderId = order.id;
      } catch (error) {
        console.error('Failed to create order:', error);
        setPaymentError('Failed to create order.');
        return;
      }
    }

    // If payment step, check for payment status
    if (stepData.payment && stepData.payment.type === 'mpesa') {
      if (stepData.payment.status === 'pending') {
        setPaymentStatus('pending');
      } else if (stepData.payment.status === 'failed') {
        setPaymentStatus('failed');
        setPaymentError('M-Pesa payment failed.');
      } else {
        setPaymentStatus('success');
      }
    }
    setOrderData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    // Here you would create the order and payment record if needed
    try {
      // If payment is pending, block order placement
      if (orderData.payment && orderData.payment.type === 'mpesa' && paymentStatus === 'pending') {
        setPaymentError('Please complete the M-Pesa payment on your phone.');
        return;
      }
      // TODO: Call OrdersAPI to create order, associate payment, etc.
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      setPaymentError('Order placement failed.');
      console.error('Order placement failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/cart">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Cart</span>
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed || currentStep === step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step.completed ? '✓' : step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed || currentStep === step.id
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <CheckoutForm onComplete={handleStepComplete} />
            )}
            {currentStep === 2 && (
              <PaymentMethods 
                onComplete={handleStepComplete}
                amount={cartState.total}
                orderId={orderData.orderId || 1} // TODO: Replace with real orderId after order creation
                productName={cartState.items.length === 1 ? cartState.items[0].name : 'Multiple Products'}
              />
            )}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{orderData.shipping.name}</p>
                      <p>{orderData.shipping.address}</p>
                      <p>{orderData.shipping.city}, {orderData.shipping.postalCode}</p>
                      <p>{orderData.shipping.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600">{orderData.payment.method}</p>
                  </div>
                  {orderData.payment && orderData.payment.type === 'mpesa' && paymentStatus === 'pending' && (
                    <div className="text-yellow-700 bg-yellow-100 rounded p-2 mt-2 text-sm">
                      Awaiting M-Pesa payment confirmation. Please complete the payment on your phone.
                    </div>
                  )}
                  {paymentError && (
                    <div className="text-red-600 text-sm mt-2">{paymentError}</div>
                  )}
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                  disabled={orderData.payment && orderData.payment.type === 'mpesa' && paymentStatus === 'pending'}
                >
                  Place Order
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;