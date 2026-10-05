import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getPublicBlog, getPublicBlogs } from "@/lib/contentApi";
import NotFound from "./NotFound";

const renderParagraph = (text: string, idx: number) => {
  if (text.startsWith("## ")) {
    return (
      <h2 key={idx} className="text-2xl sm:text-3xl font-bold mt-8 sm:mt-10 mb-3 sm:mb-4">
        {text.replace("## ", "")}
      </h2>
    );
  }
  // Render basic markdown bold + line breaks
  const lines = text.split("\n");
  return (
    <p key={idx} className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-4">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="text-foreground font-semibold">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </p>
  );
};

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ["public-blog", id],
    queryFn: () => getPublicBlog(id!),
    enabled: Boolean(id),
  });
  const { data: allPosts = [] } = useQuery({
    queryKey: ["public-blogs"],
    queryFn: getPublicBlogs,
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading article…</div>;
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
  if (!post) return <NotFound />;

  const related = allPosts.filter((item) => item.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8 sm:py-12">
        <article className="container max-w-5xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Category */}
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-md bg-primary/10 text-primary mb-4">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>

          {/* Hero image */}
          <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-10">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-foreground/90 font-medium leading-relaxed mb-8 italic border-l-4 border-primary pl-4">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.map((block, idx) => renderParagraph(block, idx))}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl gradient-primary text-primary-foreground text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Try Our Free Tools</h3>
            <p className="text-sm sm:text-base opacity-90 mb-4">
              Put what you learned into action with our suite of free online tools.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/tools">
                Explore Tools
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="container mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Related Articles</h2>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.id}`}
                  className="group tool-card p-0 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary mb-2">
                      {p.category}
                    </span>
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
