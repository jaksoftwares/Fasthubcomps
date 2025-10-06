import { api } from "../api";

export const SettingsAPI = {
  get: () => api.get("/settings/"),
  update: (data: any) => api.put("/settings/", data),
  create: (data: any) => api.post("/settings/", data),
};
