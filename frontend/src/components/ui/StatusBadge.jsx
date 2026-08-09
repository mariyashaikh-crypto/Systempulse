import { cn } from "../../utils/cn";

// Small pill badge with a status dot. Tone controls the color.
export default function StatusBadge({ label, tone, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone?.badge ?? "border-sp-edge bg-sp-panel-2 text-sp-text-3",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone?.dot ?? "bg-sp-text-3"
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
