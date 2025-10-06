'use client';

import React, { useState } from 'react';
import { PaymentsAPI } from '@/lib/services/payments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';

interface PaymentMethodsProps {
  onComplete: (data: any) => void;
  amount?: number;
  orderId?: number;
  productName?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onComplete, amount, orderId, productName }) => {
  const [selectedMethod, setSelectedMethod] = useState('mpesa');
  const [paymentData, setPaymentData] = useState({
    mpesaPhone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay with your M-Pesa mobile money',
      icon: Smartphone,
      popular: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      popular: false,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Banknote,
      popular: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let method = '';
    switch (selectedMethod) {
      case 'mpesa':
        method = `M-Pesa (${paymentData.mpesaPhone})`;
        setLoading(true);
        try {
          // Compose correct payload for backend
          const payload = {
            phone_number: paymentData.mpesaPhone,
            amount: amount || 1, // fallback for demo
            order_id: orderId || 1, // fallback for demo
            account_reference: 'Fasthub Computers',
            transaction_desc: productName ? `Payment for ${productName} on Fasthub Computers` : 'Fasthub Computers',
          };
          const res = await PaymentsAPI.mpesaStkPush(payload);
          setLoading(false);
          onComplete({ 
            payment: {
              method,
              type: selectedMethod,
              data: paymentData,
              status: res?.data?.status || 'pending',
              reference: res?.data?.reference || null,
            }
          });
        } catch (err: any) {
          setLoading(false);
          setError(err?.response?.data?.detail || 'Failed to initiate M-Pesa payment.');
        }
        return;
      case 'card':
        method = `Card ending in ${paymentData.cardNumber.slice(-4)}`;
        break;
      case 'cod':
        method = 'Cash on Delivery';
        break;
    }
    onComplete({ 
      payment: { 
        method,
        type: selectedMethod,
        data: paymentData 
      } 
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className="relative">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                      <div>
                        <Label htmlFor={method.id} className="font-medium flex items-center">
                          {method.name}
                          {method.popular && (
                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Popular
                            </span>
                          )}
                        </Label>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          {/* Payment Details */}
          {selectedMethod === 'mpesa' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">M-Pesa Payment Details</h3>
              <div className="space-y-2">
                <Label htmlFor="mpesaPhone">M-Pesa Phone Number *</Label>
                <Input
                  id="mpesaPhone"
                  name="mpesaPhone"
                  type="tel"
                  placeholder="254700000000"
                  value={paymentData.mpesaPhone}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-green-700">
                  You will receive an M-Pesa prompt on your phone to complete the payment.
                </p>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Card Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name *</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'cod' && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Cash on Delivery</h3>
              <p className="text-sm text-yellow-700">
                You will pay in cash when your order is delivered. Please have the exact amount ready.
                A small COD fee of KSh 200 will be added to your order total.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Processing...' : 'Continue to Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;