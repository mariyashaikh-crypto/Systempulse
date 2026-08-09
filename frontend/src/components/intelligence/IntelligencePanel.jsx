import { Lightbulb, Search, Sparkles } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import DeltaBadge from "../ui/DeltaBadge";
import {
  TONES,
  trendTone,
} from "../../utils/format";
import { cn } from "../../utils/cn";

const SLOPE_META = [
  { key: "latency_slope", label: "Latency slope", unit: " ms/sample" },
  { key: "cpu_slope", label: "CPU slope", unit: " %/sample" },
  { key: "memory_slope", label: "Memory slope", unit: " %/sample" },
];

// Renders the engine's reasoning: trend, anomaly, root cause,
// explanation and recommended action. `detailed` adds slopes.
export default function IntelligencePanel({
  intelligence,
  detailed = false,
  className = "",
}) {
  const intel = intelligence;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4">
          <p className="eyebrow">Trend</p>
          <div className="mt-1.5">
            <StatusBadge
              label={intel.trend}
              tone={trendTone(intel.trend)}
            />
          </div>
        </div>
        <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4">
          <p className="eyebrow">Anomaly status</p>
          <div className="mt-1.5">
            <StatusBadge
              label={intel.anomaly ? "Anomaly detected" : "No anomaly"}
              tone={intel.anomaly ? TONES.critical : TONES.healthy}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4">
        <p className="flex items-center gap-1.5 eyebrow">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          Root cause
        </p>
        <p className="mt-1.5 text-base font-semibold tracking-tight text-sp-text">
          {intel.root_cause}
        </p>
      </div>

      <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4">
        <p className="flex items-center gap-1.5 eyebrow">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Why this happened
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-sp-text-2">
          {intel.explanation}
        </p>
      </div>

      <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4">
        <p className="flex items-center gap-1.5 eyebrow">
          <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
          Recommended action
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-sp-text-2">
          {intel.recommended_action}
        </p>
      </div>

      {detailed && (
        <div className="grid gap-3 sm:grid-cols-3">
          {SLOPE_META.map(({ key, label, unit }) => (
            <div
              key={key}
              className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4"
            >
              <p className="eyebrow">{label}</p>
              <div className="mt-2">
                <DeltaBadge slope={intel[key]} unit={unit} label={label} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
