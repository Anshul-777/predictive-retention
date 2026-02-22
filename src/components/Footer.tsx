import { Link } from "react-router-dom";
import { BarChart3, Github, ExternalLink } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Predictor", path: "/dashboard" },
  { label: "History", path: "/history" },
  { label: "About", path: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform duration-300 group-hover:scale-110">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-foreground">ChurnSense</span>
              <span className="text-xs font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded-md">AI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Customer churn prediction powered by LightGBM machine learning. Built with React, FastAPI, and cloud infrastructure.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Anshul-777/predictive-retention/tree/main"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <Github className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                GitHub
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
              <a
                href="https://portfolio-alpha-lac-41.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                Portfolio
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Stack</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "LightGBM (Gradient Boosting)",
                "FastAPI + Python",
                "React + TypeScript + Vite",
                "Cloud Database + Edge Functions",
                "Render (ML Backend Hosting)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built by Anshul · LightGBM · React
          </p>
          <a
            href="https://customer-churn-predictor-zdez.onrender.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            API Docs <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
