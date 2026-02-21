import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize theme on load
function ThemeInit() {
  useEffect(() => {
    const theme = localStorage.getItem("churnsense-theme") || "rainbow";
    const root = document.documentElement;
    root.classList.remove("light", "dark", "rainbow");
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "rainbow") root.classList.add("rainbow");
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInit />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
