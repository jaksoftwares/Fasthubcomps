import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const CustomersAPI = {
  getAll: async () => (await axios.get(`${API_URL}/api/customers`)).data,
  get: async (id: string | number) => (await axios.get(`${API_URL}/api/customers/${id}`)).data,
  create: async (data: any) => (await axios.post(`${API_URL}/api/customers`, data)).data,
  update: async (id: string | number, data: any) => (await axios.patch(`${API_URL}/api/customers/${id}`, data)).data,
  delete: async (id: string | number) => (await axios.delete(`${API_URL}/api/customers/${id}`)).data,
};
