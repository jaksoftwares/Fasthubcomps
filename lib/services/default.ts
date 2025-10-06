import { api } from "../api";

export const DefaultAPI = {
  root: () => api.get("/"),
  health: () => api.get("/health"),
};
