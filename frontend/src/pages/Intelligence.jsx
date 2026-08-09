import { BrainCircuit } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import Panel from "../components/ui/Panel";
import MetricCard from "../components/ui/MetricCard";
import SeverityBadge from "../components/ui/SeverityBadge";
import StatusBadge from "../components/ui/StatusBadge";
import RiskScore from "../components/ui/RiskScore";
import HealthIndicator from "../components/ui/HealthIndicator";
import LiveBadge from "../components/ui/LiveBadge";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import IntelligencePanel from "../components/intelligence/IntelligencePanel";
import { useApi } from "../hooks/useApi";
import { getLatestIntelligence } from "../services/api";
import {
  formatMs,
  formatPercent,
  TONES,
  trendTone,
} from "../utils/format";
import { deriveSystemState } from "../utils/intelligence";
import { cn } from "../utils/cn";

export default function Intelligence() {
  const intelligence = useApi(getLatestIntelligence, { interval: 4000 });
  const intel = intelligence.data;
  const state = deriveSystemState(intel);
  const pulse =
    state.key === "critical" || state.key === "degraded";

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<BrainCircuit className="h-6 w-6" />}
        title="Intelligence"
        subtitle="The reasoning behind every SystemPulse verdict."
        actions={
          <LiveBadge
            lastUpdated={intelligence.lastUpdated}
            error={intelligence.error}
          />
        }
      />

      <Panel
        title="System Intelligence"
        subtitle="Live verdict from the engine"
        tone={state.tone}
        className={cn(state.key !== "no-signal" && state.tone.glow)}
      >
        {intelligence.loading ? (
          <LoadingState />
        ) : intelligence.error ? (
          <ErrorState
            message={intelligence.error}
            onRetry={intelligence.refresh}
          />
        ) : !intel ? (
          <EmptyState
            title="No analysis yet"
            description="The engine publishes its first verdict once telemetry arrives."
          />
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <HealthIndicator tone={state.tone} pulse={pulse} size="lg" />
                <h2
                  className={cn(
                    "text-2xl font-semibold tracking-tight sm:text-3xl",
                    state.tone.text
                  )}
                >
                  {state.label}
                </h2>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-sp-text-3">
                {state.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
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

              <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
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
                size={170}
                label="Risk Score"
              />
            </div>
          </div>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Reasoning"
          subtitle="Trend, anomaly, root cause and recommended action"
          className="lg:col-span-2"
        >
          {intelligence.loading && !intel ? (
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
              description="Reasoning appears once the engine processes telemetry."
            />
          ) : (
            <IntelligencePanel intelligence={intel} />
          )}
        </Panel>

        <Panel title="Metric Slopes" subtitle="Change per telemetry sample">
          {intelligence.loading && !intel ? (
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
              title="No slopes yet"
              description="Slopes are calculated from consecutive samples."
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-1">
              {[
                ["latency_slope", "Latency slope", " ms/sample"],
                ["cpu_slope", "CPU slope", " %/sample"],
                ["memory_slope", "Memory slope", " %/sample"],
              ].map(([key, label, unit]) => (
                <div
                  key={key}
                  className="rounded-lg border border-sp-edge bg-sp-panel-2 p-4"
                >
                  <p className="eyebrow">{label}</p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-sp-text">
                    {intel[key] > 0 ? "+" : ""}
                    {Number(intel[key]).toFixed(2)}
                    <span className="ml-1 text-xs font-normal text-sp-text-3">
                      {unit}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-sp-text-4">
                    {intel[key] > 0
                      ? "Rising — pressure building"
                      : intel[key] < 0
                        ? "Falling — recovering"
                        : "Flat — stable"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
