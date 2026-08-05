import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

function attachAuth(config: any) {
  const { accessToken, user } = useAuthStore.getState();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (user?.id) {
    config.headers.set("x-user-id", user.id);
  }

  return config;
}

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

authApi.interceptors.request.use(attachAuth);

export const connectionApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CONNECTION_API_URL}/connections`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

connectionApi.interceptors.request.use(attachAuth);

export const queryApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QUERY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
console.log("QUERY API BASE =", queryApi.defaults.baseURL);

queryApi.interceptors.request.use(attachAuth);
