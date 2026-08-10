import { cn } from "../../utils/cn";
import Sparkline from "./Sparkline";

export default function MetricCard({
  label,
  value,
  unit = "",
  sub,
  icon: Icon,
  tone,
  spark,
  sparkLabel,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sp-border bg-sp-surface p-4",
        tone?.panel,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-sp-text-3">
          {label}
        </p>

        {Icon && (
          <span className="text-sp-text-3">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span
          className={cn(
            "text-2xl font-semibold tracking-tight",
            tone?.text ?? "text-sp-text-1"
          )}
        >
          {value ?? "—"}
        </span>

        {unit && (
          <span className="text-xs text-sp-text-3">
            {unit}
          </span>
        )}
      </div>

      {sub && (
        <p className="mt-1 text-xs text-sp-text-3">
          {sub}
        </p>
      )}

      {spark && (
        <div className="mt-3">
          <Sparkline
            data={spark}
            tone={tone}
            height={34}
          />

          {sparkLabel && (
            <p className="mt-1.5 text-[11px] text-sp-text-4">
              {sparkLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}