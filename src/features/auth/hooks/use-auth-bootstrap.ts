import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

export function useAuthBootstrap() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);
}
