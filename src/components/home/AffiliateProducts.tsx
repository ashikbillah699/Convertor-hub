import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const featuredProducts = products.slice(0, 4);

const AffiliateProducts = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Recommended <span className="gradient-text">Products</span>
            </h2>
            <p className="text-muted-foreground">
              Hand-picked tools and software to boost your productivity
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group tool-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {product.badge && (
                  <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md gradient-primary text-primary-foreground">
                    {product.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {product.category}
              </span>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mt-1 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">{product.price}</span>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                Learn More
                <ExternalLink className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliateProducts;
