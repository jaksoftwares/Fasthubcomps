import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import TopSales from '@/components/home/TopSales';
import BestDeals from '@/components/home/BestDeals';
import Services from '@/components/home/Services';
import Newsletter from '@/components/home/Newsletter';
import TrustBadges from '@/components/home/TrustBadges';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Compact Hero Bar */}
        <HeroSection />
        
        {/* Best Deals - Limited time offers - PROMINENT */}
        <BestDeals />
        
        {/* Featured Products - Enhanced with wishlist & quick view */}
        <FeaturedProducts />
        
        {/* Top Sales - Best selling products */}
        <TopSales />
        
        {/* Shop by Category - Enhanced with better visuals */}
        <Categories />
        
        {/* Trust Badges & Brand Partners - MOVED DOWN */}
        <TrustBadges />
        
        {/* Services - Repair and support services - MOVED DOWN */}
        <Services />
        
        {/* Why Choose Us - MOVED DOWN */}
        <WhyChooseUs />
        
        {/* Customer Testimonials - MOVED DOWN */}
        <Testimonials />
        
        {/* Newsletter Subscription */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}