import { cn } from "../../utils/cn";

// Tiny inline trend line (pure SVG).
export default function Sparkline({
  data,
  tone,
  height = 36,
  className = "",
}) {
  if (!Array.isArray(data) || data.length < 2) return null;

  const values = data.map((v) => Number(v) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={cn("text-sp-teal", tone?.text)}
      />
    </svg>
  );
}
