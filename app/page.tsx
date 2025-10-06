import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import TopSales from '@/components/home/TopSales';
import BestDeals from '@/components/home/BestDeals';
import Services from '@/components/home/Services';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <FeaturedProducts />
        <TopSales />
        <BestDeals />
        <Services />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}