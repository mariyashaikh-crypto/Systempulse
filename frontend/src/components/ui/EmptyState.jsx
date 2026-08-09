import { Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

// Empty state — used when the backend has no data yet.
export default function EmptyState({
  title = "No data yet",
  description = "Backend reports no records for this view.",
  compact = false,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 text-center text-sp-text-3",
        compact ? "py-6" : "py-14",
        className
      )}
    >
      <Inbox className="h-6 w-6 text-sp-text-4" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-sp-text-2">{title}</p>
        {description && (
          <p className="mt-1 max-w-md text-xs leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
