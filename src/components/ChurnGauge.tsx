import { useEffect, useState } from "react";

interface ChurnGaugeProps {
  probability: number; // 0 to 1
  size?: number;
}

export default function ChurnGauge({ probability, size = 200 }: ChurnGaugeProps) {
  const [animatedProb, setAnimatedProb] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProb(probability), 100);
    return () => clearTimeout(timeout);
  }, [probability]);

  const pct = Math.min(Math.max(animatedProb, 0), 1);
  const percentage = Math.round(pct * 100);

  // SVG arc calculations (semicircle gauge)
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.78;
  const strokeWidth = size * 0.09;

  // Arc from 180° to 0° (left to right, bottom half hidden)
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const filledEnd = startAngle + totalAngle * pct;

  // Color interpolation: green → yellow → red
  const getColor = (p: number) => {
    if (p < 0.35) return "hsl(158, 64%, 40%)";
    if (p < 0.65) return "hsl(38, 92%, 50%)";
    return "hsl(0, 84%, 60%)";
  };

  const color = getColor(pct);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`} overflow="visible">
        {/* Background track */}
        <path
          d={describeArc(-180, 0)}
          fill="none"
          stroke="hsl(220, 13%, 91%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {pct > 0 && (
          <path
            d={describeArc(-180, filledEnd)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 ${size * 0.04}px ${color})`,
            }}
          />
        )}
        {/* Percentage text */}
        <text
          x={cx}
          y={cy * 0.95}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.2}
          fontWeight="700"
          fill={color}
          style={{ transition: "fill 1.2s ease", fontFamily: "Inter, sans-serif" }}
        >
          {percentage}%
        </text>
        {/* Label */}
        <text
          x={cx}
          y={cy * 1.2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.075}
          fill="hsl(220, 9%, 46%)"
          fontFamily="Inter, sans-serif"
        >
          Churn Probability
        </text>
      </svg>
    </div>
  );
}
