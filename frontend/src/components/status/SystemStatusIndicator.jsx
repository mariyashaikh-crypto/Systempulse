import { useApi } from "../../hooks/useApi";
import { getHealth } from "../../services/api";
import { TONES } from "../../utils/format";
import HealthIndicator from "../ui/HealthIndicator";

// Polls the Monitoring API health endpoint and reports
// connectivity in the app navigation.
export default function SystemStatusIndicator() {
  const { data, error, loading } = useApi(getHealth, { interval: 5000 });

  let tone = TONES.neutral;
  let label = "Connecting…";

  if (error) {
    tone = TONES.critical;
    label = "System Offline";
  } else if (data) {
    tone = TONES.healthy;
    label = "System Online";
  } else if (loading) {
    tone = TONES.neutral;
    label = "Connecting…";
  }

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-sp-edge bg-sp-panel-2 px-3 py-1.5"
      title={error ? "Monitoring API unreachable" : "Monitoring API connected"}
    >
      <HealthIndicator tone={tone} pulse={!!error} size="sm" />
      <span
        className={`text-xs font-medium ${
          error ? "text-sp-critical" : tone.text
        }`}
      >
        {label}
      </span>
    </div>
  );
}
