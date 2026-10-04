export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Compress PDF Files Without Losing Quality",
    excerpt:
      "Learn the best techniques to reduce PDF file size while maintaining document quality. Perfect for email attachments and uploads.",
    category: "PDF Tips",
    author: "OpticThirst Team",
    date: "Jan 28, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
    tags: ["PDF", "Compression", "File Optimization"],
    content: [
      "PDF files are widely used for sharing documents because they preserve formatting across devices. However, large PDFs can be a hassle to email or upload. The good news is you can dramatically reduce their size without sacrificing readability.",
      "## Why PDFs Get Large",
      "Most PDFs grow in size due to high-resolution images, embedded fonts, and uncompressed data streams. Scanned documents are particularly heavy because each page is essentially a full-resolution image.",
      "## Best Compression Techniques",
      "1. **Downsample images** to 150 DPI for screen viewing or 300 DPI for print.\n2. **Remove embedded fonts** that aren't strictly necessary.\n3. **Use efficient image formats** like JPEG for photos and PNG only when transparency is required.\n4. **Flatten layers** if your PDF has multiple editable layers.",
      "## Using OpticThirst PDF Compressor",
      "Our free PDF compressor automatically applies the best optimization techniques. Just upload your file, choose a compression level (low, medium, high), and download the smaller version in seconds. No watermarks, no signup required.",
      "## Final Tips",
      "Always keep a backup of the original file before compressing. Test the compressed version on different devices to ensure the quality meets your needs.",
    ],
  },
  {
    id: "2",
    title: "JPG vs PNG: Which Image Format Should You Use?",
    excerpt:
      "Understand the differences between JPG and PNG formats to choose the right one for your needs. Includes pros, cons, and use cases.",
    category: "Image Tips",
    author: "OpticThirst Team",
    date: "Jan 25, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop",
    tags: ["Images", "JPG", "PNG", "Formats"],
    content: [
      "Choosing the right image format can dramatically affect both file size and visual quality. JPG and PNG are the two most popular formats on the web, but they serve very different purposes.",
      "## JPG: Best for Photos",
      "JPG (or JPEG) uses lossy compression, which means some image data is discarded to reduce file size. This works great for photographs where small details aren't critical, but it's a poor choice for graphics with sharp edges or text.",
      "## PNG: Best for Graphics",
      "PNG uses lossless compression and supports transparency. It's ideal for logos, icons, screenshots, and any image with text or sharp lines. The trade-off is significantly larger file sizes compared to JPG.",
      "## Quick Decision Guide",
      "- **Photos with no transparency** → JPG\n- **Logos, icons, illustrations** → PNG\n- **Screenshots with text** → PNG\n- **Web hero images** → JPG (or WebP)",
      "## Bonus: Consider WebP",
      "Modern browsers support WebP, which often delivers smaller files than both JPG and PNG with comparable quality. Use our image converter to switch formats easily.",
    ],
  },
  {
    id: "3",
    title: "Best Free Online Tools for Content Creators in 2025",
    excerpt:
      "Discover the top free online tools every content creator needs. From image editing to video conversion, we've got you covered.",
    category: "Tools Guide",
    author: "OpticThirst Team",
    date: "Jan 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=600&fit=crop",
    tags: ["Tools", "Productivity", "Content Creation"],
    content: [
      "Content creation has never been more accessible. With the right free tools, you can produce professional-quality work without breaking the bank.",
      "## Image Editing",
      "For quick edits, our online image tools handle resizing, cropping, format conversion, and compression—all in your browser. No installation required.",
      "## PDF Workflow",
      "Merge, split, compress, and convert PDFs without uploading sensitive documents to questionable servers. Privacy-first tools process files locally whenever possible.",
      "## Video & Audio",
      "Convert formats, trim clips, and extract audio from videos. These tools are perfect for podcasters, YouTubers, and social media managers.",
      "## Text Tools",
      "Word counters, case converters, and text formatters speed up writing and editing workflows. SEO writers especially benefit from accurate character and word counts.",
      "## Final Thoughts",
      "The best tool is the one that gets the job done quickly and reliably. Bookmark OpticThirst for a comprehensive suite of free, no-signup-required tools.",
    ],
  },
  {
    id: "4",
    title: "How to Convert Video to GIF: Complete Guide",
    excerpt:
      "Step-by-step tutorial on creating GIFs from videos. Perfect for social media and messaging.",
    category: "Video Tips",
    author: "OpticThirst Team",
    date: "Jan 20, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop",
    tags: ["Video", "GIF", "Conversion"],
    content: [
      "GIFs are perfect for sharing short, looping moments on social media and messaging apps. Converting a video clip into a GIF is easier than you might think.",
      "## Pick the Right Clip",
      "Keep it short—ideally under 6 seconds. Longer GIFs become huge files that load slowly and may not play smoothly on all platforms.",
      "## Optimize for Size",
      "Reduce the frame rate to 15 fps and resize to 480px width or smaller. This dramatically cuts file size while keeping the GIF watchable.",
      "## Step-by-Step",
      "1. Upload your video to our converter.\n2. Trim to the exact moment you want.\n3. Choose dimensions and frame rate.\n4. Click convert and download.",
      "## Pro Tips",
      "Add subtle text overlays before converting—they read much better than trying to add text after. And always preview before sharing!",
    ],
  },
  {
    id: "5",
    title: "Word Count SEO: How Many Words Should Your Blog Post Have?",
    excerpt:
      "Learn the ideal word count for different types of content and how it affects your SEO rankings.",
    category: "SEO Tips",
    author: "OpticThirst Team",
    date: "Jan 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop",
    tags: ["SEO", "Blogging", "Content"],
    content: [
      "Word count isn't a direct ranking factor, but it correlates strongly with comprehensive content—which Google does reward. Here's how to think about length.",
      "## General Guidelines",
      "- **News articles**: 300–600 words\n- **How-to guides**: 1,000–2,000 words\n- **Pillar content**: 2,500+ words\n- **Product pages**: 300–500 words",
      "## Quality Over Quantity",
      "Padding an article with fluff to hit a word count hurts more than it helps. Focus on covering the topic thoroughly and answering related questions.",
      "## Use Our Word Counter",
      "Our free word counter shows live counts for words, characters, and reading time—essential for hitting publication guidelines and optimizing for SEO.",
    ],
  },
  {
    id: "6",
    title: "Understanding Audio Formats: MP3 vs WAV vs FLAC",
    excerpt: "A comprehensive comparison of popular audio formats and when to use each one.",
    category: "Audio Tips",
    author: "OpticThirst Team",
    date: "Jan 15, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop",
    tags: ["Audio", "MP3", "FLAC", "Formats"],
    content: [
      "Audio formats fall into two camps: lossy and lossless. Picking the right one depends on your use case—streaming, archiving, or professional editing.",
      "## MP3: The Universal Format",
      "MP3 is lossy but widely supported. At 192 kbps or higher, most listeners can't tell the difference from the original. Perfect for podcasts and casual listening.",
      "## WAV: Uncompressed Quality",
      "WAV files are uncompressed and huge, but they preserve every bit of the original recording. Ideal for studio work and editing where quality cannot degrade.",
      "## FLAC: Lossless Compression",
      "FLAC offers the best of both worlds—lossless quality at roughly half the size of WAV. Great for archiving music collections.",
      "## Quick Recommendations",
      "- **Streaming/sharing** → MP3 (192–320 kbps)\n- **Editing/production** → WAV\n- **Archiving** → FLAC",
    ],
  },
];

export const getBlogPostById = (id: string): BlogPost | undefined =>
  blogPosts.find((p) => p.id === id);

export const getRelatedPosts = (id: string, limit = 3): BlogPost[] =>
  blogPosts.filter((p) => p.id !== id).slice(0, limit);
