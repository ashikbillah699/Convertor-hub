import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ToolCategories from "@/components/home/ToolCategories";
import PopularTools from "@/components/home/PopularTools";
import BlogPreview from "@/components/home/BlogPreview";
import AffiliateProducts from "@/components/home/AffiliateProducts";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ToolCategories />
        <PopularTools />
        <BlogPreview />
        <AffiliateProducts />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
