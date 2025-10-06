import { api } from "../api";

export const AnalyticsAPI = {
  salesTrend: () => api.get("/analytics/sales-trend"),
  categories: () => api.get("/analytics/categories"),
  topProducts: () => api.get("/analytics/top-products"),
  stats: () => api.get("/analytics/stats"),
  customerMetrics: () => api.get("/analytics/customer-metrics"),
  ordersTrend: () => api.get("/analytics/orders-trend"),
};
