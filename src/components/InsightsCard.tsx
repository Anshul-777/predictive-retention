import { CustomerFormData } from "@/services/predictionApi";
import { CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

interface InsightsCardProps {
  probability: number;
  riskLevel: "Low" | "Medium" | "High";
  formData?: CustomerFormData;
}

function getInsights(probability: number, formData?: CustomerFormData): string[] {
  const insights: string[] = [];

  if (!formData) return [];

  if (probability >= 0.65) {
    // High risk insights
    if (formData.contract === "Month-to-month") {
      insights.push("Offer a discounted 1 or 2-year contract to boost retention immediately.");
    }
    if (formData.internetService === "Fiber optic") {
      insights.push("Fiber optic customers churn more — check for service quality issues or competitor pricing.");
    }
    if (formData.tenure < 12) {
      insights.push("New customer at high risk — trigger an onboarding engagement campaign now.");
    }
    if (formData.techSupport === "No") {
      insights.push("Enable Tech Support access — it significantly reduces churn for at-risk customers.");
    }
    if (formData.onlineSecurity === "No") {
      insights.push("Bundle Online Security as a free trial — it's a high-impact retention lever.");
    }
    if (insights.length < 3) {
      insights.push("Assign a dedicated account manager to proactively engage this customer.");
      insights.push("Provide a personalized loyalty reward or bill credit to re-establish goodwill.");
    }
  } else if (probability >= 0.35) {
    // Medium risk insights
    if (formData.paymentMethod === "Electronic check") {
      insights.push("Encourage auto-pay setup — electronic check users churn at higher rates.");
    }
    if (formData.streamingTV === "No" && formData.streamingMovies === "No") {
      insights.push("Introduce streaming bundles — entertainment add-ons increase stickiness.");
    }
    if (formData.contract === "Month-to-month") {
      insights.push("Send a proactive contract upgrade offer with a modest incentive.");
    }
    if (insights.length < 2) {
      insights.push("Schedule a mid-cycle check-in to ensure the customer's needs are met.");
      insights.push("Send satisfaction survey and respond promptly to any concerns raised.");
    }
  } else {
    // Low risk insights
    insights.push("This customer shows strong loyalty indicators — great candidate for upselling premium services.");
    if (formData.streamingTV === "No") {
      insights.push("Offer Streaming TV as an upgrade — high satisfaction customers accept add-ons readily.");
    }
    insights.push("Consider enrolling them in a referral program to expand your customer base.");
  }

  return insights.slice(0, 4);
}

const icons = {
  Low: <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(158, 64%, 40%)" }} />,
  Medium: <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(38, 92%, 50%)" }} />,
  High: <XCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0, 84%, 60%)" }} />,
};

export default function InsightsCard({ probability, riskLevel, formData }: InsightsCardProps) {
  const insights = getInsights(probability, formData);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Lightbulb className="h-4 w-4 text-primary" />
        Actionable Recommendations
      </div>
      <ul className="space-y-2.5">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
            {icons[riskLevel]}
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
