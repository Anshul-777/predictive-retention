import { Link } from "react-router-dom";
import { ArrowRight, Brain, Database, TrendingDown, Zap, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    desc: "Our LightGBM model processes 19+ behavioral features with 94.2% accuracy in milliseconds.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Get Retention Strategy",
    desc: "Receive a churn probability score and tailored, actionable recommendations to retain the customer.",
  },
];

const stats = [
  { value: "94.2%", label: "Model Accuracy" },
  { value: "19+", label: "Predictive Features" },
  { value: "<100ms", label: "Prediction Speed" },
  { value: "LGBM", label: "Algorithm" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(243 75% 59% / 0.15), transparent)",
          }}
        />
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Powered by LightGBM Machine Learning
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
              Stop Customer Churn{" "}
              <span
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Before It Happens
              </span>
            </h1>

            <p className="mb-10 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Predict which customers are at risk of leaving with clinical precision. Input customer data,
              get an instant churn probability score, and receive targeted retention strategies — all in
              under a second.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{ boxShadow: "var(--shadow-elevated)" }}
                >
                  Launch Predictor
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  View History
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mock dashboard preview */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-secondary/50">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">churnsense.ai/dashboard</span>
              </div>
              <div className="grid grid-cols-5 divide-x divide-border min-h-[200px]">
                {/* Left: Form preview */}
                <div className="col-span-3 p-6 space-y-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer Profile</div>
                  {[
                    { label: "Contract Type", value: "Month-to-month" },
                    { label: "Tenure", value: "8 months" },
                    { label: "Internet Service", value: "Fiber optic" },
                    { label: "Tech Support", value: "No" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
                {/* Right: Prediction preview */}
                <div className="col-span-2 p-6 flex flex-col items-center justify-center bg-secondary/20 gap-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Churn Score</div>
                  <div className="text-5xl font-extrabold" style={{ color: "hsl(0, 84%, 60%)" }}>
                    78%
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border text-sm px-3 py-1 font-medium"
                    style={{
                      background: "hsl(0, 84%, 95%)",
                      color: "hsl(0, 84%, 60%)",
                      borderColor: "hsl(0, 84%, 60% / 0.3)"
                    }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    High Risk
                  </span>
                  <p className="text-xs text-muted-foreground text-center">Offer contract upgrade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps from raw customer data to a clear, actionable retention strategy.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent border border-primary/20 shadow-sm">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute right-0 top-16 translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background border border-border">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg"
                style={{ boxShadow: "var(--shadow-elevated)" }}>
                <TrendingDown className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Predict Churn?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Start analyzing your first customer right now — no signup required.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-10 text-base font-semibold"
                style={{ boxShadow: "var(--shadow-elevated)" }}>
                Launch Predictor
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Database className="h-4 w-4 text-primary" />
            ChurnSense AI
          </div>
          <p className="text-sm text-muted-foreground">
            Built with LightGBM · Powered by Lovable Cloud · React + TypeScript
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Predictor</Link>
            <Link to="/history" className="hover:text-foreground transition-colors">History</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
