import Panel from "../ui/Panel";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

// Panel that reserves a fixed height for a Recharts chart and
// handles the loading / error / empty states consistently.
export default function ChartCard({
  title,
  subtitle,
  height = 260,
  loading = false,
  error = null,
  empty = false,
  onRetry,
  emptyTitle = "No data",
  emptyDescription = "No samples recorded for this chart.",
  children,
}) {
  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="pt-1" style={{ height }}>
        {loading ? (
          <LoadingState compact />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} compact />
        ) : empty ? (
          <EmptyState
            compact
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          children
        )}
      </div>
    </Panel>
  );
}
