// Shared Recharts theme so every chart stays consistent.
export const CHART = {
  grid: "#1e293b",
  tick: "#64748b",
  axis: "#1e293b",
  latency: "#3b82f6",
  cpu: "#fbbf24",
  memory: "#34d399",
};

export const axisProps = {
  stroke: CHART.tick,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
};

export const gridProps = {
  stroke: CHART.grid,
  strokeDasharray: "3 3",
  vertical: false,
};
