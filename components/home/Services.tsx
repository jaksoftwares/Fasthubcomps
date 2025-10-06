import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Shield, Zap, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Wrench,
      title: 'Device Repairs',
      description: 'Professional repair services for computers, laptops, and phones with genuine parts.',
      features: ['Screen replacement', 'Hardware upgrades', 'Software troubleshooting', 'Data recovery'],
      color: 'bg-blue-500',
    },
    {
      icon: Shield,
      title: 'Warranty & Support',
      description: 'Comprehensive warranty coverage and ongoing technical support for all purchases.',
      features: ['Extended warranty', '24/7 support', 'Remote assistance', 'On-site service'],
      color: 'bg-green-500',
    },
    {
      icon: Zap,
      title: 'Quick Service',
      description: 'Fast turnaround times with same-day service available for urgent repairs.',
      features: ['Same-day service', 'Express repairs', 'Priority support', 'Quick diagnostics'],
      color: 'bg-orange-500',
    },
    {
      icon: Clock,
      title: 'Maintenance',
      description: 'Regular maintenance services to keep your devices running at peak performance.',
      features: ['System optimization', 'Virus removal', 'Software updates', 'Performance tuning'],
      color: 'bg-purple-500',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beyond selling quality products, we provide comprehensive IT services to keep your devices running smoothly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.color} text-white mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-orange-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Need Professional IT Support?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our certified technicians are ready to help with all your IT needs. From simple repairs to complex system upgrades, we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/repairs">
              <Button size="lg" className="bg-orange-400 text-blue-900 hover:bg-gray-100">
                Book a Repair
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-blue-900 hover:bg-orange-400 hover:text-blue-900">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;