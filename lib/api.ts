import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
