import { formatDateTime, formatMs, formatPercent, parseTimestamp } from "../../utils/format";
import { cn } from "../../utils/cn";

// Recent telemetry table. Latency cells are shaded by their
// magnitude relative to the visible window (presentation only).
export default function TelemetryTable({ rows, limit = 14 }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const latencies = rows.map((row) => Number(row.response_time_ms) || 0);
  const maxLatency = Math.max(...latencies, 0);
  const ratioOfMax = (value) => (maxLatency ? value / maxLatency : 0);

  const shown = rows.slice(-limit).reverse();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-sp-edge text-[11px] uppercase tracking-wider text-sp-text-4">
            <th className="py-2.5 pr-4 font-medium">Time</th>
            <th className="py-2.5 pr-4 font-medium">Service</th>
            <th className="py-2.5 pr-4 text-right font-medium">Response</th>
            <th className="py-2.5 pr-4 text-right font-medium">CPU</th>
            <th className="py-2.5 text-right font-medium">Memory</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row, index) => {
            const latency = Number(row.response_time_ms) || 0;
            const ratio = ratioOfMax(latency);
            const latencyTone =
              ratio >= 0.85
                ? "text-sp-critical"
                : ratio >= 0.5
                  ? "text-sp-warning"
                  : "text-sp-text-2";

            return (
              <tr
                key={`${row.timestamp}-${index}`}
                className="border-b border-sp-edge/60 last:border-0 hover:bg-sp-panel-2/60"
              >
                <td className="py-2.5 pr-4 whitespace-nowrap tabular-nums text-sp-text-3">
                  {formatDateTime(parseTimestamp(row.timestamp))}
                </td>
                <td className="py-2.5 pr-4 text-sp-text-2">{row.service}</td>
                <td
                  className={cn(
                    "py-2.5 pr-4 text-right tabular-nums",
                    latencyTone
                  )}
                >
                  {formatMs(latency)}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-sp-text-2">
                  {formatPercent(Number(row.cpu_percent) || 0)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-sp-text-2">
                  {formatPercent(Number(row.memory_percent) || 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
