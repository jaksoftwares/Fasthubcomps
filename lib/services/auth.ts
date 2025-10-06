import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const AuthAPI = {
  register: async (data: { name: string; email: string; password: string; isAdmin?: boolean }) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, data); // call your backend
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, data);
    return res.data; // should return token & profile
  },

  getProfile: async (token: string) => {
    const res = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  logout: async (token: string) => {
    return axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};
