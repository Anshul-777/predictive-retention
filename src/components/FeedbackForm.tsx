import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Github, Mail, ExternalLink } from "lucide-react";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    toast({ title: "Feedback submitted!", description: "Thank you for your input." });
    setFeedback("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Feedback form */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h3 className="text-xl font-bold text-foreground mb-2">Send Feedback</h3>
        <p className="text-sm text-muted-foreground mb-6">Have thoughts or suggestions? Let us know!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <Button type="submit" disabled={!feedback.trim() || submitted} className="gap-2">
            <Send className="h-4 w-4" />
            {submitted ? "Sent!" : "Submit Feedback"}
          </Button>
        </form>
      </div>

      {/* Contact links */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h3 className="text-xl font-bold text-foreground mb-6">Get in Touch</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="https://github.com/Anshul-777/predictive-retention/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all duration-200 group"
          >
            <Github className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-semibold text-foreground">GitHub</div>
              <div className="text-xs text-muted-foreground">Source Code</div>
            </div>
          </a>
          <a
            href="mailto:anshulrathod999@gmail.com"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all duration-200 group"
          >
            <Mail className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-semibold text-foreground">Email</div>
              <div className="text-xs text-muted-foreground">anshulrathod999</div>
            </div>
          </a>
          <a
            href="https://portfolio-alpha-lac-41.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/30 transition-all duration-200 group"
          >
            <ExternalLink className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-semibold text-foreground">Portfolio</div>
              <div className="text-xs text-muted-foreground">Visit Website</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
