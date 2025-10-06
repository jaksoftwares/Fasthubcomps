import { api } from "../api";

export const OrdersAPI = {
  getAll: () => api.get("/orders/"),
  get: (id: string | number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post("/orders/", data),
  update: (id: string | number, data: any) => api.put(`/orders/${id}`, data),
  cancel: (id: string | number) => api.post(`/orders/${id}/cancel`),
};
