import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Medium" | "High";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const config: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  Low: {
    label: "Low Risk",
    classes: "bg-[hsl(var(--churn-low-bg))] text-[hsl(var(--churn-low))] border-[hsl(var(--churn-low)/0.3)]",
    dot: "bg-[hsl(var(--churn-low))]",
  },
  Medium: {
    label: "Medium Risk",
    classes: "bg-[hsl(var(--churn-medium-bg))] text-[hsl(var(--churn-medium))] border-[hsl(var(--churn-medium)/0.3)]",
    dot: "bg-[hsl(var(--churn-medium))]",
  },
  High: {
    label: "High Risk",
    classes: "bg-[hsl(var(--churn-high-bg))] text-[hsl(var(--churn-high))] border-[hsl(var(--churn-high)/0.3)]",
    dot: "bg-[hsl(var(--churn-high))]",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5 font-semibold",
};

export default function RiskBadge({ level, className, size = "md" }: RiskBadgeProps) {
  const { label, classes, dot } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        classes,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
