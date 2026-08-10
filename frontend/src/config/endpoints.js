// ============================================================
// SystemPulse backend endpoints
// Single source of truth for backend URLs and API paths.
// Components must never reference these paths directly.
// ============================================================

export const BACKENDS = {
  monitoringApi: "https://systempulse-monitoring.onrender.com",
  productService: "https://systempulse.onrender.com",
};

// ------------------------------------------------------------
// API paths
// ------------------------------------------------------------

export const ENDPOINTS = {
  // Monitoring API
  health: `${BACKENDS.monitoringApi}/health`,

  // POST telemetry here
  metrics: `${BACKENDS.monitoringApi}/api/metrics`,

  // Read latest telemetry here
  metricsLatest: `${BACKENDS.monitoringApi}/api/metrics/latest`,

  // Intelligence
  intelligenceLatest: `${BACKENDS.monitoringApi}/api/intelligence/latest`,
  intelligenceHistory: `${BACKENDS.monitoringApi}/api/intelligence/history`,

  // Product Service
  products: `${BACKENDS.productService}/products`,
  simulateSlow: `${BACKENDS.productService}/simulate/slow`,
  simulateNormal: `${BACKENDS.productService}/simulate/normal`,
};