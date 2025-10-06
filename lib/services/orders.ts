import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const OrdersAPI = {
  getAll: async () => (await axios.get(`${API_URL}/api/orders`)).data,
  getMyOrders: async (customerId: string) => (await axios.get(`${API_URL}/api/orders?customer_id=${customerId}`)).data,
  get: async (id: string | number) => (await axios.get(`${API_URL}/api/orders/${id}`)).data,
  create: async (data: any) => (await axios.post(`${API_URL}/api/orders`, data)).data,
  update: async (id: string | number, data: any) => (await axios.patch(`${API_URL}/api/orders/${id}`, data)).data,
  cancel: async (id: string | number) => (await axios.post(`${API_URL}/api/orders/${id}/cancel`)).data,
};
