import { cn } from "../../utils/cn";

// Live status dot. Pulses softly for warning/critical states only.
export default function HealthIndicator({ tone, pulse = false, size = "md" }) {
  const sizeClasses =
    size === "sm"
      ? "h-1.5 w-1.5"
      : size === "lg"
        ? "h-3 w-3"
        : "h-2 w-2";

  return (
    <span className={cn("relative inline-flex", sizeClasses)} aria-hidden="true">
      <span
        className={cn(
          "inline-flex h-full w-full rounded-full",
          tone?.dot ?? "bg-sp-text-3",
          pulse && "animate-pulse"
        )}
      />
      {pulse && (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-40",
            tone?.dot ?? "bg-sp-text-3",
            "animate-ping"
          )}
          style={{ animationDuration: "2.2s" }}
        />
      )}
    </span>
  );
}
