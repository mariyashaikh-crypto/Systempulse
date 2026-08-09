// ============================================================
// Formatting + tone helpers shared across the UI.
// Tone maps contain full literal class names so Tailwind can
// detect them during the build.
// ============================================================

export function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatMs(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} ms`;
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

// The collector stores timestamps as "YYYY-MM-DD HH:MM:SS";
// the monitoring API stores ISO-8601. Accept both.
export function parseTimestamp(value) {
  if (!value) return null;

  if (
    typeof value === "string" &&
    value.includes(" ") &&
    !value.includes("T")
  ) {
    const [datePart, timePart] = value.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTime(value) {
  const date = parseTimestamp(value);
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(value) {
  const date = parseTimestamp(value);
  if (!date) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

// ------------------------------------------------------------
// Tone maps
// ------------------------------------------------------------

export const TONES = {
  healthy: {
    label: "Healthy",
    dot: "bg-sp-healthy",
    text: "text-sp-healthy",
    icon: "text-sp-healthy",
    badge: "bg-sp-healthy/10 text-sp-healthy border-sp-healthy/30",
    bar: "bg-sp-healthy",
    ring: "border-sp-healthy/40",
    glow: "shadow-glow-healthy",
  },
  warning: {
    label: "Warning",
    dot: "bg-sp-warning",
    text: "text-sp-warning",
    icon: "text-sp-warning",
    badge: "bg-sp-warning/10 text-sp-warning border-sp-warning/30",
    bar: "bg-sp-warning",
    ring: "border-sp-warning/40",
    glow: "shadow-glow-warning",
  },
  critical: {
    label: "Critical",
    dot: "bg-sp-critical",
    text: "text-sp-critical",
    icon: "text-sp-critical",
    badge: "bg-sp-critical/10 text-sp-critical border-sp-critical/30",
    bar: "bg-sp-critical",
    ring: "border-sp-critical/40",
    glow: "shadow-glow-critical",
  },
  neutral: {
    label: "Neutral",
    dot: "bg-sp-text-3",
    text: "text-sp-text-3",
    icon: "text-sp-text-3",
    badge: "bg-sp-text-3/10 text-sp-text-3 border-sp-text-3/30",
    bar: "bg-sp-text-3",
    ring: "border-sp-edge",
    glow: "",
  },
  teal: {
    label: "Info",
    dot: "bg-sp-teal",
    text: "text-sp-teal",
    icon: "text-sp-teal",
    badge: "bg-sp-teal/10 text-sp-teal border-sp-teal/30",
    bar: "bg-sp-teal",
    ring: "border-sp-teal/40",
    glow: "",
  },
};

export function severityTone(severity) {
  switch (String(severity ?? "").toUpperCase()) {
    case "NORMAL":
      return TONES.healthy;
    case "EARLY WARNING":
      return TONES.warning;
    case "WARNING":
      return TONES.warning;
    case "CRITICAL":
      return TONES.critical;
    default:
      return TONES.neutral;
  }
}

export function trendTone(trend) {
  switch (String(trend ?? "").toUpperCase()) {
    case "DETERIORATING":
      return TONES.critical;
    case "RECOVERING":
      return TONES.healthy;
    default:
      return TONES.warning;
  }
}

export function riskTone(risk) {
  const value = Number(risk);
  if (Number.isNaN(value)) return TONES.neutral;
  if (value >= 70) return TONES.critical;
  if (value >= 45) return TONES.warning;
  if (value >= 25) return TONES.warning;
  return TONES.healthy;
}

export function booleanTone(value) {
  return value ? TONES.critical : TONES.healthy;
}

// Raw hex values used by SVG/Recharts (theme classes can't style them).
export const TONE_HEX = {
  healthy: "#34d399",
  teal: "#3b82f6",
  warning: "#fbbf24",
  critical: "#f87171",
  neutral: "#64748b",
};

// ------------------------------------------------------------
// Slope helpers
// ------------------------------------------------------------

export function slopeLabel(slope) {
  const value = Number(slope);
  if (Number.isNaN(value)) return "—";
  if (value > 0.0001) return "Rising";
  if (value < -0.0001) return "Falling";
  return "Flat";
}

export function slopeTone(slope) {
  const value = Number(slope);
  if (Number.isNaN(value)) return TONES.neutral;
  if (value > 0.0001) return TONES.critical;
  if (value < -0.0001) return TONES.healthy;
  return TONES.neutral;
}
