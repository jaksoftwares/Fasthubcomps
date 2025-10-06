import { api } from "../api";

export const ProductsAPI = {
  getAll: () => api.get("/products/"),
  get: (id: string | number) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  search: (query: string) => api.get(`/products/search?query=${encodeURIComponent(query)}`),
  create: (data: any) => api.post("/products/", data),
  update: (id: string | number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string | number) => api.delete(`/products/${id}`),
};
