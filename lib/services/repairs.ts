import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const RepairsAPI = {
  getAll: async () => (await axios.get(`${API_URL}/api/repairs`)).data,
  get: async (id: string | number) => (await axios.get(`${API_URL}/api/repairs/${id}`)).data,
  create: async (data: any) => (await axios.post(`${API_URL}/api/repairs`, data)).data,
  update: async (id: string | number, data: any) => (await axios.put(`${API_URL}/api/repairs/${id}`, data)).data,
  delete: async (id: string | number) => (await axios.delete(`${API_URL}/api/repairs/${id}`)).data,
};
