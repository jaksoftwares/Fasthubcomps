import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

// Simple in-memory cache for products to avoid repeated network
// requests across home sections and the products page.
let productsCache: { data: any[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

export const ProductsAPI = {
  getAll: async () => {
    const now = Date.now();
    if (productsCache.data && now - productsCache.timestamp < CACHE_TTL_MS) {
      return productsCache.data;
    }
    const res = await axios.get(`${API_URL}/api/products`);
    const data = Array.isArray(res.data) ? res.data : [];
    productsCache = { data, timestamp: now };
    return data;
  },
  get: async (id: string | number) => (await axios.get(`${API_URL}/api/products/${id}`)).data,
  getBySlug: async (slug: string) => (await axios.get(`${API_URL}/api/products/slug/${slug}`)).data,
  search: async (query: string) => (await axios.get(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`)).data,
  create: (data: any) => axios.post(`${API_URL}/api/products`, data),
  update: (id: string | number, data: any) => axios.patch(`${API_URL}/api/products/${id}`, data),
  delete: (id: string | number) => axios.delete(`${API_URL}/api/products/${id}`),
  uploadImage: (data: FormData) => axios.post(`${API_URL}/api/products/upload-image`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
