import { api } from "../api";

export const CustomersAPI = {
  getAll: () => api.get("/customers/"),
  get: (id: string | number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post("/customers/", data),
  update: (id: string | number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string | number) => api.delete(`/customers/${id}`),
};
