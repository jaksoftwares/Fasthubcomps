'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Clock, Shield, Star, CircleCheck as CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { RepairsAPI } from '@/lib/services/repairs';

const RepairsPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    issueDescription: '',
    urgency: 'medium',
  });

  const repairServices = [
    {
      title: 'Screen Replacement',
      description: 'Professional screen replacement for phones, laptops, and tablets',
      price: 'From KSh 3,000',
      duration: '2-4 hours',
      icon: '📱',
    },
    {
      title: 'Hardware Repair',
      description: 'Motherboard, RAM, storage, and component repairs',
      price: 'From KSh 5,000',
      duration: '1-3 days',
      icon: '🔧',
    },
    {
      title: 'Software Issues',
      description: 'OS installation, virus removal, and software troubleshooting',
      price: 'From KSh 2,000',
      duration: '1-2 hours',
      icon: '💻',
    },
    {
      title: 'Data Recovery',
      description: 'Recover lost data from damaged or corrupted devices',
      price: 'From KSh 8,000',
      duration: '2-5 days',
      icon: '💾',
    },
    {
      title: 'Battery Replacement',
      description: 'Replace worn-out batteries for phones and laptops',
      price: 'From KSh 2,500',
      duration: '1-2 hours',
      icon: '🔋',
    },
    {
      title: 'Water Damage',
      description: 'Professional cleaning and repair of water-damaged devices',
      price: 'From KSh 6,000',
      duration: '3-7 days',
      icon: '💧',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! They fixed my laptop screen in just 2 hours. Very professional and affordable.',
      device: 'Dell Laptop',
    },
    {
      name: 'Michael Ochieng',
      rating: 5,
      comment: 'My phone was completely dead after water damage. They brought it back to life! Highly recommend.',
      device: 'iPhone 13',
    },
    {
      name: 'Grace Wanjiku',
      rating: 5,
      comment: 'Fast and reliable service. They recovered all my important files from a crashed hard drive.',
      device: 'External HDD',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const repairData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        device_type: formData.deviceType,
        device_brand: formData.deviceBrand,
        device_model: formData.deviceModel,
        issue_description: formData.issueDescription,
        urgency: formData.urgency,
      };

      await RepairsAPI.create(repairData);
      toast.success('Repair request submitted successfully! We\'ll contact you within 2 hours.');
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deviceType: '',
        deviceBrand: '',
        deviceModel: '',
        issueDescription: '',
        urgency: 'medium',
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message || 'Failed to submit repair request. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Device Repair Services
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert technicians, genuine parts, and quick turnaround times. 
              We fix computers, laptops, phones, and tablets with a warranty guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Free Diagnostics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>90-Day Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span>Same-Day Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Repair Services</h2>
            <p className="text-lg text-gray-600">Professional repair services for all your devices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">{service.price}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Repair Request Form */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-6 w-6 mr-2 text-blue-600" />
                  Submit Repair Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deviceType">Device Type *</Label>
                      <Select value={formData.deviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, deviceType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="desktop">Desktop Computer</SelectItem>
                          <SelectItem value="phone">Smartphone</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deviceBrand">Brand *</Label>
                      <Input
                        id="deviceBrand"
                        name="deviceBrand"
                        placeholder="e.g., Apple, Samsung, Dell"
                        value={formData.deviceBrand}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deviceModel">Model</Label>
                      <Input
                        id="deviceModel"
                        name="deviceModel"
                        placeholder="e.g., iPhone 15, MacBook Pro"
                        value={formData.deviceModel}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 3-5 days</SelectItem>
                        <SelectItem value="high">High - Within 1-2 days</SelectItem>
                        <SelectItem value="urgent">Urgent - Same day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDescription">Describe the Issue *</Label>
                    <Textarea
                      id="issueDescription"
                      name="issueDescription"
                      rows={4}
                      placeholder="Please describe the problem in detail, including when it started and any error messages..."
                      value={formData.issueDescription}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Submit Repair Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Contact Info & Testimonials */}
          <section className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+254 700 123 456</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">repairs@fasthub.co.ke</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">123 Tech Street, Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="font-medium mb-2">Business Hours</p>
                  <p className="text-gray-600 text-sm">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>What Our Customers Say</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">{testimonial.name}</span>
                      <Badge variant="outline">{testimonial.device}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{testimonial.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Warranty Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-600" />
                  Warranty & Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>90-day warranty on all repairs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Genuine parts and components</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Free diagnostics and estimates</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>No fix, no charge policy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RepairsPage;