import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const SettingsAPI = {
  get: async () => (await axios.get(`${API_URL}/api/settings`)).data,
  update: async (data: any) => (await axios.put(`${API_URL}/api/settings`, data)).data,
  create: async (data: any) => (await axios.post(`${API_URL}/api/settings`, data)).data,
};
