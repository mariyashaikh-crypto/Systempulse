import { Fragment } from "react";
import { Check } from "lucide-react";
import { TONES } from "../../utils/format";
import { cn } from "../../utils/cn";

const DEFAULT_STAGES = [
  { key: "healthy", label: "Healthy", tone: TONES.healthy },
  { key: "inject", label: "Inject", tone: TONES.neutral },
  { key: "detect", label: "Detect", tone: TONES.warning },
  { key: "critical", label: "Critical", tone: TONES.critical },
  { key: "recover", label: "Recover", tone: TONES.healthy },
];

// Horizontal stepper for the demo story:
// Healthy → Inject → Detect → Critical → Recover.
// activeOverride lets transient UI states (injecting/restoring)
// highlight a node before the engine confirms it.
export default function DetectionFlow({
  activeIndex = -1,
  activeOverride = null,
  stages = DEFAULT_STAGES,
  label,
}) {
  const current = activeOverride?.index ?? activeIndex;
  const effectiveTone = activeOverride?.tone ?? null;

  return (
    <div className="rounded-lg border border-sp-edge bg-sp-panel px-4 py-4 sm:px-6">
      {label && (
        <p className="mb-4 text-[11px] uppercase tracking-wider text-sp-text-4">
          {label}
        </p>
      )}
      <div className="flex items-center gap-2 overflow-x-auto sm:gap-3">
        {stages.map((stage, index) => {
          const isActive = current === index;
          const isPast = current >= 0 && index < current;
          const tone = effectiveTone ?? stage.tone;
          const connectorDone = current >= 0 && index <= current;

          return (
            <Fragment key={stage.key}>
              {index > 0 && (
                <div
                  className={cn(
                    "h-px min-w-4 flex-1",
                    connectorDone ? "bg-sp-edge-strong" : "bg-sp-edge"
                  )}
                  aria-hidden="true"
                />
              )}
              <div className="flex shrink-0 flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    isActive
                      ? cn(tone.badge, tone.glow)
                      : isPast
                        ? "border-sp-edge-strong bg-sp-panel-2 text-sp-text-3"
                        : "border-sp-edge text-sp-text-4"
                  )}
                >
                  {isPast ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span className={cn(isActive && tone.text)}>
                      {index + 1}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[11px] font-medium",
                    isActive
                      ? tone.text
                      : isPast
                        ? "text-sp-text-3"
                        : "text-sp-text-4"
                  )}
                >
                  {stage.label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
