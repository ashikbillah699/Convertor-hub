import { useParams, Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ExternalLink, Check, X, ShieldCheck } from "lucide-react";
import { getPublicProduct, getPublicProducts } from "@/lib/contentApi";

const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ["public-product", productSlug],
    queryFn: () => getPublicProduct(productSlug!),
    enabled: Boolean(productSlug),
  });
  const { data: products = [] } = useQuery({
    queryKey: ["public-products"],
    queryFn: getPublicProducts,
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading product…</div>;
  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div role="alert">
          <p className="mb-3 text-destructive">{error.message}</p>
          <button className="text-primary underline" onClick={() => void refetch()}>Try again</button>
        </div>
      </div>
    );
  }
  if (!product) return <Navigate to="/products" replace />;

  // Get related products (same category, exclude current)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.relatedToolCategories.some(c => product.relatedToolCategories.includes(c))))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover aspect-[4/3]"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-sm font-semibold px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-muted-foreground mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground text-sm">/ 5.0</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="gradient" size="lg" className="flex-1" asChild>
                  <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                    Get {product.name} <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Verified & trusted product recommendation
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="tool-card mb-8">
            <h2 className="text-xl font-bold mb-4">About {product.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
          </div>

          {/* Features Grid */}
          <div className="tool-card mb-8">
            <h2 className="text-xl font-bold mb-6">Key Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="tool-card">
              <h2 className="text-xl font-bold mb-4 text-green-500">✅ Pros</h2>
              <ul className="space-y-3">
                {product.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tool-card">
              <h2 className="text-xl font-bold mb-4 text-red-500">❌ Cons</h2>
              <ul className="space-y-3">
                {product.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="tool-card text-center py-10 mb-8">
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join thousands of users who trust {product.name} for their daily workflow.
            </p>
            <Button variant="gradient" size="lg" asChild>
              <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                Get {product.name} for {product.price} <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Similar <span className="gradient-text">Products</span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/products/${rp.slug}`}
                    className="group tool-card"
                  >
                    <div className="relative mb-4">
                      <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                        <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      {rp.badge && (
                        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md gradient-primary text-primary-foreground">
                          {rp.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{rp.category}</span>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mt-1 mb-2">{rp.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{rp.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{rp.price}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{rp.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
