import { api } from "../api";

export const PaymentsAPI = {
  getAll: () => api.get("/payments/"),
  get: (id: string | number) => api.get(`/payments/${id}`),
  getByOrder: (orderId: string | number) => api.get(`/payments/order/${orderId}`),
  create: (data: any) => api.post("/payments/", data),
  update: (id: string | number, data: any) => api.put(`/payments/${id}`, data),
  mpesaStkPush: (data: any) => api.post("/payments/mpesa/stk-push", data),
  mpesaCallback: (data: any) => api.post("/payments/mpesa/callback", data),
};
