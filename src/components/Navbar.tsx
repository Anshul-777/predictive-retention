import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Predictor", path: "/dashboard" },
  { label: "History", path: "/history" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4.5 w-4.5 text-primary-foreground" size={18} />
          </div>
          <span className="text-foreground">ChurnSense</span>
          <span className="text-xs font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded-md ml-1">AI</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
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
    </header>
  );
}
