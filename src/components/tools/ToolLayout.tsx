import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import RelatedProducts from "@/components/tools/RelatedProducts";
import { getProductsByToolCategory } from "@/data/products";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  toolCategory?: string;
}

const ToolLayout = ({ title, description, icon, children, toolCategory }: Props) => {
  const relatedProducts = toolCategory ? getProductsByToolCategory(toolCategory) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to All Tools
          </Link>
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">{icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </div>
          {children}
        </div>
        <div className="container">
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolLayout;
