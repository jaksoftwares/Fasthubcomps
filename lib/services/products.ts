import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const ProductsAPI = {
  getAll: async () => (await axios.get(`${API_URL}/api/products`)).data,
  get: async (id: string | number) => (await axios.get(`${API_URL}/api/products/${id}`)).data,
  getBySlug: async (slug: string) => (await axios.get(`${API_URL}/api/products/slug/${slug}`)).data,
  search: async (query: string) => (await axios.get(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`)).data,
  create: (data: any) => axios.post(`${API_URL}/api/products`, data),
  update: (id: string | number, data: any) => axios.patch(`${API_URL}/api/products/${id}`, data),
  delete: (id: string | number) => axios.delete(`${API_URL}/api/products/${id}`),
  uploadImage: (data: FormData) => axios.post(`${API_URL}/api/products/upload-image`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
