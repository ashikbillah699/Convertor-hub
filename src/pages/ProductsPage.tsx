import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALL_COUNTRIES } from "@/data/contentTypes";
import { getPublicProducts } from "@/lib/contentApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState(ALL_COUNTRIES);
  const toolCategory = searchParams.get("toolCategory");
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ["public-products"],
    queryFn: getPublicProducts,
  });
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const countryOptions = [ALL_COUNTRIES, ...Array.from(new Set(products.flatMap((product) => product.countries))).sort()];

  useEffect(() => {
    // When arriving with a toolCategory filter, reset product category filter to "All"
    // so we show all products related to that tool category.
    if (toolCategory) setSelectedCategory("All");
  }, [toolCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesToolCategory = !toolCategory || (product.relatedToolCategories || []).includes(toolCategory);
    const matchesCountry = selectedCountry === ALL_COUNTRIES || product.countries.includes(selectedCountry);
    return matchesSearch && matchesCategory && matchesToolCategory && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Recommended <span className="gradient-text">Products</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked tools and software to boost your productivity. We only recommend products we trust.
            </p>
          </div>

          {toolCategory && (
            <div className="max-w-2xl mx-auto mb-6 flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Filtered for tool category:</span>
              <span className="px-3 py-1 rounded-full gradient-primary text-primary-foreground font-medium">{toolCategory}</span>
              <Link to="/products" className="text-primary hover:underline">Clear</Link>
            </div>
          )}

          {/* Search & Filters */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger aria-label="Filter by country" className="h-12 w-full sm:w-52 rounded-xl border-2 border-border">
                  <SelectValue placeholder={ALL_COUNTRIES} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {countryOptions.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading && <p className="py-12 text-center text-muted-foreground">Loading products…</p>}
          {error && (
            <div role="alert" className="py-12 text-center">
              <p className="mb-3 text-destructive">{error.message}</p>
              <button className="text-primary underline" onClick={() => void refetch()}>Try again</button>
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="group tool-card animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative mb-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 2).map((feature) => (
                    <span key={feature} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{product.price}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  View Details <ExternalLink className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
