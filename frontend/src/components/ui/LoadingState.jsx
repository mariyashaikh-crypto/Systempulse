import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

// Loading state for panels and pages.
export default function LoadingState({
  label = "Loading…",
  compact = false,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-sp-text-3",
        compact ? "py-6" : "py-16",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-sp-teal" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
