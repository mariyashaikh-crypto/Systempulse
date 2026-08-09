// ============================================================
// Deriving the SystemPulse display state from backend data.
// Pure presentation helpers — no detection logic lives here.
// ============================================================

import { TONES } from "./format";

// Overall system state shown in the hero, derived from the
// engine's own severity/trend verdicts.
export function deriveSystemState(intel) {
  if (!intel) {
    return {
      key: "no-signal",
      label: "Awaiting Signal",
      tone: TONES.neutral,
      description: "Waiting for telemetry from the monitoring pipeline.",
    };
  }

  const severity = String(intel.severity ?? "").toUpperCase();
  const trend = String(intel.trend ?? "").toUpperCase();

  if (severity === "CRITICAL") {
    return {
      key: "critical",
      label: "System Critical",
      tone: TONES.critical,
      description: intel.root_cause ?? "Critical degradation detected.",
    };
  }

  if (severity === "WARNING" || severity === "EARLY WARNING") {
    return {
      key: "degraded",
      label: "System Degraded",
      tone: TONES.warning,
      description: intel.root_cause ?? "Service degradation detected.",
    };
  }

  if (trend === "RECOVERING") {
    return {
      key: "recovering",
      label: "System Recovering",
      tone: TONES.healthy,
      description: "Metrics are returning to their healthy baseline.",
    };
  }

  return {
    key: "normal",
    label: "System Operational",
    tone: TONES.healthy,
    description: "All metrics are within the expected operating range.",
  };
}

// Position along the demonstration flow:
// 0 healthy · 1 inject · 2 detect · 3 critical · 4 recover
export function flowStageIndex(intel) {
  if (!intel) return -1;

  const severity = String(intel.severity ?? "").toUpperCase();
  const trend = String(intel.trend ?? "").toUpperCase();

  if (severity === "CRITICAL") return 3;
  if (severity === "WARNING" || severity === "EARLY WARNING") return 2;
  if (trend === "RECOVERING") return 4;
  return 0;
}
