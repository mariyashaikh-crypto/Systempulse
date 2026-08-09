import { Gauge } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import Panel from "../components/ui/Panel";
import MetricCard from "../components/ui/MetricCard";
import SeverityBadge from "../components/ui/SeverityBadge";
import StatusBadge from "../components/ui/StatusBadge";
import RiskScore from "../components/ui/RiskScore";
import LiveBadge from "../components/ui/LiveBadge";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import DetectionFlow from "../components/flow/DetectionFlow";
import IntelligencePanel from "../components/intelligence/IntelligencePanel";
import TelemetryTable from "../components/telemetry/TelemetryTable";
import { useApi } from "../hooks/useApi";
import {
  getIntelligenceHistory,
  getLatestIntelligence,
  getLatestMetrics,
} from "../services/api";
import {
  formatMs,
  formatNumber,
  formatPercent,
  TONES,
  trendTone,
} from "../utils/format";
import { deriveSystemState, flowStageIndex } from "../utils/intelligence";
import { cn } from "../utils/cn";

export default function CommandCenter() {
  const intelligence = useApi(getLatestIntelligence, { interval: 4000 });
  const metrics = useApi(getLatestMetrics, { interval: 4000 });
  const history = useApi(getIntelligenceHistory, { interval: 15000 });

  const historyRows = history.data?.history ?? [];
  const state = deriveSystemState(intelligence.data);
  const intel = intelligence.data;

  const spark = {
    latency: historyRows.map((row) => row.response_time_ms).slice(-28),
    cpu: historyRows.map((row) => row.cpu_percent).slice(-28),
    memory: historyRows.map((row) => row.memory_percent).slice(-28),
  };

  const liveError = metrics.error || intelligence.error;
  const feedLive = !liveError && Boolean(metrics.data || intelligence.data);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Gauge className="h-6 w-6" />}
        title="Command Center"
        subtitle="System status, live metrics and the latest intelligence signal."
        actions={
          <LiveBadge
            lastUpdated={intelligence.lastUpdated}
            error={liveError}
          />
        }
      />

      {/* PRIMARY */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="System Status"
          subtitle="Live verdict from the intelligence engine"
          className="lg:col-span-2"
        >
          {intelligence.loading ? (
            <LoadingState compact />
          ) : intelligence.error ? (
            <ErrorState
              message={intelligence.error}
              onRetry={intelligence.refresh}
              compact
            />
          ) : !intel ? (
            <EmptyState
              compact
              title="No signal yet"
              description="The engine will publish a verdict once telemetry arrives."
            />
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={intel.severity} />
                  <StatusBadge
                    label={intel.anomaly ? "Anomaly detected" : "No anomaly"}
                    tone={intel.anomaly ? TONES.critical : TONES.healthy}
                  />
                  <StatusBadge
                    label={intel.trend}
                    tone={trendTone(intel.trend)}
                  />
                </div>

                <div>
                  <p
                    className={cn(
                      "text-3xl font-semibold tracking-tight sm:text-4xl",
                      state.tone.text
                    )}
                  >
                    {state.label}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-sp-text-3">
                    {state.description}
                  </p>
                </div>

                <div className="grid max-w-md grid-cols-3 gap-3">
                  <MetricCard
                    label="Response time"
                    value={formatMs(intel.response_time_ms, 0)}
                    tone={state.tone}
                  />
                  <MetricCard
                    label="CPU"
                    value={formatPercent(intel.cpu_percent, 0)}
                    tone={state.tone}
                  />
                  <MetricCard
                    label="Memory"
                    value={formatPercent(intel.memory_percent, 0)}
                    tone={state.tone}
                  />
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <RiskScore
                  value={intel.risk}
                  tone={state.tone}
                  size={150}
                  label="Risk Score"
                />
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Intelligence"
          subtitle="Root cause and recommended action"
        >
          {intelligence.loading ? (
            <LoadingState compact />
          ) : intelligence.error ? (
            <ErrorState
              message={intelligence.error}
              onRetry={intelligence.refresh}
              compact
            />
          ) : !intel ? (
            <EmptyState
              compact
              title="No analysis yet"
              description="An analysis appears here as soon as telemetry flows."
            />
          ) : (
            <IntelligencePanel intelligence={intel} />
          )}
        </Panel>
      </div>

      <DetectionFlow
        activeIndex={flowStageIndex(intel)}
        label="Detection pipeline"
      />

      {/* SECONDARY */}
      <Panel
        title="Live Metrics"
        subtitle="Current values with a rolling view of recent samples"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Response time"
            value={formatMs(metrics.data?.response_time_ms, 0)}
            unit="ms"
            tone={state.tone}
            spark={spark.latency}
            sparkLabel={`${spark.latency.length} recent samples`}
          />
          <MetricCard
            label="CPU usage"
            value={formatPercent(metrics.data?.cpu_percent, 0)}
            tone={state.tone}
            spark={spark.cpu}
            sparkLabel={`${spark.cpu.length} recent samples`}
          />
          <MetricCard
            label="Memory usage"
            value={formatPercent(metrics.data?.memory_percent, 0)}
            tone={state.tone}
            spark={spark.memory}
            sparkLabel={`${spark.memory.length} recent samples`}
          />
          <MetricCard
            label="Risk score"
            value={intel ? formatNumber(intel.risk, 0) : "—"}
            unit="/ 100"
            tone={state.tone}
            sub={intel ? `${intel.severity} severity` : "Waiting for signal"}
          />
        </div>
        {liveError && (
          <p className="mt-3 text-xs text-sp-critical">
            Latest metrics unavailable — {liveError}
          </p>
        )}
        {!feedLive && !liveError && !metrics.loading && (
          <p className="mt-3 text-xs text-sp-text-4">
            Awaiting the first telemetry sample from the collector.
          </p>
        )}
      </Panel>

      {/* ACTIVITY */}
      <Panel
        title="Recent Activity"
        subtitle="Latest telemetry samples recorded by the monitoring API"
      >
        {history.loading ? (
          <LoadingState compact />
        ) : history.error ? (
          <ErrorState message={history.error} onRetry={history.refresh} compact />
        ) : historyRows.length === 0 ? (
          <EmptyState
            compact
            title="No telemetry stored"
            description="Samples appear here once the collector posts metrics."
          />
        ) : (
          <TelemetryTable rows={historyRows} />
        )}
      </Panel>
    </div>
  );
}
