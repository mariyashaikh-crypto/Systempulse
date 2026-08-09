import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";

// Error state with an optional retry action.
export default function ErrorState({
  message = "Backend is unreachable.",
  onRetry,
  compact = false,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-sp-critical/30 bg-sp-critical/5 px-6 text-center",
        compact ? "py-6" : "py-14",
        className
      )}
      role="alert"
    >
      <AlertTriangle className="h-6 w-6 text-sp-critical" aria-hidden="true" />
      <p className="max-w-md text-sm leading-relaxed text-sp-text-2">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md border border-sp-edge bg-sp-panel-2 px-3 py-1.5 text-xs font-medium text-sp-text transition-colors hover:border-sp-edge-strong hover:bg-sp-panel-3"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
