import { api } from "../api";

export const RepairsAPI = {
  getAll: () => api.get("/repairs/"),
  get: (id: string | number) => api.get(`/repairs/${id}`),
  create: (data: any) => api.post("/repairs/", data),
  update: (id: string | number, data: any) => api.put(`/repairs/${id}`, data),
  delete: (id: string | number) => api.delete(`/repairs/${id}`),
};
