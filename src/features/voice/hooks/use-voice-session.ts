import { useMutation } from "@tanstack/react-query";
import { closeVoiceSession, createVoiceSession } from "@/src/api/rtc.api";
import { useVoiceStore } from "@/src/features/voice/store/voice-store";

export function useVoiceSession() {
  const activeSession = useVoiceStore((state) => state.activeSession);
  const error = useVoiceStore((state) => state.error);
  const setActiveSession = useVoiceStore((state) => state.setActiveSession);
  const setError = useVoiceStore((state) => state.setError);

  const startMutation = useMutation({
    mutationFn: createVoiceSession,
    onSuccess: (session) => {
      setError(null);
      setActiveSession(session);
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const endMutation = useMutation({
    mutationFn: async () => {
      if (!activeSession) {
        throw new Error("No active session.");
      }

      return closeVoiceSession(activeSession.sessionId);
    },
    onSuccess: () => {
      setError(null);
      setActiveSession(null);
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  return {
    activeSession,
    error,
    isStarting: startMutation.isPending,
    isEnding: endMutation.isPending,
    startSession: async () => startMutation.mutateAsync(),
    endSession: async () => endMutation.mutateAsync(),
  };
}
