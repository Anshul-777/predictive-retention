import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Predictor", path: "/dashboard" },
  { label: "History", path: "/history" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-card/95 backdrop-blur shadow-sm supports-[backdrop-filter]:bg-card/80"
          : "border-transparent bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
            <BarChart3 className="h-4 w-4 text-primary-foreground" size={18} />
          </div>
          <span className="text-foreground">ChurnSense</span>
          <span className="text-xs font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded-md">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1 mr-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                  pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
