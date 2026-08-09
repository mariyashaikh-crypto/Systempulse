// ============================================================
// SystemPulse backend endpoints
// Single source of truth for backend URLs and API paths.
// Components must never reference these paths directly.
// ============================================================

export const BACKENDS = {
  monitoringApi: "http://127.0.0.1:8003",
  productService: "http://127.0.0.1:8002",
};

// In dev, requests go through the Vite proxy (/monitoring, /product)
// so the browsers never hit CORS. Vite forwards to the URLs above.
export const PROXY_PREFIX = {
  monitoring: "/monitoring",
  product: "/product",
};

export const ENDPOINTS = {
  // Monitoring API
  health: `${PROXY_PREFIX.monitoring}/health`,
  metricsLatest: `${PROXY_PREFIX.monitoring}/api/metrics/latest`,
  intelligenceLatest: `${PROXY_PREFIX.monitoring}/api/intelligence/latest`,
  intelligenceHistory: `${PROXY_PREFIX.monitoring}/api/intelligence/history`,

  // Product Service
  products: `${PROXY_PREFIX.product}/products`,
  simulateSlow: `${PROXY_PREFIX.product}/simulate/slow`,
  simulateNormal: `${PROXY_PREFIX.product}/simulate/normal`,
};
