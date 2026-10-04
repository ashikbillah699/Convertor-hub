import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "How to Compress PDF Files Without Losing Quality",
    excerpt: "Learn the best techniques to reduce PDF file size while maintaining document quality. Perfect for email attachments and uploads.",
    category: "PDF Tips",
    date: "Jan 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "JPG vs PNG: Which Image Format Should You Use?",
    excerpt: "Understand the differences between JPG and PNG formats to choose the right one for your needs.",
    category: "Image Tips",
    date: "Jan 25, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Best Free Online Tools for Content Creators in 2025",
    excerpt: "Discover the top free online tools every content creator needs. From image editing to video conversion.",
    category: "Tools Guide",
    date: "Jan 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "How to Convert Video to GIF: Complete Guide",
    excerpt: "Step-by-step tutorial on creating GIFs from videos. Perfect for social media and messaging.",
    category: "Video Tips",
    date: "Jan 20, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Word Count SEO: How Many Words Should Your Blog Post Have?",
    excerpt: "Learn the ideal word count for different types of content and how it affects your SEO rankings.",
    category: "SEO Tips",
    date: "Jan 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Understanding Audio Formats: MP3 vs WAV vs FLAC",
    excerpt: "A comprehensive comparison of popular audio formats and when to use each one.",
    category: "Audio Tips",
    date: "Jan 15, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
  },
];

const categories = ["All", "PDF Tips", "Image Tips", "Video Tips", "Audio Tips", "Tools Guide", "SEO Tips"];

// Map tool categories (from /tools) to blog category names
const toolCategoryToBlog: Record<string, string> = {
  PDF: "PDF Tips",
  Image: "Image Tips",
  Video: "Video Tips",
  Audio: "Audio Tips",
  Text: "Tools Guide",
  General: "Tools Guide",
  Calculator: "Tools Guide",
};

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const tc = searchParams.get("toolCategory");
    if (tc && toolCategoryToBlog[tc]) {
      setSelectedCategory(toolCategoryToBlog[tc]);
    }
  }, [searchParams]);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tips, tutorials, and insights to help you work smarter with files and content.
            </p>
          </div>

          {searchParams.get("toolCategory") && (
            <div className="max-w-2xl mx-auto mb-6 flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Showing articles for tool:</span>
              <span className="px-3 py-1 rounded-full gradient-primary text-primary-foreground font-medium">
                {searchParams.get("toolCategory")}
              </span>
              <Link to="/blog" className="text-primary hover:underline">Clear</Link>
            </div>
          )}

          {/* Search & Filters */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
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

          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group tool-card p-0 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
