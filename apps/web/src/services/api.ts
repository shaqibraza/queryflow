import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

authApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  console.log("FULL STORE", useAuthStore.getState());

  console.log("Interceptor token:", token);

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});
