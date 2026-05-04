import { create } from "zustand";
import type { AuthUser, LoginResponse } from "@/src/api/auth.api";
import { deleteSecureItem, getSecureItem, setSecureItem, storageKeys } from "@/src/lib/secure-storage";

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  bootstrap: () => Promise<void>;
  setSession: (payload: LoginResponse) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  token: null,
  user: null,
  bootstrap: async () => {
    if (get().hydrated) {
      return;
    }

    const [token, rawUser] = await Promise.all([
      getSecureItem(storageKeys.authToken),
      getSecureItem(storageKeys.authUser),
    ]);

    let user: AuthUser | null = null;

    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser;
      } catch {
        user = null;
      }
    }

    set({
      hydrated: true,
      token,
      user,
    });
  },
  setSession: async (payload) => {
    await Promise.all([
      setSecureItem(storageKeys.authToken, payload.token),
      setSecureItem(storageKeys.authUser, JSON.stringify(payload.user)),
    ]);

    set({
      token: payload.token,
      user: payload.user,
      hydrated: true,
    });
  },
  signOut: async () => {
    await Promise.all([
      deleteSecureItem(storageKeys.authToken),
      deleteSecureItem(storageKeys.authUser),
    ]);

    set({
      token: null,
      user: null,
      hydrated: true,
    });
  },
}));
