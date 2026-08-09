import { formatNumber } from "../../utils/format";

// Dark tooltip shared by all telemetry charts.
export default function ChartTooltip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-sp-edge bg-sp-bg-deep/95 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium tabular-nums text-sp-text-3">
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center gap-2 py-0.5"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-sp-text-3">{entry.name}</span>
          <span className="ml-auto pl-6 font-semibold tabular-nums text-sp-text">
            {formatNumber(entry.value, 1)}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
