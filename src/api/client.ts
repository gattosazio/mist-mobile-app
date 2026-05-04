import { env } from "@/src/lib/env";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error("No auth token found. Please log in first.");
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.backendUrl}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : "Request failed.";

    throw new Error(message);
  }

  return data as T;
}
