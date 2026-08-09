import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import Panel from "../components/ui/Panel";
import StatusBadge from "../components/ui/StatusBadge";
import SeverityBadge from "../components/ui/SeverityBadge";
import LiveBadge from "../components/ui/LiveBadge";
import ChartCard from "../components/telemetry/ChartCard";
import ChartTooltip from "../components/telemetry/ChartTooltip";
import TelemetryTable from "../components/telemetry/TelemetryTable";
import { CHART, axisProps, gridProps } from "../components/telemetry/chartTheme";
import { useApi } from "../hooks/useApi";
import {
  getIntelligenceHistory,
  getLatestIntelligence,
} from "../services/api";
import {
  formatDateTime,
  formatNumber,
  formatTime,
  parseTimestamp,
  TONES,
  trendTone,
} from "../utils/format";

export default function Telemetry() {
  const history = useApi(getIntelligenceHistory, { interval: 10000 });
  const intelligence = useApi(getLatestIntelligence, { interval: 5000 });

  const intel = intelligence.data;
  const rows = history.data?.history ?? [];

  const chartData = rows.map((row) => ({
    time: formatTime(parseTimestamp(row.timestamp)),
    latency: Number(row.response_time_ms) || 0,
    cpu: Number(row.cpu_percent) || 0,
    memory: Number(row.memory_percent) || 0,
  }));

  const peak = chartData.reduce(
    (best, point) =>
      !best || point.latency > best.latency ? point : best,
    null
  );

  const windowStart = rows[0]?.timestamp;
  const windowEnd = rows[rows.length - 1]?.timestamp;

  const chartStates = {
    loading: history.loading,
    error: history.error,
    empty: rows.length === 0,
    onRetry: history.refresh,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Activity className="h-6 w-6" />}
        title="Telemetry"
        subtitle="Historical metrics showing the transition from normal operation to degradation and recovery."
        actions={
          <LiveBadge
            lastUpdated={history.lastUpdated}
            error={history.error || intelligence.error}
          />
        }
      />

      <Panel
        title="Risk & Severity"
        subtitle="Latest engine verdict across the stored window"
      >
        {intelligence.loading && !intel ? (
          <div className="py-2" />
        ) : intelligence.error ? (
          <p className="text-sm text-sp-critical">
            Intelligence unavailable — {intelligence.error}
          </p>
        ) : !intel ? (
          <p className="text-sm text-sp-text-4">
            No intelligence verdict yet.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <SeverityBadge severity={intel.severity} />
            <div>
              <p className="eyebrow">Risk</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-sp-text">
                {formatNumber(intel.risk, 0)}
                <span className="ml-1 text-xs font-normal text-sp-text-3">
                  / 100
                </span>
              </p>
            </div>
            <div>
              <p className="eyebrow">Anomaly</p>
              <div className="mt-1.5">
                <StatusBadge
                  label={intel.anomaly ? "Detected" : "None"}
                  tone={intel.anomaly ? TONES.critical : TONES.healthy}
                />
              </div>
            </div>
            <div>
              <p className="eyebrow">Trend</p>
              <div className="mt-1.5">
                <StatusBadge label={intel.trend} tone={trendTone(intel.trend)} />
              </div>
            </div>
            <div>
              <p className="eyebrow">Samples</p>
              <p className="mt-1 text-sm font-medium tabular-nums text-sp-text-2">
                {history.data?.count ?? rows.length}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="eyebrow">Window</p>
              <p className="mt-1 text-sm tabular-nums text-sp-text-2">
                {formatDateTime(windowStart)} → {formatDateTime(windowEnd)}
              </p>
            </div>
          </div>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Response Time"
          subtitle="Milliseconds per sample — peak latency marked"
          className="lg:col-span-2"
          height={260}
          {...chartStates}
          emptyTitle="No telemetry stored"
          emptyDescription="Samples appear once the collector starts posting metrics."
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...axisProps} minTickGap={56} />
              <YAxis {...axisProps} width={48} domain={[0, "auto"]} />
              <Tooltip
                content={<ChartTooltip unit=" ms" />}
                cursor={{ stroke: CHART.tick, strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                name="Response time"
                stroke={CHART.latency}
                strokeWidth={1.75}
                fill={CHART.latency}
                fillOpacity={0.12}
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
              {peak && (
                <ReferenceDot
                  x={peak.time}
                  y={peak.latency}
                  r={4}
                  fill={CHART.latency}
                  stroke="#020617"
                  strokeWidth={2}
                  label={{
                    value: "Peak",
                    position: "top",
                    fontSize: 10,
                    fill: CHART.tick,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="CPU Usage"
          subtitle="Percent per sample"
          height={260}
          {...chartStates}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...axisProps} minTickGap={56} />
              <YAxis {...axisProps} width={40} domain={[0, 100]} />
              <Tooltip
                content={<ChartTooltip unit="%" />}
                cursor={{ stroke: CHART.tick, strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke={CHART.cpu}
                strokeWidth={1.75}
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Memory Usage"
          subtitle="Percent per sample"
          height={260}
          {...chartStates}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="time" {...axisProps} minTickGap={56} />
              <YAxis {...axisProps} width={40} domain={[0, 100]} />
              <Tooltip
                content={<ChartTooltip unit="%" />}
                cursor={{ stroke: CHART.tick, strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                name="Memory"
                stroke={CHART.memory}
                strokeWidth={1.75}
                dot={false}
                activeDot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Panel
          title="Recent Samples"
          subtitle="Latest telemetry rows recorded by the monitoring API"
          className="lg:col-span-2"
        >
          {history.loading ? (
            <div className="py-8">
              <div className="mx-auto max-w-sm text-center">
                <p className="text-sm text-sp-text-3">Loading samples…</p>
              </div>
            </div>
          ) : history.error ? (
            <div className="py-6">
              <p className="text-sm text-sp-critical">
                Unable to load samples — {history.error}
              </p>
            </div>
          ) : rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-sp-text-4">
              No telemetry stored yet.
            </p>
          ) : (
            <TelemetryTable rows={rows} limit={14} />
          )}
        </Panel>
      </div>
    </div>
  );
}
