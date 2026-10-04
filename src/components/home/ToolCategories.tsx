import { Link } from "react-router-dom";
import { FileText, Image, Video, Music, Type, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "pdf",
    name: "PDF Tools",
    description: "Convert, merge, split, compress PDFs",
    icon: FileText,
    color: "pdf",
    tools: 15,
    href: "/tools/pdf",
    popular: ["PDF to Word", "Merge PDF", "Compress PDF"],
  },
  {
    id: "image",
    name: "Image Tools",
    description: "Convert, resize, compress images",
    icon: Image,
    color: "image",
    tools: 10,
    href: "/tools/image",
    popular: ["JPG to PNG", "Compress Image", "Resize Image"],
  },
  {
    id: "video",
    name: "Video Tools",
    description: "Convert and compress videos",
    icon: Video,
    color: "video",
    tools: 10,
    href: "/tools/video",
    popular: ["MP4 to MP3", "Compress Video", "Video to GIF"],
  },
  {
    id: "audio",
    name: "Audio Tools",
    description: "Convert and edit audio files",
    icon: Music,
    color: "audio",
    tools: 10,
    href: "/tools/audio",
    popular: ["MP3 to WAV", "Audio Compressor", "M4A to MP3"],
  },
  {
    id: "text",
    name: "Text Tools",
    description: "Word counter, case converter & more",
    icon: Type,
    color: "text",
    tools: 10,
    href: "/tools/text",
    popular: ["Word Counter", "Case Converter", "Text to Speech"],
  },
];

const colorClasses = {
  pdf: "bg-pdf/10 text-pdf border-pdf/20 hover:bg-pdf/20",
  image: "bg-image/10 text-image border-image/20 hover:bg-image/20",
  video: "bg-video/10 text-video border-video/20 hover:bg-video/20",
  audio: "bg-audio/10 text-audio border-audio/20 hover:bg-audio/20",
  text: "bg-text/10 text-text border-text/20 hover:bg-text/20",
};

const iconBgClasses = {
  pdf: "bg-pdf/20",
  image: "bg-image/20",
  video: "bg-video/20",
  audio: "bg-audio/20",
  text: "bg-text/20",
};

const ToolCategories = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All-in-One <span className="gradient-text">Toolkit</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of 50+ free tools organized by category. Click on
            any category to explore all available tools.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.href}
                className="group tool-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBgClasses[category.color as keyof typeof iconBgClasses]}`}
                  >
                    <Icon className={`h-7 w-7 text-${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                        {category.tools} tools
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.popular.map((tool) => (
                        <span
                          key={tool}
                          className={`text-xs px-2 py-1 rounded-md border ${colorClasses[category.color as keyof typeof colorClasses]} transition-colors`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  View all tools
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolCategories;
