import { clamp, formatNumber, TONES } from "../../utils/format";
import { cn } from "../../utils/cn";

// Circular risk gauge (SVG ring, no chart library needed).
export default function RiskScore({
  value,
  tone = TONES.healthy,
  size = 132,
  label = "Risk Score",
}) {
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = clamp(Number(value) || 0, 0, 100) / 100;
  const dash = Math.max(circumference * percent - 2, 0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${formatNumber(value, 0)} of 100`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className="text-sp-edge-strong opacity-50"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke="currentColor"
            className={cn("transition-colors", tone.text)}
            strokeDasharray={`${dash} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dasharray 700ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-3xl font-semibold tabular-nums tracking-tight",
              tone.text
            )}
          >
            {formatNumber(value, 0)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-sp-text-3">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
