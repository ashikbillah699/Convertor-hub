import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Zap, Globe, Heart } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Our tools are optimized for speed. Convert and process files in seconds, not minutes.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your files are processed securely and deleted automatically. We never store or share your data.",
  },
  {
    icon: Globe,
    title: "Always Free",
    description: "Access all our tools for free, forever. No hidden fees, no subscriptions required.",
  },
  {
    icon: Heart,
    title: "User-Focused",
    description: "We build tools that solve real problems. Your feedback shapes our development.",
  },
];

const stats = [
  { value: "50+", label: "Free Tools" },
  { value: "1M+", label: "Files Processed" },
  { value: "150+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="gradient-text">OpticThirst</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're on a mission to make file conversion and productivity tools accessible to everyone.
                Free, fast, and secure — that's our promise.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="mb-4">
                  OpticThirst was born from a simple frustration: the lack of reliable, free online tools
                  for everyday file conversions. Too many existing solutions were either slow, limited,
                  or required expensive subscriptions.
                </p>
                <p className="mb-4">
                  We set out to build something different — a comprehensive toolkit that's genuinely free,
                  blazingly fast, and respects user privacy. Today, we serve millions of users worldwide,
                  helping them convert PDFs, compress images, edit text, and so much more.
                </p>
                <p>
                  Our commitment remains the same: to provide the best free tools on the internet,
                  continuously improving based on user feedback and the latest technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="tool-card text-center animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
                        <Icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
