import axios from "axios";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { env } from "@/src/lib/env";

type RequestMeta = {
  auth?: boolean;
  authToken?: string | null;
  networkId?: string | number | null;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    meta?: RequestMeta;
  }

  export interface InternalAxiosRequestConfig {
    meta?: RequestMeta;
  }
}

export const apiClient = axios.create({
  baseURL: env.backendUrl,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const { token, network } = useAuthStore.getState();
  const authRequired = config.meta?.auth ?? true;
  const authToken = config.meta?.authToken ?? token;
  const networkId = config.meta?.networkId ?? network?.id ?? null;

  config.headers = config.headers ?? {};

  if (authRequired) {
    if (!authToken) {
      throw new Error("No auth token found. Please log in first.");
    }

    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (networkId) {
    config.headers["X-Network-Id"] = String(networkId);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.msg ||
      error?.message ||
      "Request failed.";

    return Promise.reject(new Error(String(message)));
  }
);
