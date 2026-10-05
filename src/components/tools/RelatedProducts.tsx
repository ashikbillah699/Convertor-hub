import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ExternalLink, Search } from "lucide-react";
import type { Product } from "@/data/products";
import { ALL_COUNTRIES } from "@/data/contentTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  products: Product[];
}

const RelatedProducts = ({ products }: Props) => {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(ALL_COUNTRIES);
  const countryOptions = [ALL_COUNTRIES, ...Array.from(new Set(products.flatMap((product) => product.countries))).sort()];

  if (products.length === 0) return null;

  const visible = products.filter((product) =>
    (country === ALL_COUNTRIES || product.countries.includes(country)) &&
    (product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Recommended <span className="gradient-text">Products</span>
        </h2>
        <p className="text-muted-foreground">
          Tools and software that work great with this converter
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
        <Select value={country} onValueChange={setCountry}>
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
      {visible.length === 0 && (
        <p className="text-muted-foreground text-sm mb-6">No products available for this selection.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="group tool-card animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
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
            <div className="flex flex-wrap gap-1 mb-3">
              {product.features.slice(0, 3).map((f) => (
                <span key={f} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                  {f}
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
    </section>
  );
};

export default RelatedProducts;
