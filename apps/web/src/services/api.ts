import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/auth.store";

function attachAuth(config: InternalAxiosRequestConfig) {
  const { accessToken, user } = useAuthStore.getState();

  console.log("====== AUTH REQUEST ======");
  console.log("URL:", config.url);
  console.log("Access Token:", accessToken);
  console.log("User:", user);

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (user?.id) {
    config.headers.set("x-user-id", user.id);
  }

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
}

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

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

console.log("QUERY API BASE =", queryApi.defaults.baseURL);

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/refresh")
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("Refresh response did not contain an access token");
        }

        useAuthStore.getState().setAccessToken(accessToken);

        return accessToken;
      })
      .catch((error) => {
        console.error("Access token refresh failed:", error);

        useAuthStore.getState().logout();

        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function addResponseInterceptor(api: typeof authApi) {
  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

      if (error.response?.status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

      return api(originalRequest);
    }
  );
}

addResponseInterceptor(authApi);
addResponseInterceptor(connectionApi);
addResponseInterceptor(queryApi);
