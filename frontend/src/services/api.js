// ============================================================
// SystemPulse API service layer
// All backend communication lives here. Components import the
// named functions below and never repeat backend URLs.
// ============================================================

import { ENDPOINTS } from "../config/endpoints.js";

const DEFAULT_TIMEOUT_MS = 8000;

class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// True when the backend returns a message-only payload
// such as "No metrics received yet".
function isMessageOnly(payload) {
  return (
    payload &&
    typeof payload === "object" &&
    Object.hasOwn(payload, "message") &&
    Object.keys(payload).length === 1
  );
}

async function request(path, options = {}) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout ?? DEFAULT_TIMEOUT_MS
  );

  let response;

  try {
    response = await fetch(path, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body
          ? {
              "Content-Type": "application/json",
            }
          : {}),
      },
      body: options.body
        ? JSON.stringify(options.body)
        : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("Request timed out");
    }

    throw new ApiError(
      "Cannot reach backend. Is the service running?",
      null
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiError(
      `Backend responded with ${response.status}`,
      response.status
    );
  }

  const payload = await response.json();

  // Message-only payloads mean "not available yet",
  // not a transport error.
  if (isMessageOnly(payload)) {
    return {
      data: null,
      message: payload.message,
    };
  }

  return {
    data: payload,
    message: null,
  };
}

// ============================================================
// Monitoring API
// ============================================================

export async function getHealth() {
  return request(ENDPOINTS.health);
}

export async function getLatestMetrics() {
  return request(ENDPOINTS.metricsLatest);
}

export async function getLatestIntelligence() {
  return request(ENDPOINTS.intelligenceLatest);
}

export async function getIntelligenceHistory() {
  return request(ENDPOINTS.intelligenceHistory);
}

// ------------------------------------------------------------
// Send telemetry to the monitoring intelligence engine.
// IMPORTANT: this uses POST /api/metrics, not
// GET /api/metrics/latest.
// ------------------------------------------------------------

export async function sendMetric(metric) {
  return request(ENDPOINTS.metrics, {
    method: "POST",
    body: metric,
  });
}

// ============================================================
// Product Service
// ============================================================

export async function getProducts() {
  return request(ENDPOINTS.products);
}

export async function simulateSlow() {
  return request(ENDPOINTS.simulateSlow, {
    method: "POST",
  });
}

export async function simulateNormal() {
  return request(ENDPOINTS.simulateNormal, {
    method: "POST",
  });
}