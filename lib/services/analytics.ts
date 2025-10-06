import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const AnalyticsAPI = {
  salesTrend: async () => (await axios.get(`${API_URL}/api/analytics/sales-trend`)).data,
  categories: async () => (await axios.get(`${API_URL}/api/analytics/categories`)).data,
  topProducts: async () => (await axios.get(`${API_URL}/api/analytics/top-products`)).data,
  stats: async () => (await axios.get(`${API_URL}/api/analytics/stats`)).data,
  customerMetrics: async () => (await axios.get(`${API_URL}/api/analytics/customer-metrics`)).data,
  ordersTrend: async () => (await axios.get(`${API_URL}/api/analytics/orders-trend`)).data,
};
