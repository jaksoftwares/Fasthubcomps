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
        {/* Hero Carousel - Enhanced with auto-rotating slides */}
        <HeroSection />
        
        {/* Trust Badges & Brand Partners - NEW SECTION */}
        <TrustBadges />
        
        {/* Shop by Category - Enhanced with better visuals */}
        <Categories />
        
        {/* Featured Products - Enhanced with wishlist & quick view */}
        <FeaturedProducts />
        
        {/* Top Sales - Best selling products */}
        <TopSales />
        
        {/* Best Deals - Limited time offers */}
        <BestDeals />
        
        {/* Why Choose Us - NEW SECTION */}
        <WhyChooseUs />
        
        {/* Services - Repair and support services */}
        <Services />
        
        {/* Customer Testimonials - NEW SECTION */}
        <Testimonials />
        
        {/* Newsletter Subscription */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}