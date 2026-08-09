import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatNumber, slopeTone } from "../../utils/format";
import { cn } from "../../utils/cn";

// Compact rising/falling indicator for metric slopes.
export default function DeltaBadge({ slope, unit = "", label }) {
  const numeric = Number(slope);
  const rising = numeric > 0.0001;
  const falling = numeric < -0.0001;
  const tone = slopeTone(numeric);
  const Icon = rising ? TrendingUp : falling ? TrendingDown : Minus;

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs font-medium", tone.text)}
      title={label}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatNumber(Math.abs(numeric), 2)}
      {unit}
    </span>
  );
}
