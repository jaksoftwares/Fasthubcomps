'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SettingsAPI } from '@/lib/services/settings';

const SettingsPanel = () => {
  const [storeSettings, setStoreSettings] = useState<any>({
    storeName: '',
    storeDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    currency: '',
    taxRate: '',
    freeShippingThreshold: '',
  });
  const [paymentSettings, setPaymentSettings] = useState<any>({});
  const [shippingSettings, setShippingSettings] = useState<any>({});
  const [notificationSettings, setNotificationSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SettingsAPI.get();
        setStoreSettings({
          storeName: data.storeName ?? '',
          storeDescription: data.storeDescription ?? '',
          contactEmail: data.contactEmail ?? '',
          contactPhone: data.contactPhone ?? '',
          address: data.address ?? '',
          currency: data.currency ?? '',
          taxRate: data.taxRate ?? '',
          freeShippingThreshold: data.freeShippingThreshold ?? '',
        });
        setPaymentSettings(data.payment);
        setShippingSettings(data.shipping);
        setNotificationSettings(data.notifications);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch settings');
        toast.error(err?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveStoreSettings = async () => {
    try {
      await SettingsAPI.update({ store: storeSettings });
      toast.success('Store settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save store settings');
    }
  };

  const handleSavePaymentSettings = async () => {
    try {
      await SettingsAPI.update({ payment: paymentSettings });
      toast.success('Payment settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save payment settings');
    }
  };

  const handleSaveShippingSettings = async () => {
    try {
      await SettingsAPI.update({ shipping: shippingSettings });
      toast.success('Shipping settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save shipping settings');
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      await SettingsAPI.update({ notifications: notificationSettings });
      toast.success('Notification settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save notification settings');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Tabs defaultValue="store" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="store">Store</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="store">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, storeName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={storeSettings.currency ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, currency: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Input
                id="storeDescription"
                value={storeSettings.storeDescription ?? ''}
                onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, storeDescription: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={storeSettings.contactEmail ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={storeSettings.contactPhone ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={storeSettings.address ?? ''}
                onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, taxRate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={storeSettings.freeShippingThreshold ?? ''}
                  onChange={(e) => setStoreSettings((prev: Record<string, any>) => ({ ...prev, freeShippingThreshold: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleSaveStoreSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Store Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">M-Pesa Payments</h3>
                  <p className="text-sm text-gray-600">Enable M-Pesa mobile money payments</p>
                </div>
                <Switch
                  checked={paymentSettings.mpesaEnabled}
                  onCheckedChange={(checked) => setPaymentSettings((prev: Record<string, any>) => ({ ...prev, mpesaEnabled: checked }))}
                />
              </div>

              {paymentSettings.mpesaEnabled && (
                <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaShortcode">M-Pesa Shortcode</Label>
                    <Input
                      id="mpesaShortcode"
                      value={paymentSettings.mpesaShortcode}
                      onChange={(e) => setPaymentSettings((prev: Record<string, any>) => ({ ...prev, mpesaShortcode: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaPasskey">M-Pesa Passkey</Label>
                    <Input
                      id="mpesaPasskey"
                      type="password"
                      value={paymentSettings.mpesaPasskey}
                      onChange={(e) => setPaymentSettings((prev: Record<string, any>) => ({ ...prev, mpesaPasskey: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Card Payments</h3>
                  <p className="text-sm text-gray-600">Accept credit and debit card payments</p>
                </div>
                <Switch
                  checked={paymentSettings.cardPaymentsEnabled}
                  onCheckedChange={(checked) => setPaymentSettings((prev: Record<string, any>) => ({ ...prev, cardPaymentsEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cash on Delivery</h3>
                  <p className="text-sm text-gray-600">Allow customers to pay upon delivery</p>
                </div>
                <Switch
                  checked={paymentSettings.codEnabled}
                  onCheckedChange={(checked) => setPaymentSettings((prev: Record<string, any>) => ({ ...prev, codEnabled: checked }))}
                />
              </div>
            </div>

            <Button onClick={handleSavePaymentSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shipping">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="standardShippingFee">Standard Shipping Fee (KSh)</Label>
                <Input
                  id="standardShippingFee"
                  type="number"
                  value={shippingSettings.standardShippingFee}
                  onChange={(e) => setShippingSettings((prev: Record<string, any>) => ({ ...prev, standardShippingFee: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressShippingFee">Express Shipping Fee (KSh)</Label>
                <Input
                  id="expressShippingFee"
                  type="number"
                  value={shippingSettings.expressShippingFee}
                  onChange={(e) => setShippingSettings((prev: Record<string, any>) => ({ ...prev, expressShippingFee: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm text-gray-600">Offer free shipping for orders above threshold</p>
                </div>
                <Switch
                  checked={shippingSettings.freeShippingEnabled}
                  onCheckedChange={(checked) => setShippingSettings((prev: Record<string, any>) => ({ ...prev, freeShippingEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Same Day Delivery</h3>
                  <p className="text-sm text-gray-600">Enable same day delivery option</p>
                </div>
                <Switch
                  checked={shippingSettings.sameDayDeliveryEnabled}
                  onCheckedChange={(checked) => setShippingSettings((prev: Record<string, any>) => ({ ...prev, sameDayDeliveryEnabled: checked }))}
                />
              </div>
            </div>

            <Button onClick={handleSaveShippingSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Shipping Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Send notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings((prev: Record<string, any>) => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings((prev: Record<string, any>) => ({ ...prev, smsNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Order Confirmations</h3>
                  <p className="text-sm text-gray-600">Send order confirmation messages</p>
                </div>
                <Switch
                  checked={notificationSettings.orderConfirmations}
                  onCheckedChange={(checked) => setNotificationSettings((prev: Record<string, any>) => ({ ...prev, orderConfirmations: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified when products are low in stock</p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) => setNotificationSettings((prev: Record<string, any>) => ({ ...prev, lowStockAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Order Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified of new customer orders</p>
                </div>
                <Switch
                  checked={notificationSettings.newOrderAlerts}
                  onCheckedChange={(checked) => setNotificationSettings((prev: Record<string, any>) => ({ ...prev, newOrderAlerts: checked }))}
                />
              </div>
            </div>

            <Button onClick={handleSaveNotificationSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsPanel;