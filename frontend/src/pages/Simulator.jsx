import { useEffect, useReducer, useRef, useState } from "react";
import {
  Loader2,
  RotateCcw,
  Zap,
} from "lucide-react";

import SectionHeader from "../components/ui/SectionHeader";
import Panel from "../components/ui/Panel";
import MetricCard from "../components/ui/MetricCard";
import StatusBadge from "../components/ui/StatusBadge";
import SeverityBadge from "../components/ui/SeverityBadge";
import LiveBadge from "../components/ui/LiveBadge";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import DetectionFlow from "../components/flow/DetectionFlow";
import IntelligencePanel from "../components/intelligence/IntelligencePanel";

import { useApi } from "../hooks/useApi";

import {
  getLatestIntelligence,
  getLatestMetrics,
  getProducts,
  sendMetric,
  simulateNormal,
  simulateSlow,
} from "../services/api";

import {
  formatMs,
  formatNumber,
  formatPercent,
  formatTime,
  TONES,
  riskTone,
} from "../utils/format";

import {
  CRITICAL,
  LIFECYCLE,
  RESTORE_ENABLED_STATES,
  WARNING_SEVERITIES,
  circleIndexFor,
  deriveInitialLifecycle,
  isCriticalSignal,
  isDetectionSignal,
  isRecovered,
  lifecycleReducer,
  severityOf,
} from "../utils/simulatorFlow";

import { cn } from "../utils/cn";

export default function Simulator() {
  // ----------------------------------------------------------
  // Explicit simulator lifecycle
  // healthy → injected → detected → critical
  //          → recovering → healthy
  // ----------------------------------------------------------

  const [lifecycle, dispatch] = useReducer(
    lifecycleReducer,
    LIFECYCLE.HEALTHY
  );

  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const [cycleComplete, setCycleComplete] = useState(false);

  const initializedRef = useRef(false);
  const prevLifecycleRef = useRef(lifecycle);

  // Poll frequently while an incident is active.
  const poll =
    pending !== null || lifecycle !== LIFECYCLE.HEALTHY
      ? 3000
      : 5000;

  const intelligence = useApi(getLatestIntelligence, {
    interval: poll,
  });

  const metrics = useApi(getLatestMetrics, {
    interval: poll,
  });

  const products = useApi(getProducts, {
    interval: 10000,
  });

  const intel = intelligence.data;
  const severity = severityOf(intel);

  const busy = pending !== null;

  const canInject =
    lifecycle === LIFECYCLE.HEALTHY && !busy;

  const canRestore =
    RESTORE_ENABLED_STATES.has(lifecycle) && !busy;

  // ----------------------------------------------------------
  // Initialize lifecycle from real backend state
  // ----------------------------------------------------------

  useEffect(() => {
    if (initializedRef.current || !intel) {
      return;
    }

    initializedRef.current = true;

    const initial = deriveInitialLifecycle(intel);

    if (initial === LIFECYCLE.CRITICAL) {
      dispatch({ type: "INIT_CRITICAL" });
    } else if (initial === LIFECYCLE.DETECTED) {
      dispatch({ type: "INIT_DETECTED" });
    }
  }, [intel]);

  // ----------------------------------------------------------
  // Advance lifecycle from REAL backend intelligence
  // ----------------------------------------------------------

  useEffect(() => {
    if (!intel) {
      return;
    }

    if (isRecovered(intel)) {
      dispatch({ type: "RECOVERED" });
    } else if (isCriticalSignal(intel)) {
      dispatch({ type: "CRITICAL" });
    } else if (isDetectionSignal(intel)) {
      dispatch({ type: "DETECTED" });
    }
  }, [intel]);

  // ----------------------------------------------------------
  // Detect completed recovery cycle
  // ----------------------------------------------------------

  useEffect(() => {
    if (
      prevLifecycleRef.current === LIFECYCLE.RECOVERING &&
      lifecycle === LIFECYCLE.HEALTHY
    ) {
      setCycleComplete(true);
    }

    prevLifecycleRef.current = lifecycle;
  }, [lifecycle]);

  // ==========================================================
  // INJECT ANOMALY
  // ==========================================================

  async function handleInject() {
    if (busy || lifecycle !== LIFECYCLE.HEALTHY) {
      return;
    }

    setError(null);
    setCycleComplete(false);
    setPending("inject");

    try {
      // ------------------------------------------------------
      // 1. Enable real slow mode in the product service.
      // ------------------------------------------------------

      await simulateSlow();

      // ------------------------------------------------------
      // 2. Move UI into the injected state.
      // ------------------------------------------------------

      dispatch({
        type: "INJECT_SUCCESS",
      });

      // ------------------------------------------------------
      // 3. Make a REAL product request and measure latency.
      // ------------------------------------------------------

      const startedAt = performance.now();

      await getProducts();

      const responseTimeMs =
        performance.now() - startedAt;

      // ------------------------------------------------------
      // 4. Send the anomaly telemetry to the REAL
      //    monitoring API.
      //
      //    These CPU/memory values represent the controlled
      //    anomaly scenario used by the simulator.
      // ------------------------------------------------------

      await sendMetric({
        service: "product-service",
        response_time_ms: Number(
          responseTimeMs.toFixed(1)
        ),
        cpu_percent: 82,
        memory_percent: 94,
        status_code: 200,
        healthy: false,
      });

      // The UI now waits for the polling cycle to receive
      // the backend intelligence verdict.
    } catch (loadError) {
      setError(
        `Injection failed: ${loadError.message}`
      );
    } finally {
      setPending(null);
    }
  }

  // ==========================================================
  // RESTORE NORMAL
  // ==========================================================

  async function handleRestore() {
    if (
      busy ||
      !RESTORE_ENABLED_STATES.has(lifecycle)
    ) {
      return;
    }

    setError(null);
    setPending("restore");

    try {
      // ------------------------------------------------------
      // 1. Disable the real slow mode.
      // ------------------------------------------------------

      await simulateNormal();

      // ------------------------------------------------------
      // 2. Make a real normal product request and measure it.
      // ------------------------------------------------------

      const startedAt = performance.now();

      await getProducts();

      const responseTimeMs =
        performance.now() - startedAt;

      // ------------------------------------------------------
      // 3. Send healthy telemetry to the monitoring API.
      // ------------------------------------------------------

      await sendMetric({
        service: "product-service",
        response_time_ms: Number(
          responseTimeMs.toFixed(1)
        ),
        cpu_percent: 14,
        memory_percent: 78,
        status_code: 200,
        healthy: true,
      });

      // ------------------------------------------------------
      // 4. Enter recovering state.
      //
      // The lifecycle will only return to HEALTHY after
      // the backend reports NORMAL + anomaly=false.
      // ------------------------------------------------------

      dispatch({
        type: "RESTORE_SUCCESS",
      });
    } catch (loadError) {
      setError(
        `Recovery failed: ${loadError.message}`
      );
    } finally {
      setPending(null);
    }
  }

  // ==========================================================
  // STATUS BANNER
  // ==========================================================

  let status = null;

  if (error) {
    status = {
      tone: TONES.critical,
      text: error,
      spinner: false,
    };
  } else if (pending === "inject") {
    status = {
      tone: TONES.warning,
      text:
        "Injecting slow mode and sending anomaly telemetry…",
      spinner: true,
    };
  } else if (pending === "restore") {
    status = {
      tone: TONES.healthy,
      text:
        "Restoring normal mode and sending recovery telemetry…",
      spinner: true,
    };
  } else {
    switch (lifecycle) {
      case LIFECYCLE.INJECTED:
        status = {
          tone: TONES.warning,
          text:
            "Anomaly injected — monitoring for detection…",
          spinner: true,
        };
        break;

      case LIFECYCLE.DETECTED:
        status = {
          tone: TONES.warning,
          text:
            "Anomaly detected — SystemPulse intelligence engine detected abnormal behaviour.",
          spinner: false,
        };
        break;

      case LIFECYCLE.CRITICAL:
        status = {
          tone: TONES.critical,
          text:
            "Critical condition detected — see the engine analysis below.",
          spinner: false,
        };
        break;

      case LIFECYCLE.RECOVERING:
        status = {
          tone: TONES.healthy,
          text:
            "Recovery in progress — SystemPulse is monitoring the service as it returns to normal.",
          spinner: true,
        };
        break;

      case LIFECYCLE.HEALTHY:
      default: {
        const engineDegraded =
          severity === CRITICAL ||
          WARNING_SEVERITIES.has(severity);

        status = {
          tone: engineDegraded
            ? TONES.warning
            : TONES.healthy,

          text: cycleComplete
            ? "Full lifecycle complete — the system has returned to a healthy state."
            : engineDegraded
            ? `The engine currently reports ${severity} on its own — no active simulation here.`
            : "System healthy — the service is operating normally.",

          spinner: false,
        };

        break;
      }
    }
  }

  // ==========================================================
  // PRODUCT SERVICE MODE
  // ==========================================================

  const serviceMode = (() => {
    switch (lifecycle) {
      case LIFECYCLE.INJECTED:
        return {
          label: "Anomaly injected",
          tone: TONES.warning,
          desc:
            "Injected 2s delay per request is active — awaiting detection.",
        };

      case LIFECYCLE.DETECTED:
        return {
          label: "Degraded · detected",
          tone: TONES.warning,
          desc:
            "The engine has flagged the abnormal behaviour.",
        };

      case LIFECYCLE.CRITICAL:
        return {
          label: "Critical degradation",
          tone: TONES.critical,
          desc:
            "The engine reports a critical verdict.",
        };

      case LIFECYCLE.RECOVERING:
        return {
          label: "Recovering",
          tone: TONES.healthy,
          desc:
            "Normal mode restored — metrics returning to baseline.",
        };

      default:
        return {
          label: "Normal mode",
          tone: TONES.healthy,
          desc:
            "Service is serving requests at normal speed.",
        };
    }
  })();

  // ==========================================================
  // LIVE METRIC TONES
  // ==========================================================

  const metricTone =
    severity === CRITICAL
      ? TONES.critical
      : WARNING_SEVERITIES.has(severity)
      ? TONES.warning
      : TONES.healthy;

  return (
    <div>
      <SectionHeader
        icon={Zap}
        title="Anomaly Simulator"
        subtitle="Inject latency into the product service and watch detection unfold in real time."
        actions={
          <LiveBadge
            lastUpdated={intelligence.lastUpdated}
            error={
              metrics.error ||
              intelligence.error
            }
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Simulation Control"
          subtitle="One action drives the entire demonstration"
          className="lg:col-span-2"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleInject}
              disabled={!canInject}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-5 py-3.5 text-sm font-semibold tracking-wide transition-colors",
                "border-sp-critical/50 bg-sp-critical/15 text-sp-critical",
                "hover:bg-sp-critical/25",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {pending === "inject" ? (
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Zap
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              )}

              INJECT LATENCY ANOMALY
            </button>

            <button
              type="button"
              onClick={handleRestore}
              disabled={!canRestore}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-5 py-3.5 text-sm font-semibold tracking-wide transition-colors",
                "border-sp-healthy/40 bg-sp-healthy/10 text-sp-healthy",
                "hover:bg-sp-healthy/20",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {pending === "restore" ? (
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <RotateCcw
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              )}

              RESTORE NORMAL
            </button>
          </div>

          {status && (
            <div
              className={cn(
                "mt-4 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm leading-relaxed",
                status.tone.badge
              )}
              role="status"
            >
              {status.spinner ? (
                <Loader2
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 animate-spin",
                    status.tone.text
                  )}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-current",
                    status.tone.text
                  )}
                  aria-hidden="true"
                />
              )}

              {status.text}
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-sp-text-4">
            Injection calls{" "}
            <code className="rounded bg-sp-panel-2 px-1.5 py-0.5 text-sp-teal">
              POST /simulate/slow
            </code>{" "}
            on the product service, measures a real product request,
            and sends the resulting telemetry to{" "}
            <code className="rounded bg-sp-panel-2 px-1.5 py-0.5 text-sp-teal">
              POST /api/metrics
            </code>
            . Recovery calls{" "}
            <code className="rounded bg-sp-panel-2 px-1.5 py-0.5 text-sp-teal">
              POST /simulate/normal
            </code>{" "}
            and sends healthy telemetry. Detection and risk are
            computed by the backend.
          </p>
        </Panel>

        <Panel
          title="Product Service"
          subtitle="Target of the simulation"
        >
          {products.loading ? (
            <LoadingState compact />
          ) : products.error ? (
            <ErrorState
              message={products.error}
              onRetry={products.refresh}
              compact
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge
                  label={
                    products.data?.status ?? "unknown"
                  }
                  tone={TONES.healthy}
                />

                <div className="text-right">
                  <p className="eyebrow">
                    Products
                  </p>

                  <p className="mt-1 text-sm font-medium text-sp-text-2">
                    {products.data?.products?.length ??
                      "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-sp-edge bg-sp-panel-2 p-3">
                <p className="eyebrow">
                  Current mode
                </p>

                <div className="mt-2">
                  <StatusBadge
                    label={serviceMode.label}
                    tone={serviceMode.tone}
                  />
                </div>

                <p className="mt-2 text-xs leading-relaxed text-sp-text-3">
                  {serviceMode.desc}
                </p>
              </div>
            </div>
          )}
        </Panel>
      </div>

      <DetectionFlow
        activeIndex={circleIndexFor(lifecycle)}
        label="Demonstration flow"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Live Intelligence"
          subtitle="Actual engine result, refreshed in real time"
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
              title="No intelligence yet"
              description="The engine will publish a verdict once telemetry arrives."
            />
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SeverityBadge
                  severity={intel.severity}
                />

                <span className="text-xs text-sp-text-4">
                  Updated{" "}
                  {formatTime(intel.timestamp)}
                </span>
              </div>

              <IntelligencePanel
                intelligence={intel}
                detailed
              />
            </div>
          )}
        </Panel>

        <Panel
          title="Live Metrics"
          subtitle="Current telemetry"
        >
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Response time"
              value={formatMs(
                metrics.data?.response_time_ms,
                0
              )}
              unit="ms"
              tone={metricTone}
            />

            <MetricCard
              label="CPU"
              value={formatPercent(
                metrics.data?.cpu_percent,
                0
              )}
              tone={metricTone}
            />

            <MetricCard
              label="Memory"
              value={formatPercent(
                metrics.data?.memory_percent,
                0
              )}
              tone={metricTone}
            />

            <MetricCard
              label="Risk"
              value={
                intel
                  ? formatNumber(intel.risk, 0)
                  : "—"
              }
              unit="/ 100"
              tone={
                intel
                  ? riskTone(intel.risk)
                  : TONES.neutral
              }
            />
          </div>

          {metrics.error && (
            <p className="mt-3 text-xs text-sp-critical">
              Latest metrics unavailable —{" "}
              {metrics.error}
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}