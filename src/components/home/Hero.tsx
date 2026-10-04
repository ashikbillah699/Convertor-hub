import { useState, useMemo, useRef, useEffect, FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

// Lightweight tool index for hero search suggestions.
// Routes match the ones registered in src/pages/ToolsPage.tsx
const toolIndex = [
  { name: "PDF to Word", href: "/tools/pdf/pdf-to-word", category: "PDF" },
  { name: "Word to PDF", href: "/tools/pdf/word-to-pdf", category: "PDF" },
  { name: "Merge PDF", href: "/tools/pdf/merge-pdf", category: "PDF" },
  { name: "Split PDF", href: "/tools/pdf/split-pdf", category: "PDF" },
  { name: "Compress PDF", href: "/tools/pdf/compress-pdf", category: "PDF" },
  { name: "PDF to JPG", href: "/tools/pdf/pdf-to-jpg", category: "PDF" },
  { name: "JPG to PDF", href: "/tools/pdf/jpg-to-pdf", category: "PDF" },
  { name: "JPG to PNG", href: "/tools/image/jpg-to-png", category: "Image" },
  { name: "PNG to JPG", href: "/tools/image/png-to-jpg", category: "Image" },
  { name: "Image Compressor", href: "/tools/image/compress-image", category: "Image" },
  { name: "WebP to PNG", href: "/tools/image/webp-to-png", category: "Image" },
  { name: "HEIC to JPG", href: "/tools/image/heic-to-jpg", category: "Image" },
  { name: "MP4 to MP3", href: "/tools/video/mp4-to-mp3", category: "Video" },
  { name: "Video to GIF", href: "/tools/video/video-to-gif", category: "Video" },
  { name: "Word Counter", href: "/tools/text/word-counter", category: "Text" },
  { name: "Case Converter", href: "/tools/text/case-converter", category: "Text" },
];

const popularTools = [
  "PDF to Word",
  "Image Compressor",
  "Word Counter",
  "MP4 to MP3",
  "JPG to PNG",
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return toolIndex
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    const exact = toolIndex.find((t) => t.name.toLowerCase() === q.toLowerCase());
    if (exact) {
      navigate(exact.href);
      return;
    }
    navigate(`/tools?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  const handleSuggestionClick = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleChipClick = (tool: string) => {
    setSearchQuery(tool);
    const exact = toolIndex.find((t) => t.name === tool);
    if (exact) navigate(exact.href);
  };

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            50+ Free Online Tools
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Convert, Compress &<br />
            <span className="gradient-text">Create Instantly</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Free online tools for PDF, images, videos, audio, and text. No signup
            required. Fast, secure, and works on any device.
          </p>

          {/* Search Bar */}
          <div
            ref={wrapperRef}
            className="relative z-30 max-w-xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search for a tool... (e.g., PDF to Word)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="w-full h-14 pl-12 pr-28 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                aria-label="Search tools"
              />
              <Button
                type="submit"
                size="sm"
                variant="gradient"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
              >
                Search
              </Button>
            </form>

            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
              <div className="absolute z-30 mt-2 left-0 right-0 top-full bg-background border-2 border-border rounded-xl shadow-xl overflow-hidden text-left">
                {suggestions.map((s) => (
                  <button
                    key={s.href}
                    type="button"
                    onClick={() => handleSuggestionClick(s.href)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{s.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {s.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {popularTools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => handleChipClick(tool)}
                  className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/tools">
                Explore All Tools
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/blog">Read Our Blog</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground">Free Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">1M+</div>
              <div className="text-sm text-muted-foreground">Files Converted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">256-bit</div>
              <div className="text-sm text-muted-foreground">SSL Encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
