import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMark from "@/assets/opticthirst-mark.png";

const navItems = [
  {
    label: "Tools",
    href: "/tools",
    children: [
      { label: "All Tools", href: "/tools" },
      { label: "PDF Tools", href: "/tools/pdf" },
      { label: "Image Tools", href: "/tools/image" },
      { label: "Video Tools", href: "/tools/video" },
      { label: "Audio Tools", href: "/tools/audio" },
      { label: "Text Tools", href: "/tools/text" },
      { label: "General Tools", href: "/tools/general" },
      { label: "Calculators", href: "/tools/calculator" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoMark} alt="OpticThirst logo" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold gradient-text">OpticThirst</span>
        </Link>


        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-card p-2 shadow-lg animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" className="gradient-hover-border-btn" asChild>
            <Link to="/admin">Admin sign in</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="space-y-1">
                    <span className="block px-3 py-2 text-sm font-medium text-foreground">{item.label}</span>
                    {item.children.map((child) => (
                      <Link key={child.href} to={child.href} onClick={() => setMobileOpen(false)}
                        className="block pl-6 pr-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link to={item.href} onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link to="/admin" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="gradient-hover-border-btn w-full">Admin sign in</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
