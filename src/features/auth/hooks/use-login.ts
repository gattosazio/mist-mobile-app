import { useMutation } from "@tanstack/react-query";
import { getBackendSession } from "@/src/api/auth.api";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { supabase } from "@/src/lib/supabase";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const authToken = data.session?.access_token;

      if (!authToken) {
        throw new Error("No Supabase access token returned.");
      }

      const session = await getBackendSession(authToken);
      return {
        token: authToken,
        session,
      };
    },
    onSuccess: async (response) => {
      await setSession(response);
    },
  });
}
