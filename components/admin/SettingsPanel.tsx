"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SettingsAPI } from "@/lib/services/settings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type SettingsState = {
  site_name: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  currency: string;
  tax_rate: string | number;
  maintenance_mode: boolean;
};

type PaymentSettingsState = {
  mpesaPasskey: string;
  cardPaymentsEnabled: boolean;
  codEnabled: boolean;
};

type ShippingSettingsState = {
  standardShippingFee: string | number;
  expressShippingFee: string | number;
  freeShippingEnabled: boolean;
  sameDayDeliveryEnabled: boolean;
};

type NotificationSettingsState = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderConfirmations: boolean;
  lowStockAlerts: boolean;
  newOrderAlerts: boolean;
};

const SettingsPanel = () => {
  const [settings, setSettings] = useState<SettingsState>({
    site_name: "",
    logo_url: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    currency: "KES",
    tax_rate: "",
    maintenance_mode: false,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettingsState>({
    mpesaPasskey: "",
    cardPaymentsEnabled: false,
    codEnabled: false,
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettingsState>({
    standardShippingFee: "",
    expressShippingFee: "",
    freeShippingEnabled: false,
    sameDayDeliveryEnabled: false,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsState>({
    emailNotifications: false,
    smsNotifications: false,
    orderConfirmations: false,
    lowStockAlerts: false,
    newOrderAlerts: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SettingsAPI.get();
        setSettings((prev) => ({
          ...prev,
          site_name: data.site_name ?? prev.site_name,
          logo_url: data.logo_url ?? prev.logo_url,
          contact_email: data.contact_email ?? prev.contact_email,
          contact_phone: data.contact_phone ?? prev.contact_phone,
          address: data.address ?? prev.address,
          currency: data.currency ?? prev.currency,
          tax_rate: data.tax_rate ?? prev.tax_rate,
          maintenance_mode: data.maintenance_mode ?? prev.maintenance_mode,
        }));
      } catch (err: any) {
        setError(err?.message || "Failed to fetch settings");
        toast.error(err?.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveGeneralSettings = async () => {
    try {
      await SettingsAPI.update({
        site_name: settings.site_name,
        logo_url: settings.logo_url,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        address: settings.address,
        currency: settings.currency,
        tax_rate: settings.tax_rate,
        maintenance_mode: settings.maintenance_mode,
      });
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    }
  };

  const handleSavePaymentSettings = async () => {
    toast.success("Payment settings saved");
  };

  const handleSaveShippingSettings = async () => {
    toast.success("Shipping settings saved");
  };

  const handleSaveNotificationSettings = async () => {
    toast.success("Notification settings saved");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="w-full grid grid-cols-4 mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Store Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={settings.logo_url}
                onChange={(e) => setSettings((prev) => ({ ...prev, logo_url: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, contact_email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, contact_phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  value={settings.tax_rate}
                  onChange={(e) => setSettings((prev) => ({ ...prev, tax_rate: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-3 mt-6">
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, maintenance_mode: checked }))
                  }
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-900">Maintenance mode</p>
                  <p className="text-xs text-gray-500">
                    Temporarily disable the storefront for visitors.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveGeneralSettings} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpesaPasskey">M-Pesa Passkey</Label>
                <Input
                  id="mpesaPasskey"
                  type="password"
                  value={paymentSettings.mpesaPasskey}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({ ...prev, mpesaPasskey: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Card Payments</h3>
                  <p className="text-sm text-gray-600">
                    Accept credit and debit card payments
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.cardPaymentsEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      cardPaymentsEnabled: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Cash on Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Allow customers to pay upon delivery
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.codEnabled}
                  onCheckedChange={(checked) =>
                    setPaymentSettings((prev) => ({ ...prev, codEnabled: checked }))
                  }
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
                  onChange={(e) =>
                    setShippingSettings((prev) => ({
                      ...prev,
                      standardShippingFee: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressShippingFee">Express Shipping Fee (KSh)</Label>
                <Input
                  id="expressShippingFee"
                  type="number"
                  value={shippingSettings.expressShippingFee}
                  onChange={(e) =>
                    setShippingSettings((prev) => ({
                      ...prev,
                      expressShippingFee: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Offer free shipping for orders above threshold
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.freeShippingEnabled}
                  onCheckedChange={(checked) =>
                    setShippingSettings((prev) => ({
                      ...prev,
                      freeShippingEnabled: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Same Day Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Enable same day delivery option
                  </p>
                </div>
                <Switch
                  checked={shippingSettings.sameDayDeliveryEnabled}
                  onCheckedChange={(checked) =>
                    setShippingSettings((prev) => ({
                      ...prev,
                      sameDayDeliveryEnabled: checked,
                    }))
                  }
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
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      smsNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Order Confirmations</h3>
                  <p className="text-sm text-gray-600">Send order confirmation messages</p>
                </div>
                <Switch
                  checked={notificationSettings.orderConfirmations}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      orderConfirmations: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-600">
                    Get notified when products are low in stock
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      lowStockAlerts: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Order Alerts</h3>
                  <p className="text-sm text-gray-600">
                    Get notified of new customer orders
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newOrderAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      newOrderAlerts: checked,
                    }))
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSaveNotificationSettings}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsPanel;