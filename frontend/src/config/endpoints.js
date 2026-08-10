// ============================================================
// SystemPulse backend endpoints
// ============================================================

export const BACKENDS = {
  monitoringApi: "https://systempulse-monitoring.onrender.com",
  productService: "https://systempulse.onrender.com",
};

export const ENDPOINTS = {
  // Monitoring API
  health: `${BACKENDS.monitoringApi}/health`,
  metricsLatest: `${BACKENDS.monitoringApi}/api/metrics/latest`,
  intelligenceLatest: `${BACKENDS.monitoringApi}/api/intelligence/latest`,
  intelligenceHistory: `${BACKENDS.monitoringApi}/api/intelligence/history`,

  // Product Service
  products: `${BACKENDS.productService}/products`,
  simulateSlow: `${BACKENDS.productService}/simulate/slow`,
  simulateNormal: `${BACKENDS.productService}/simulate/normal`,
};