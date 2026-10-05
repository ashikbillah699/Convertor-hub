import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, FileText, Image, Video, Music, Type, Star, Wrench, Calculator, BookOpen, ShoppingBag } from "lucide-react";

const allTools = [
  // PDF Tools (15)
  { id: "pdf-to-word", name: "PDF to Word", category: "PDF", icon: FileText, color: "pdf", description: "Convert PDF to editable Word documents", rating: 4.9, href: "/tools/pdf/pdf-to-word" },
  { id: "word-to-pdf", name: "Word to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert Word documents to PDF format", rating: 4.8, href: "/tools/pdf/word-to-pdf" },
  { id: "pdf-to-jpg", name: "PDF to JPG", category: "PDF", icon: FileText, color: "pdf", description: "Convert PDF pages to JPG images", rating: 4.7, href: "/tools/pdf/pdf-to-jpg" },
  { id: "jpg-to-pdf", name: "JPG to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert JPG images to PDF", rating: 4.8, href: "/tools/pdf/jpg-to-pdf" },
  { id: "pdf-to-png", name: "PDF to PNG", category: "PDF", icon: FileText, color: "pdf", description: "Convert PDF pages to PNG images", rating: 4.6, href: "/tools/pdf/pdf-to-png" },
  { id: "png-to-pdf", name: "PNG to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert PNG images to PDF", rating: 4.7, href: "/tools/pdf/png-to-pdf" },
  { id: "merge-pdf", name: "Merge PDF", category: "PDF", icon: FileText, color: "pdf", description: "Combine multiple PDFs into one", rating: 4.9, href: "/tools/pdf/merge-pdf" },
  { id: "split-pdf", name: "Split PDF", category: "PDF", icon: FileText, color: "pdf", description: "Split PDF into separate files", rating: 4.6, href: "/tools/pdf/split-pdf" },
  { id: "compress-pdf", name: "Compress PDF", category: "PDF", icon: FileText, color: "pdf", description: "Reduce PDF file size", rating: 4.8, href: "/tools/pdf/compress-pdf" },
  { id: "ppt-to-pdf", name: "PPT to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert PowerPoint to PDF", rating: 4.7, href: "/tools/pdf/ppt-to-pdf" },
  { id: "pdf-to-ppt", name: "PDF to PPT", category: "PDF", icon: FileText, color: "pdf", description: "Convert PDF to PowerPoint", rating: 4.5, href: "/tools/pdf/pdf-to-ppt" },
  { id: "excel-to-pdf", name: "Excel to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert Excel to PDF", rating: 4.6, href: "/tools/pdf/excel-to-pdf" },
  { id: "pdf-to-excel", name: "PDF to Excel", category: "PDF", icon: FileText, color: "pdf", description: "Convert PDF to Excel", rating: 4.5, href: "/tools/pdf/pdf-to-excel" },
  { id: "text-to-pdf", name: "Text to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert plain text to PDF", rating: 4.8, href: "/tools/pdf/text-to-pdf" },
  { id: "html-to-pdf", name: "HTML to PDF", category: "PDF", icon: FileText, color: "pdf", description: "Convert HTML pages to PDF", rating: 4.5, href: "/tools/pdf/html-to-pdf" },

  // Image Tools (10)
  { id: "jpg-to-png", name: "JPG to PNG", category: "Image", icon: Image, color: "image", description: "Convert JPG images to PNG format", rating: 4.8, href: "/tools/image/jpg-to-png" },
  { id: "png-to-jpg", name: "PNG to JPG", category: "Image", icon: Image, color: "image", description: "Convert PNG images to JPG format", rating: 4.7, href: "/tools/image/png-to-jpg" },
  { id: "webp-to-png", name: "WebP to PNG", category: "Image", icon: Image, color: "image", description: "Convert WebP to PNG format", rating: 4.6, href: "/tools/image/webp-to-png" },
  { id: "webp-to-jpg", name: "WebP to JPG", category: "Image", icon: Image, color: "image", description: "Convert WebP to JPG format", rating: 4.6, href: "/tools/image/webp-to-jpg" },
  { id: "heic-to-jpg", name: "HEIC to JPG", category: "Image", icon: Image, color: "image", description: "Convert HEIC photos to JPG", rating: 4.5, href: "/tools/image/heic-to-jpg" },
  { id: "bmp-to-jpg", name: "BMP to JPG", category: "Image", icon: Image, color: "image", description: "Convert BMP images to JPG", rating: 4.6, href: "/tools/image/bmp-to-jpg" },
  { id: "ico-to-png", name: "ICO to PNG", category: "Image", icon: Image, color: "image", description: "Convert ICO icons to PNG", rating: 4.5, href: "/tools/image/ico-to-png" },
  { id: "image-resize", name: "Resize Image", category: "Image", icon: Image, color: "image", description: "Resize images to any dimension", rating: 4.7, href: "/tools/image/image-resize" },
  { id: "image-compress", name: "Image Compressor", category: "Image", icon: Image, color: "image", description: "Reduce image file size", rating: 4.9, href: "/tools/image/image-compress" },
  { id: "background-remover", name: "Background Remover", category: "Image", icon: Image, color: "image", description: "Remove image background", rating: 4.8, href: "/tools/image/background-remover" },

  // Video Tools (5)
  { id: "mp4-to-mp3", name: "MP4 to MP3", category: "Video", icon: Video, color: "video", description: "Extract audio from video files", rating: 4.8, href: "/tools/video/mp4-to-mp3" },
  { id: "video-compress", name: "Video Compressor", category: "Video", icon: Video, color: "video", description: "Reduce video file size", rating: 4.7, href: "/tools/video/video-compress" },
  { id: "mp4-to-gif", name: "Video to GIF", category: "Video", icon: Video, color: "video", description: "Convert video clips to GIF", rating: 4.6, href: "/tools/video/mp4-to-gif" },
  { id: "video-to-audio", name: "Video to Audio", category: "Video", icon: Video, color: "video", description: "Extract audio from any video", rating: 4.7, href: "/tools/video/video-to-audio" },
  { id: "youtube-thumbnail", name: "YT Thumbnail", category: "Video", icon: Video, color: "video", description: "Download YouTube thumbnails", rating: 4.5, href: "/tools/video/youtube-thumbnail" },

  // Audio Tools (5)
  { id: "mp3-to-wav", name: "MP3 to WAV", category: "Audio", icon: Music, color: "audio", description: "Convert MP3 to WAV format", rating: 4.7, href: "/tools/audio/mp3-to-wav" },
  { id: "wav-to-mp3", name: "WAV to MP3", category: "Audio", icon: Music, color: "audio", description: "Convert WAV to MP3 format", rating: 4.7, href: "/tools/audio/wav-to-mp3" },
  { id: "audio-compress", name: "Audio Compressor", category: "Audio", icon: Music, color: "audio", description: "Reduce audio file size", rating: 4.6, href: "/tools/audio/audio-compress" },
  { id: "m4a-to-mp3", name: "M4A to MP3", category: "Audio", icon: Music, color: "audio", description: "Convert M4A to MP3 format", rating: 4.8, href: "/tools/audio/m4a-to-mp3" },
  { id: "youtube-mp3", name: "YT MP3 Download", category: "Audio", icon: Music, color: "audio", description: "Download YouTube audio as MP3", rating: 4.5, href: "/tools/audio/youtube-mp3" },

  // Text Tools (13)
  { id: "word-counter", name: "Word Counter", category: "Text", icon: Type, color: "text", description: "Count words, characters & more", rating: 4.9, href: "/tools/text/word-counter" },
  { id: "character-counter", name: "Character Counter", category: "Text", icon: Type, color: "text", description: "Count characters with/without spaces", rating: 4.8, href: "/tools/text/character-counter" },
  { id: "case-converter", name: "Case Converter", category: "Text", icon: Type, color: "text", description: "Convert text case easily", rating: 4.7, href: "/tools/text/case-converter" },
  { id: "text-to-speech", name: "Text to Speech", category: "Text", icon: Type, color: "text", description: "Convert text to spoken audio", rating: 4.6, href: "/tools/text/text-to-speech" },
  { id: "speech-to-text", name: "Speech to Text", category: "Text", icon: Type, color: "text", description: "Convert speech to text", rating: 4.5, href: "/tools/text/speech-to-text" },
  { id: "json-to-csv", name: "JSON to CSV", category: "Text", icon: Type, color: "text", description: "Convert JSON data to CSV", rating: 4.7, href: "/tools/text/json-to-csv" },
  { id: "csv-to-json", name: "CSV to JSON", category: "Text", icon: Type, color: "text", description: "Convert CSV data to JSON", rating: 4.6, href: "/tools/text/csv-to-json" },
  { id: "xml-to-json", name: "XML to JSON", category: "Text", icon: Type, color: "text", description: "Convert XML to JSON format", rating: 4.5, href: "/tools/text/xml-to-json" },
  { id: "base64-encode", name: "Base64 Encode", category: "Text", icon: Type, color: "text", description: "Encode text to Base64", rating: 4.7, href: "/tools/text/base64-encode" },
  { id: "base64-decode", name: "Base64 Decode", category: "Text", icon: Type, color: "text", description: "Decode Base64 to text", rating: 4.7, href: "/tools/text/base64-decode" },
  { id: "url-encode", name: "URL Encode", category: "Text", icon: Type, color: "text", description: "Encode text for URLs", rating: 4.6, href: "/tools/text/url-encode" },
  { id: "url-decode", name: "URL Decode", category: "Text", icon: Type, color: "text", description: "Decode URL-encoded text", rating: 4.6, href: "/tools/text/url-decode" },
  { id: "markdown-to-html", name: "Markdown to HTML", category: "Text", icon: Type, color: "text", description: "Convert Markdown to HTML", rating: 4.5, href: "/tools/text/markdown-to-html" },

  // General Tools (5)
  { id: "qr-code-generator", name: "QR Code Generator", category: "General", icon: Wrench, color: "text", description: "Generate QR codes from text/URLs", rating: 4.9, href: "/tools/general/qr-code-generator" },
  { id: "file-renamer", name: "File Renamer", category: "General", icon: Wrench, color: "text", description: "Rename files before downloading", rating: 4.5, href: "/tools/general/file-renamer" },
  { id: "zip-to-7z", name: "ZIP to 7z", category: "General", icon: Wrench, color: "text", description: "Convert ZIP archives to 7z format in your browser", rating: 4.5, href: "/tools/general/zip-to-7z" },
  { id: "rar-to-zip", name: "RAR to ZIP", category: "General", icon: Wrench, color: "text", description: "Convert RAR to ZIP format", rating: 4.4, href: "/tools/general/rar-to-zip" },
  { id: "file-compressor", name: "File Compressor", category: "General", icon: Wrench, color: "text", description: "Compress files to reduce size", rating: 4.5, href: "/tools/general/file-compressor" },

  // Calculators (11)
  { id: "basic-calc", name: "Basic Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Add, subtract, multiply and divide", rating: 4.8, href: "/tools/calculator/basic" },
  { id: "gpa-calc", name: "GPA Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate Grade Point Average", rating: 4.8, href: "/tools/calculator/gpa" },
  { id: "age-calc", name: "Age Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate exact age from DOB", rating: 4.9, href: "/tools/calculator/age" },
  { id: "emi-calc", name: "EMI Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate monthly installments", rating: 4.7, href: "/tools/calculator/emi" },
  { id: "vat-calc", name: "VAT/Tax Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate VAT and tax", rating: 4.6, href: "/tools/calculator/vat-tax" },
  { id: "bmi-calc", name: "BMI Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate Body Mass Index", rating: 4.8, href: "/tools/calculator/bmi" },
  { id: "percentage-calc", name: "Percentage Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate percentages easily", rating: 4.7, href: "/tools/calculator/percentage" },
  { id: "discount-calc", name: "Discount Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate discounts & savings", rating: 4.8, href: "/tools/calculator/discount" },
  { id: "loan-calc", name: "Loan Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate loan payments", rating: 4.7, href: "/tools/calculator/loan" },
  { id: "tip-calc", name: "Tip Calculator", category: "Calculator", icon: Calculator, color: "text", description: "Calculate tips & split bills", rating: 4.6, href: "/tools/calculator/tip" },
  { id: "unit-converter", name: "Unit Converter", category: "Calculator", icon: Calculator, color: "text", description: "Convert units of measurement", rating: 4.7, href: "/tools/calculator/unit-converter" },
];

const categories = ["All", "PDF", "Image", "Video", "Audio", "Text", "General", "Calculator"];

const iconBgClasses: Record<string, string> = {
  pdf: "bg-pdf/20 text-pdf",
  image: "bg-image/20 text-image",
  video: "bg-video/20 text-video",
  audio: "bg-audio/20 text-audio",
  text: "bg-text/20 text-text",
};

const categoryFromPath: Record<string, string> = {
  "/tools/pdf": "PDF",
  "/tools/image": "Image",
  "/tools/video": "Video",
  "/tools/audio": "Audio",
  "/tools/text": "Text",
  "/tools/general": "General",
  "/tools/calculator": "Calculator",
};

const ToolsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => categoryFromPath[location.pathname] || "All");

  useEffect(() => {
    setSelectedCategory(categoryFromPath[location.pathname] || "All");
  }, [location.pathname]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of {allTools.length} free online tools for file conversion,
              compression, calculation and productivity.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.href}
                  className="group tool-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgClasses[tool.color] || "bg-primary/20 text-primary"}`}>
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
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{tool.rating}</span>
                    </div>
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

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;
