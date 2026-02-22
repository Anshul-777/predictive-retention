import { Link } from "react-router-dom";
import {
  ArrowRight, Brain, Database, TrendingDown, Zap, Users, ChevronRight,
  CheckCircle2, BarChart3, Globe, Shield, Cpu, Activity, Github,
  ExternalLink, Quote, Sparkles, Code2, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Footer from "@/components/Footer";
import StarReview from "@/components/StarReview";
import heroBg from "@/assets/hero-bg.jpg";

// Reusable animated reveal wrapper
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, isVisible } = useScrollReveal();
  const transforms: Record<string, string> = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.92)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const steps = [
  {
    icon: Users,
    step: "01",
    title: "Input Customer Data",
    desc: "Enter key demographics, account details, services, and usage patterns through our guided form.",
  },
  {
    icon: Brain,
    step: "02",
    title: "LGBM Model Analyzes",
    desc: "Our LightGBM model processes 18+ behavioral features with 83.79% accuracy in milliseconds.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Get Retention Strategy",
    desc: "Receive a churn probability score and tailored, actionable recommendations to retain the customer.",
  },
];

const stats = [
  { value: "83.79%", label: "Model Accuracy" },
  { value: "18+", label: "Predictive Features" },
  { value: "<100ms", label: "Prediction Speed" },
  { value: "LGBM", label: "Algorithm" },
];

const features = [
  {
    icon: Cpu,
    title: "Live ML Inference",
    desc: "Real-time predictions from a trained LightGBM model deployed on Render, reachable via a secure edge proxy.",
  },
  {
    icon: Activity,
    title: "Churn Probability Gauge",
    desc: "Animated semicircle gauge shows the exact churn score with color-coded risk levels for instant interpretation.",
  },
  {
    icon: Shield,
    title: "Tailored Recommendations",
    desc: "The model generates retention strategies based on the specific customer profile — not generic advice.",
  },
  {
    icon: Database,
    title: "Prediction History",
    desc: "Every prediction can be saved and browsed in the History tab, with search, sort, and summary stats.",
  },
  {
    icon: Globe,
    title: "Feature Engineering",
    desc: "The backend computes engineered features like Num_Addon_Services and Has_Internet_No_Security automatically.",
  },
  {
    icon: BarChart3,
    title: "Session Tracking",
    desc: "Predictions are linked to your browser session so you can reload past customer profiles into the form.",
  },
];

