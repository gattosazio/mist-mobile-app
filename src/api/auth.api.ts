import { apiClient } from "@/src/lib/axios";

export type Network = {
  id: number;
  slug: string;
  name: string;
  role?: string | null;
};

export type AuthUser = {
  id: number;
  supabase_user_id: string;
  email: string | null;
  username: string;
  clearanceLevel: string;
};

export type Membership = {
  id: number;
  role: string;
  isDefault: boolean;
  network: Network | null;
};

export type BackendSessionResponse = {
  user: AuthUser;
  network: Network | null;
  memberships: Membership[];
};

export async function getBackendSession(authToken: string, networkId?: number | null) {
  const { data } = await apiClient.get<BackendSessionResponse>("/api/auth/v1/session", {
    meta: {
      auth: true,
      authToken,
      networkId: networkId ?? null,
    },
  });

  return data;
}
