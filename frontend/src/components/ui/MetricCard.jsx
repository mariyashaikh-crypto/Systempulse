import Sparkline from "./Sparkline";
import { cn } from "../../utils/cn";

// Metric card: label, value, unit, optional sub-line, tone and
// an optional trailing sparkline of recent history.
export default function MetricCard({
  label,
  value,
  unit,
  sub,
  tone,
  icon,
  spark,
  sparkLabel,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-sp-edge bg-sp-panel p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-sp-text-3 uppercase">
          {label}
        </p>
        {icon && <span className="text-sp-text-3">{icon}</span>}
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums text-sp-text",
          tone?.text
        )}
      >
        {value ?? "—"}
        {unit && (
          <span className="ml-1 text-sm font-normal text-sp-text-3">
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs leading-relaxed text-sp-text-3">
          {sub}
        </p>
      )}
      {spark && (
        <div className="mt-3">
          <Sparkline data={spark} tone={tone} height={34} />
          {sparkLabel && (
            <p className="mt-1.5 text-[11px] text-sp-text-4">{sparkLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