const useCases = [
  { icon: CheckCircle2, text: "Identify at-risk customers before they cancel" },
  { icon: CheckCircle2, text: "Prioritize retention offers for highest-risk segments" },
  { icon: CheckCircle2, text: "Validate which service combinations drive churn" },
  { icon: CheckCircle2, text: "Compare customer profiles to understand churn drivers" },
  { icon: CheckCircle2, text: "Build a data-driven retention playbook" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 -z-10" aria-hidden>
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3)" }}
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>

        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-[5] overflow-hidden" aria-hidden>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(ellipse, hsl(var(--primary)), transparent 70%)",
              animation: "pulseBlob 8s ease-in-out infinite",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <div
            className="mx-auto max-w-3xl"
            style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) both" }}
          >
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent/80 backdrop-blur px-4 py-1.5 text-sm font-medium text-accent-foreground"
              style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s both" }}
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Powered by LightGBM Machine Learning
            </div>

            <h1
              className="mb-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground"
              style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s both" }}
            >
              Stop Customer Churn{" "}
              <span className="rainbow-gradient-text" style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Before It Happens
              </span>
            </h1>

            <p
              className="mb-10 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.3s both" }}
            >
              Predict which telecom customers are at risk of leaving with clinical precision.
              Input customer data, get an instant churn probability score, and receive targeted
              retention strategies — all powered by a live LGBM model.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.4s both" }}
            >
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  style={{ boxShadow: "var(--shadow-elevated)" }}
                >
                  Launch Predictor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="https://github.com/Anshul-777/predictive-retention/tree/main" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:scale-105 transition-transform duration-200 gap-2">
                  <Github className="h-5 w-5" />
                  View Source
                </Button>
              </a>
              <a href="https://portfolio-alpha-lac-41.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:scale-105 transition-transform duration-200 gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Visit Portfolio
                </Button>
              </a>
            </div>
            </div>
            <a
              href="https://customer-churn-predictor-zdez.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-xs text-muted-foreground hover:text-primary transition-colors"
              style={{ animation: "fadeSlideUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.5s both" }}
            >
              <Code2 className="h-3 w-3" />
              Explore API Docs →
            </a>

          {/* GitHub-style profile card */}
          <Reveal className="mt-16 md:mt-20 mx-auto max-w-5xl" direction="scale" delay={200}>
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.25)] transition-shadow duration-500 rainbow-glow">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-secondary/50">
                <span className="h-3 w-3 rounded-full" style={{ background: "hsl(0 84% 60%)" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "hsl(38 92% 50%)" }} />
                <span className="h-3 w-3 rounded-full" style={{ background: "hsl(158 64% 40%)" }} />
                <span className="ml-3 text-xs text-muted-foreground font-mono">churnsense.ai/dashboard</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Left: GitHub-style profile card */}
                <div className="col-span-3 p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-7 w-7 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-foreground">Customer Profile</h3>
                      <p className="text-sm text-muted-foreground">High-risk subscriber analysis</p>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: "Contract Type", value: "Month-to-month", risk: true, icon: "📄" },
                      { label: "Tenure", value: "8 months", risk: true, icon: "⏱️" },
                      { label: "Internet Service", value: "Fiber optic", risk: false, icon: "🌐" },
                      { label: "Tech Support", value: "No", risk: true, icon: "🛠️" },
                      { label: "Monthly Charges", value: "$89.50", risk: false, icon: "💳" },
                      { label: "Online Security", value: "No", risk: true, icon: "🔒" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm py-3 border-b border-border/50 last:border-0 group hover:bg-accent/30 px-2 -mx-2 rounded-lg transition-colors">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-base">{row.icon}</span>
                          {row.label}
                        </span>
                        <span className={`font-medium transition-colors duration-200 ${row.risk ? "text-[hsl(var(--churn-high))]" : "text-foreground"}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: Prediction preview */}
                <div className="col-span-2 p-6 sm:p-8 flex flex-col items-center justify-center bg-secondary/20 gap-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Churn Score</div>
                  <div
                    className="text-6xl font-extrabold tabular-nums"
                    style={{ color: "hsl(0, 84%, 60%)", animation: "countUp 1.5s ease both 0.8s" }}
                  >
                    78%
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border text-sm px-3 py-1 font-medium animate-pulse"
                    style={{
                      background: "hsl(var(--churn-high-bg))",
                      color: "hsl(var(--churn-high))",
                      borderColor: "hsl(var(--churn-high) / 0.3)",
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(var(--churn-high))" }} />
                    High Risk
                  </span>
                  <p className="text-xs text-muted-foreground text-center mt-1">Offer contract upgrade immediately</p>
                  <div className="w-full mt-2 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Retention Priority</span>
                      <span className="text-foreground font-medium">Critical</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Model Confidence</span>
                      <span className="text-foreground font-medium">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote Section */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <Reveal className="max-w-3xl mx-auto text-center">
            <Quote className="h-8 w-8 text-primary/30 mx-auto mb-4" />
            <blockquote className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed italic">
              "The cost of acquiring a new customer is 5-25x more than retaining an existing one. Prediction is prevention."
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">— Harvard Business Review</p>
          </Reveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="text-center group cursor-default">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary transition-transform duration-300 group-hover:scale-110 inline-block">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
          <Reveal className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Features
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete churn intelligence suite — from model inference to history tracking.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="group p-5 sm:p-6 rounded-2xl border border-border bg-background hover:bg-accent/40 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent mb-4 transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
        <Reveal className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4">
            <Target className="h-3.5 w-3.5 text-primary" />
            Process
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps from raw customer data to a clear, actionable retention strategy.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 120} direction="up">
              <div className="group relative flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent border border-primary/20 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <step.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            <Reveal className="flex-1" direction="left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Applications
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Use Cases</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you're a data scientist validating a model or a business analyst building retention
                strategies, ChurnSense gives you fast, reliable answers.
              </p>
              <ul className="space-y-3">
                {useCases.map((uc, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground group"
                  >
                    <uc.icon className="h-4 w-4 text-[hsl(var(--churn-low))] shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-125" />
                    <span className="group-hover:text-foreground transition-colors duration-200">{uc.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="flex-1 w-full" direction="right">
              <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 space-y-5 hover:shadow-xl transition-shadow duration-500">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sample Churn Drivers</div>
                {[
                  { label: "Month-to-month contract", impact: 92, color: "hsl(var(--churn-high))" },
                  { label: "Fiber optic + no security", impact: 78, color: "hsl(var(--churn-high))" },
                  { label: "Tenure < 12 months", impact: 71, color: "hsl(var(--churn-medium))" },
                  { label: "High monthly charges", impact: 65, color: "hsl(var(--churn-medium))" },
                  { label: "Electronic check payment", impact: 54, color: "hsl(var(--churn-medium))" },
                  { label: "No tech support", impact: 48, color: "hsl(var(--churn-medium))" },
                ].map((item, i) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: item.color }}>{item.impact}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${item.impact}%`,
                          background: item.color,
                          transitionDelay: `${i * 100}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
          <Reveal className="mx-auto max-w-2xl">
            <div className="flex justify-center mb-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg hover:scale-110 transition-transform duration-300"
                style={{ boxShadow: "var(--shadow-elevated)" }}
              >
                <TrendingDown className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Predict Churn?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start analyzing your first customer right now — no signup required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-10 text-base font-semibold hover:scale-105 transition-transform duration-200"
                  style={{ boxShadow: "var(--shadow-elevated)" }}
                >
                  Launch Predictor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="https://portfolio-alpha-lac-41.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:scale-105 transition-transform duration-200 gap-2">
                  Visit Portfolio
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StarReview />
      <Footer />
    </div>
  );
}
