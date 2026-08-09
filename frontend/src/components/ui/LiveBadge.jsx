import HealthIndicator from "./HealthIndicator";
import { formatTime, TONES } from "../../utils/format";
import { cn } from "../../utils/cn";

// "Live · 18:25:33" pill. Turns critical when the feed is offline.
export default function LiveBadge({ lastUpdated, error, className = "" }) {
  const offline = Boolean(error);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
        offline
          ? "border-sp-critical/40 bg-sp-critical/10 text-sp-critical"
          : "border-sp-edge bg-sp-panel-2 text-sp-text-2",
        className
      )}
      title={offline ? "Live feed unreachable" : "Live feed connected"}
    >
      <HealthIndicator
        tone={offline ? TONES.critical : TONES.healthy}
        pulse={offline}
        size="sm"
      />
      <span className="font-medium">
        {offline ? "Feed Offline" : "Live"}
      </span>
      {!offline && lastUpdated && (
        <span className="tabular-nums text-sp-text-3">
          · {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
}
