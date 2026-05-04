import { apiFetch } from "@/src/api/client";

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  username: string;
  clearance: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/api/auth/v1/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
