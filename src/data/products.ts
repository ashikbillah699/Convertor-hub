export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  badge: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  /** Countries where this affiliate product is available. Used only for filtering, never displayed. */
  countries: string[];
  relatedToolCategories: string[]; // matches tool categories: PDF, Image, Video, Audio, Text, General, Calculator
}

export const products: Product[] = [
  {
    id: "1",
    slug: "adobe-acrobat-pro",
    name: "Adobe Acrobat Pro",
    description: "The industry standard for PDF editing, creation, and management. Perfect for professionals.",
    longDescription: "Adobe Acrobat Pro DC is the complete PDF solution for today's multi-device world. Create, edit, sign, and manage PDFs from anywhere. It lets you convert virtually any document to PDF, combine files from multiple applications, and share with anyone. With advanced editing tools, you can modify text and images directly in your PDF. Acrobat Pro also offers robust security features including password protection, redaction, and digital signatures to keep your documents safe.",
    category: "PDF Software",
    price: "$22.99/mo",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    badge: "Editor's Choice",
    features: ["Edit PDFs directly", "Convert to/from PDF", "E-signatures & forms", "Cloud storage & sync", "Redaction tools", "OCR text recognition", "Batch processing", "Mobile app included"],
    pros: ["Industry standard reliability", "Excellent OCR accuracy", "Seamless Adobe ecosystem integration", "Regular updates & new features"],
    cons: ["Higher price point", "Can be resource-heavy", "Subscription only model"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","Germany","India"],
    relatedToolCategories: ["PDF"],
  },
  {
    id: "2",
    slug: "canva-pro",
    name: "Canva Pro",
    description: "Design anything with powerful tools, templates, and brand management features.",
    longDescription: "Canva Pro transforms anyone into a designer with its intuitive drag-and-drop interface and vast library of over 100 million premium assets. Create stunning social media graphics, presentations, posters, documents, and visual content with thousands of professionally designed templates. The Brand Kit feature ensures consistency across all your designs, while the Background Remover and Magic Resize tools save hours of work. Collaborate in real-time with your team and publish directly to social media platforms.",
    category: "Design Tool",
    price: "$12.99/mo",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    badge: "Best Value",
    features: ["100M+ premium assets", "Brand Kit management", "Background Remover", "Magic Resize", "Team collaboration", "Social media scheduler", "Custom fonts upload", "Video editing"],
    pros: ["Incredibly easy to use", "Massive template library", "Excellent value for money", "Real-time collaboration"],
    cons: ["Limited advanced editing", "Requires internet connection", "Some limitations on free plan"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","Germany","France","India","Bangladesh"],
    relatedToolCategories: ["Image", "Video"],
  },
  {
    id: "3",
    slug: "sandisk-extreme-ssd",
    name: "SanDisk Extreme Portable SSD",
    description: "Fast, reliable storage for your files on the go. Perfect for content creators.",
    longDescription: "The SanDisk Extreme Portable SSD delivers high-speed storage in a rugged, compact design built to withstand the rigors of any adventure. With read speeds up to 1050MB/s and write speeds up to 1000MB/s, you can move hi-res photos and massive files faster than ever. The IP65 rating means it's water and dust resistant, while the durable silicone shell can survive drops up to 2 meters. Includes hardware encryption with password protection for added security.",
    category: "Storage",
    price: "$129.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop",
    badge: null,
    features: ["1TB capacity", "1050MB/s read speed", "IP65 water resistant", "Drop protection (2m)", "Hardware encryption", "USB 3.2 Gen 2", "Compact design", "5-year warranty"],
    pros: ["Blazing fast speeds", "Extremely durable", "Compact and portable", "Great value per GB"],
    cons: ["Gets warm under heavy use", "No Thunderbolt support", "Cable could be longer"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Germany","India"],
    relatedToolCategories: ["Video", "Audio", "Image", "PDF", "General"],
  },
  {
    id: "4",
    slug: "grammarly-premium",
    name: "Grammarly Premium",
    description: "AI-powered writing assistant for error-free content across all platforms.",
    longDescription: "Grammarly Premium goes beyond basic grammar checking to help you write with clarity, confidence, and impact. Its AI-powered suggestions cover grammar, punctuation, style, tone, and word choice. The plagiarism detector checks your text against billions of web pages. Tone detection helps ensure your message comes across as intended, while vocabulary enhancement suggestions help diversify your word choice. Works seamlessly across browsers, desktop apps, and mobile devices.",
    category: "Writing Tool",
    price: "$12/mo",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
    badge: "Popular",
    features: ["Advanced grammar check", "Tone detection", "Plagiarism detector", "Word suggestions", "Style improvements", "Browser extension", "Desktop app", "Mobile keyboard"],
    pros: ["Works everywhere you write", "Excellent AI suggestions", "Plagiarism detection included", "Continuous improvements"],
    cons: ["Can be overly aggressive with suggestions", "Premium price for full features", "Occasional false positives"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","India"],
    relatedToolCategories: ["Text"],
  },
  {
    id: "5",
    slug: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    description: "Premium wireless mouse with advanced features for productivity.",
    longDescription: "The Logitech MX Master 3S is the ultimate productivity mouse, featuring an electromagnetic scroll wheel that shifts between precise and hyper-fast scrolling. Track on virtually any surface including glass with the 8000 DPI Darkfield sensor. Connect to up to three devices and switch between them with a button press. The ergonomic design provides all-day comfort, while USB-C quick charging gives you 3 hours of use from just 1 minute of charging. Customizable buttons with Logi Options+ software let you tailor the experience to your workflow.",
    category: "Accessories",
    price: "$99.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop",
    badge: null,
    features: ["8000 DPI sensor", "USB-C quick charging", "Multi-device (3)", "Quiet clicks", "MagSpeed scroll", "Ergonomic design", "Logi Options+", "70-day battery"],
    pros: ["Best-in-class ergonomics", "Incredible scroll wheel", "Multi-device switching", "Long battery life"],
    cons: ["Premium price", "Large for small hands", "No left-hand version"],
    affiliateUrl: "#",
    countries: ["USA","UK","Germany","France","Canada","Australia"],
    relatedToolCategories: ["General"],
  },
  {
    id: "6",
    slug: "samsung-t7-shield-ssd",
    name: "Samsung T7 Shield SSD",
    description: "Rugged portable SSD with fast transfer speeds and durability.",
    longDescription: "Samsung T7 Shield is built to endure the elements while delivering outstanding performance. With sequential read/write speeds up to 1,050/1,000 MB/s powered by USB 3.2 Gen 2 technology, transferring large files is a breeze. The IP65-rated design withstands water, dust, and drops up to 3 meters. AES 256-bit hardware encryption with optional password protection keeps your data secure. The compact, lightweight design fits easily in your pocket, making it the perfect companion for creators on the move.",
    category: "Storage",
    price: "$159.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&h=400&fit=crop",
    badge: null,
    features: ["2TB capacity", "IP65 rated", "USB 3.2 Gen 2", "AES 256-bit encryption", "3m drop resistant", "1050MB/s speed", "Compact design", "3-year warranty"],
    pros: ["Excellent durability", "Fast transfer speeds", "Strong encryption", "Good capacity options"],
    cons: ["Pricier than competition", "Gets warm during transfers", "Software could be better"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","Japan"],
    relatedToolCategories: ["Video", "Audio", "Image", "PDF", "General"],
  },
  {
    id: "7",
    slug: "notion-pro",
    name: "Notion Pro",
    description: "All-in-one workspace for notes, docs, projects, and team collaboration.",
    longDescription: "Notion is the connected workspace where better, faster work happens. It combines notes, documents, wikis, and project management into one flexible platform. Build custom databases, kanban boards, calendars, and galleries. Use templates to get started quickly or create your own systems from scratch. The powerful API allows integrations with your favorite tools, while advanced permissions let you control access at every level. Real-time collaboration features make it easy to work together with your team, no matter where they are.",
    category: "Productivity",
    price: "$10/mo",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop",
    badge: "Trending",
    features: ["Unlimited blocks", "API access", "Advanced permissions", "Priority support", "Custom databases", "Kanban boards", "Real-time collab", "Template gallery"],
    pros: ["Incredibly flexible", "Great for teams", "Powerful databases", "Active community"],
    cons: ["Steep learning curve", "Can feel overwhelming", "Offline mode limited"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","Germany","India","Bangladesh"],
    relatedToolCategories: ["Text", "General"],
  },
  {
    id: "8",
    slug: "wacom-intuos-pro",
    name: "Wacom Intuos Pro",
    description: "Professional pen tablet for digital artists and designers.",
    longDescription: "The Wacom Intuos Pro is the professional standard for creative pen tablets. With 8,192 levels of pressure sensitivity and tilt recognition, every stroke feels natural and precise. The Pro Pen 2 is virtually lag-free and never needs charging. Customizable ExpressKeys and Touch Ring put your favorite shortcuts at your fingertips. Connect via Bluetooth or USB for flexibility. Compatible with all major creative applications including Photoshop, Illustrator, and Clip Studio Paint. The texture sheet surface mimics the feel of paper for a more natural drawing experience.",
    category: "Creative Tools",
    price: "$379.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=400&fit=crop",
    badge: null,
    features: ["8192 pressure levels", "Bluetooth & USB", "Customizable buttons", "Paper-like texture", "Multi-touch gestures", "Pro Pen 2 included", "Tilt recognition", "Battery-free pen"],
    pros: ["Industry standard quality", "Exceptional pen precision", "Durable build quality", "Great software bundle"],
    cons: ["High price point", "Learning curve for beginners", "Drivers can be finicky"],
    affiliateUrl: "#",
    countries: ["USA","UK","Germany","Japan","Canada"],
    relatedToolCategories: ["Image"],
  },
  {
    id: "9",
    slug: "filmora-video-editor",
    name: "Wondershare Filmora",
    description: "Easy-to-use video editor with professional features and effects.",
    longDescription: "Wondershare Filmora makes video editing accessible to everyone with its intuitive interface and powerful features. Import clips from any device, apply stunning effects and transitions, add royalty-free music, and export in any format. AI-powered tools include auto scene detection, noise removal, and smart cutout. The built-in screen recorder is perfect for tutorials and presentations. With support for 4K editing, motion tracking, and keyframe animation, Filmora bridges the gap between beginner-friendly and professional-grade video editing.",
    category: "Video Software",
    price: "$49.99/yr",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    badge: "Great for Beginners",
    features: ["4K video editing", "AI scene detection", "Motion tracking", "Screen recorder", "1000+ effects", "Royalty-free music", "Green screen", "Speed ramping"],
    pros: ["Very beginner-friendly", "Affordable pricing", "Regular updates", "Great effects library"],
    cons: ["Watermark on free version", "Less powerful than Premiere Pro", "Can lag with 4K footage"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","India","Bangladesh"],
    relatedToolCategories: ["Video", "Audio"],
  },
  {
    id: "10",
    slug: "audacity-pro-bundle",
    name: "Audacity + Plugin Bundle",
    description: "Free audio editor with premium plugins for professional audio processing.",
    longDescription: "Audacity is the world's most popular free audio editor, and with this premium plugin bundle, it becomes a professional-grade audio workstation. Record live audio through a microphone or mixer, digitize recordings from other sources, and edit multiple tracks. The bundle includes noise reduction plugins, vocal enhancers, audio compressors, and format converters that extend Audacity's capabilities far beyond the basics. Perfect for podcasters, musicians, and content creators who need professional audio tools without the professional price tag.",
    category: "Audio Software",
    price: "$29.99",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop",
    badge: null,
    features: ["Multi-track editing", "Noise reduction", "Format conversion", "Vocal enhancement", "Audio compression", "Batch processing", "VST plugin support", "Spectrum analyzer"],
    pros: ["Core software is free", "Cross-platform", "Extensive plugin ecosystem", "Great community support"],
    cons: ["Dated interface", "Destructive editing only", "No real-time effects preview"],
    affiliateUrl: "#",
    countries: ["USA","UK","Canada","Australia","Germany","France","India","Bangladesh","Japan"],
    relatedToolCategories: ["Audio", "Video"],
  },
  {
    id: "11",
    slug: "smallpdf-pro",
    name: "Smallpdf Pro",
    description: "All-in-one online PDF tool suite for quick document tasks.",
    longDescription: "Smallpdf Pro is a cloud-based PDF solution that handles all your document needs directly in the browser. Convert, compress, merge, split, edit, and sign PDFs without installing any software. The intuitive interface makes it easy to process files in seconds. With batch processing, handle multiple files at once. E-signature support lets you sign and request signatures on documents. The desktop app provides offline access when you need it, and the mobile app keeps you productive on the go.",
    category: "PDF Software",
    price: "$9/mo",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop",
    badge: "Budget Pick",
    features: ["21+ PDF tools", "Batch processing", "E-signatures", "OCR scanning", "Cloud storage", "Desktop & mobile apps", "Team management", "API access"],
    pros: ["Very affordable", "No software installation needed", "Fast processing", "Clean interface"],
    cons: ["Requires internet for web version", "File size limits on some plans", "Fewer advanced features than Acrobat"],
    affiliateUrl: "#",
    countries: ["USA","UK","Germany","France","India"],
    relatedToolCategories: ["PDF"],
  },
  {
    id: "12",
    slug: "scientific-calculator-pro",
    name: "Texas Instruments TI-84 Plus CE",
    description: "Advanced graphing calculator for students and professionals.",
    longDescription: "The Texas Instruments TI-84 Plus CE is the go-to graphing calculator for students from middle school through college. Its vibrant color display makes graphs and data easier to read, while the rechargeable battery eliminates the need for replacements. Pre-loaded apps cover everything from geometry to statistics, and the MathPrint feature displays math expressions as they appear in textbooks. Approved for SAT, ACT, AP, and IB exams, making it an essential tool for academic success.",
    category: "Calculator Device",
    price: "$149.99",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
    badge: null,
    features: ["Color display", "Rechargeable battery", "Pre-loaded apps", "MathPrint", "USB connectivity", "Graph functions", "Statistics tools", "Exam approved"],
    pros: ["Exam approved everywhere", "Durable build", "Great for STEM students", "Long battery life"],
    cons: ["Expensive for a calculator", "Dated interface", "Limited connectivity"],
    affiliateUrl: "#",
    countries: ["USA","Canada","UK","Australia"],
    relatedToolCategories: ["Calculator"],
  },
];

export const getProductsByToolCategory = (toolCategory: string): Product[] => {
  return products.filter(p => p.relatedToolCategories.includes(toolCategory));
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const ALL_COUNTRIES = "All Countries";

export const availableCountries = (): string[] =>
  Array.from(new Set(products.flatMap(p => p.countries))).sort();

export const filterByCountry = (list: Product[], country: string): Product[] =>
  !country || country === ALL_COUNTRIES ? list : list.filter(p => p.countries.includes(country));
