import { Link } from "react-router-dom";
import { FileText, Image, Video, Music, Type, ArrowRight, Star, BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularTools = [
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word files",
    category: "PDF",
    icon: FileText,
    color: "pdf",
    href: "/tools/pdf/pdf-to-word",
    rating: 4.9,
  },
  {
    id: "image-compress",
    name: "Image Compressor",
    description: "Reduce image file size without losing quality",
    category: "Image",
    icon: Image,
    color: "image",
    href: "/tools/image/compress",
    rating: 4.8,
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences & paragraphs",
    category: "Text",
    icon: Type,
    color: "text",
    href: "/tools/text/word-counter",
    rating: 4.9,
  },
  {
    id: "mp4-to-mp3",
    name: "MP4 to MP3",
    description: "Extract audio from video files easily",
    category: "Video",
    icon: Video,
    color: "video",
    href: "/tools/video/mp4-to-mp3",
    rating: 4.7,
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG images to PNG format",
    category: "Image",
    icon: Image,
    color: "image",
    href: "/tools/image/jpg-to-png",
    rating: 4.8,
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    category: "PDF",
    icon: FileText,
    color: "pdf",
    href: "/tools/pdf/merge",
    rating: 4.9,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text to uppercase, lowercase & more",
    category: "Text",
    icon: Type,
    color: "text",
    href: "/tools/text/case-converter",
    rating: 4.6,
  },
  {
    id: "audio-compress",
    name: "Audio Compressor",
    description: "Reduce audio file size while keeping quality",
    category: "Audio",
    icon: Music,
    color: "audio",
    href: "/tools/audio/compress",
    rating: 4.7,
  },
];

const iconBgClasses = {
  pdf: "bg-pdf/20 text-pdf",
  image: "bg-image/20 text-image",
  video: "bg-video/20 text-video",
  audio: "bg-audio/20 text-audio",
  text: "bg-text/20 text-text",
};

const PopularTools = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Most <span className="gradient-text">Popular</span> Tools
            </h2>
            <p className="text-muted-foreground">
              Our most used tools loved by millions of users worldwide
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/tools">
              View All Tools
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.href}
                className="group tool-card animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgClasses[tool.color as keyof typeof iconBgClasses]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                    {tool.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {tool.description}
                </p>
                <div className="flex items-center gap-1 text-sm mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{tool.rating}</span>
                </div>
                <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                  <Link
                    to={`/blog?toolCategory=${encodeURIComponent(tool.category)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium px-2 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <BookOpen className="h-3 w-3" /> Blog
                  </Link>
                  <Link
                    to={`/products?toolCategory=${encodeURIComponent(tool.category)}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium px-2 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ShoppingBag className="h-3 w-3" /> Product
                  </Link>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
