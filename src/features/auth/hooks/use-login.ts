import { useMutation } from "@tanstack/react-query";
import { login, type LoginPayload } from "@/src/api/auth.api";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (response) => {
      await setSession(response);
    },
  });
}
