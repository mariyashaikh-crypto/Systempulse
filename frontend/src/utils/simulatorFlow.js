// ============================================================
// Simulator 5-stage lifecycle state machine (frontend only).
//
// States (explicit, forward-only):
//   healthy → injected → detected → critical → recovering → healthy
//
// The lifecycle NEVER moves backward during an active incident.
// Critical is only ever entered when the REAL backend verdict is
// CRITICAL, and recovery only completes when the backend reports
// severity === "NORMAL" AND anomaly === false.
//
// Every signal below is derived from the real backend
// intelligence response — nothing is invented on the frontend.
// ============================================================

export const CRITICAL = "CRITICAL";
export const NORMAL = "NORMAL";
export const WARNING_SEVERITIES = new Set(["EARLY WARNING", "WARNING"]);

export const LIFECYCLE = {
  HEALTHY: "healthy",
  INJECTED: "injected",
  DETECTED: "detected",
  CRITICAL: "critical",
  RECOVERING: "recovering",
};

export function severityOf(intel) {
  return String(intel?.severity ?? "").toUpperCase();
}

// Detection signals per spec: anomaly === true OR
// severity === "EARLY WARNING" OR severity === "WARNING".
export function isDetectionSignal(intel) {
  if (!intel) return false;
  return intel.anomaly === true || WARNING_SEVERITIES.has(severityOf(intel));
}

export function isCriticalSignal(intel) {
  return Boolean(intel) && severityOf(intel) === CRITICAL;
}

// Recovery completes ONLY when the backend reports:
// severity === "NORMAL" AND anomaly === false.
export function isRecovered(intel) {
  return (
    Boolean(intel) &&
    severityOf(intel) === NORMAL &&
    intel.anomaly === false
  );
}

// Circle index (0-based) for the 5-node DetectionFlow stepper.
export const CIRCLE_INDEX = {
  [LIFECYCLE.HEALTHY]: 0,
  [LIFECYCLE.INJECTED]: 1,
  [LIFECYCLE.DETECTED]: 2,
  [LIFECYCLE.CRITICAL]: 3,
  [LIFECYCLE.RECOVERING]: 4,
};

export function circleIndexFor(state) {
  return CIRCLE_INDEX[state] ?? 0;
}

// "Restore Normal" is only offered during an active incident.
export const RESTORE_ENABLED_STATES = new Set([
  LIFECYCLE.INJECTED,
  LIFECYCLE.DETECTED,
  LIFECYCLE.CRITICAL,
]);

// Strictly forward-only reducer. Every event is either a real
// backend response or a genuine user action.
//
//   INJECT_SUCCESS  → POST /simulate/slow succeeded (healthy only)
//   DETECTED        → real detection signal (injected only)
//   CRITICAL        → real severity CRITICAL (injected/detected)
//   RESTORE_SUCCESS → POST /simulate/normal succeeded
//   RECOVERED       → backend confirms NORMAL + anomaly=false
//
// Once reached, critical/recovering are never left except by
// restore/recovery respectively — no backward movement.
export function lifecycleReducer(state, event) {
  switch (event.type) {
    case "INJECT_SUCCESS":
      return state === LIFECYCLE.HEALTHY ? LIFECYCLE.INJECTED : state;

    case "DETECTED":
      return state === LIFECYCLE.INJECTED ? LIFECYCLE.DETECTED : state;

    case "CRITICAL":
      // Reached via detected, or straight from injected when the
      // first polled verdict is already CRITICAL (the engine can
      // escalate in a single sample). Never enters from healthy —
      // the lifecycle is user-driven.
      return state === LIFECYCLE.INJECTED || state === LIFECYCLE.DETECTED
        ? LIFECYCLE.CRITICAL
        : state;

    case "RESTORE_SUCCESS":
      return RESTORE_ENABLED_STATES.has(state) ? LIFECYCLE.RECOVERING : state;

    case "RECOVERED":
      return state === LIFECYCLE.RECOVERING ? LIFECYCLE.HEALTHY : state;

    // Page-load derivation only: apply once from the pristine
    // healthy state. Never fires during an active cycle.
    case "INIT_DETECTED":
      return state === LIFECYCLE.HEALTHY ? LIFECYCLE.DETECTED : state;

    case "INIT_CRITICAL":
      return state === LIFECYCLE.HEALTHY ? LIFECYCLE.CRITICAL : state;

    default:
      return state;
  }
}

// Page-load: derive the safest initial lifecycle from the real
// backend response rather than inventing one.
export function deriveInitialLifecycle(intel) {
  if (!intel) return LIFECYCLE.HEALTHY;
  if (severityOf(intel) === CRITICAL) return LIFECYCLE.CRITICAL;
  if (isDetectionSignal(intel)) return LIFECYCLE.DETECTED;
  return LIFECYCLE.HEALTHY;
}
