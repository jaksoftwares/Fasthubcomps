'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Monitor, Laptop, Smartphone, Headphones, Keyboard, Mouse, HardDrive, Cpu } from 'lucide-react';

const Categories = () => {
  const mainCategories = [
    {
      name: 'Computers',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/products?category=computers',
      description: 'Desktop computers and workstations',
      icon: Monitor,
      count: '150+ Products',
      badge: 'Popular',
    },
    {
      name: 'Laptops',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      href: '/products?category=laptops',
      description: 'Portable computing solutions',
      icon: Laptop,
      count: '200+ Products',
      badge: 'Best Sellers',
    },
    {
      name: 'Phones & Tablets',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/products?category=phones',
      description: 'Latest smartphones and tablets',
      icon: Smartphone,
      count: '300+ Products',
      badge: 'New Arrivals',
    },
    {
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/products?category=accessories',
      description: 'Cables, cases, and peripherals',
      icon: Headphones,
      count: '500+ Products',
      badge: 'Hot Deals',
    },
  ];

  const subCategories = [
    { name: 'Keyboards', icon: Keyboard, href: '/products?category=keyboards', count: '80+' },
    { name: 'Mouse', icon: Mouse, href: '/products?category=mouse', count: '120+' },
    { name: 'Storage', icon: HardDrive, href: '/products?category=storage', count: '90+' },
    { name: 'Components', icon: Cpu, href: '/products?category=components', count: '150+' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            BROWSE BY CATEGORY
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need from our comprehensive range of IT products and services
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {category.badge}
                  </div>

                  {/* Icon */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">
                        {category.name}
                      </h3>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <p className="text-sm opacity-90 mb-2">
                      {category.description}
                    </p>
                    <p className="text-xs text-orange-400 font-semibold">
                      {category.count}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-4 border-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            );
          })}
        </div>

        {/* Sub Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gray-100 group-hover:bg-orange-100 p-3 rounded-lg transition-colors">
                    <IconComponent className="h-6 w-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} items
                </p>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;









// import React from 'react';
// import Link from 'next/link';

// const Categories = () => {
//   const categories = [
//     {
//       name: 'Computers',
//       image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
//       href: '/products?category=computers',
//       description: 'Desktop computers and workstations',
//     },
//     {
//       name: 'Laptops',
//       image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
//       href: '/products?category=laptops',
//       description: 'Portable computing solutions',
//     },
//     {
//       name: 'Phones',
//       image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
//       href: '/products?category=phones',
//       description: 'Latest smartphones and tablets',
//     },
//     {
//       name: 'Accessories',
//       image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
//       href: '/products?category=accessories',
//       description: 'Cables, cases, and peripherals',
//     },
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Shop by Category
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Find exactly what you need from our comprehensive range of IT products and services
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {categories.map((category) => {
//             return (
//               <Link
//                 key={category.name}
//                 href={category.href}
//                 className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
//               >
//                 <div className="relative">
//                   <div className="h-48 overflow-hidden">
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                     <h3 className="text-xl font-bold mb-2">
//                       {category.name}
//                     </h3>
//                     <p className="text-sm opacity-90">
//                       {category.description}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories;