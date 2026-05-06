import { create } from "zustand";
import type { AuthUser, BackendSessionResponse, Membership, Network } from "@/src/api/auth.api";
import { deleteSecureItem, getSecureItem, setSecureItem, storageKeys } from "@/src/lib/secure-storage";

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  network: Network | null;
  memberships: Membership[];
  bootstrap: () => Promise<void>;
  setSession: (payload: { token: string; session: BackendSessionResponse }) => Promise<void>;
  setActiveNetwork: (network: Network | null) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  token: null,
  user: null,
  network: null,
  memberships: [],
  bootstrap: async () => {
    if (get().hydrated) {
      return;
    }

    const [token, rawUser, rawNetwork, rawMemberships] = await Promise.all([
      getSecureItem(storageKeys.authToken),
      getSecureItem(storageKeys.authUser),
      getSecureItem(storageKeys.authNetwork),
      getSecureItem(storageKeys.authMemberships),
    ]);

    let user: AuthUser | null = null;
    let network: Network | null = null;
    let memberships: Membership[] = [];

    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser;
      } catch {
        user = null;
      }
    }

    if (rawNetwork) {
      try {
        network = JSON.parse(rawNetwork) as Network;
      } catch {
        network = null;
      }
    }

    if (rawMemberships) {
      try {
        memberships = JSON.parse(rawMemberships) as Membership[];
      } catch {
        memberships = [];
      }
    }

    set({
      hydrated: true,
      token,
      user,
      network,
      memberships,
    });
  },
  setSession: async ({ token, session }) => {
    const { user, network, memberships } = session;

    await Promise.all([
      setSecureItem(storageKeys.authToken, token),
      setSecureItem(storageKeys.authUser, JSON.stringify(user)),
      setSecureItem(storageKeys.authNetwork, JSON.stringify(network)),
      setSecureItem(storageKeys.authMemberships, JSON.stringify(memberships)),
    ]);

    set({
      token,
      user,
      network,
      memberships,
      hydrated: true,
    });
  },
  setActiveNetwork: async (network) => {
    if (network) {
      await setSecureItem(storageKeys.authNetwork, JSON.stringify(network));
    } else {
      await deleteSecureItem(storageKeys.authNetwork);
    }

    set({ network });
  },
  signOut: async () => {
    await Promise.all([
      deleteSecureItem(storageKeys.authToken),
      deleteSecureItem(storageKeys.authUser),
      deleteSecureItem(storageKeys.authNetwork),
      deleteSecureItem(storageKeys.authMemberships),
    ]);

    set({
      token: null,
      user: null,
      network: null,
      memberships: [],
      hydrated: true,
    });
  },
}));
