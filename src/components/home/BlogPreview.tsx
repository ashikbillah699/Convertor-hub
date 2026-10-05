import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicBlogs } from "@/lib/contentApi";

const BlogPreview = () => {
  const { data: allBlogPosts = [], isLoading, error } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: getPublicBlogs,
  });
  const blogPosts = allBlogPosts.slice(0, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Latest from <span className="gradient-text">Blog</span>
            </h2>
            <p className="text-muted-foreground">
              Tips, tutorials, and insights to help you work smarter
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Blog Grid */}
        {isLoading && <p className="text-center text-muted-foreground">Loading articles…</p>}
        {error && <p role="alert" className="text-center text-destructive">{error.message}</p>}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
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
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
