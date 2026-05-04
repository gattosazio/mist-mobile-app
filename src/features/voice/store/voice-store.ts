import { create } from "zustand";
import type { LiveKitSessionResponse } from "@/src/api/rtc.api";

type VoiceState = {
  activeSession: LiveKitSessionResponse | null;
  error: string | null;
  setActiveSession: (session: LiveKitSessionResponse | null) => void;
  setError: (message: string | null) => void;
};

export const useVoiceStore = create<VoiceState>((set) => ({
  activeSession: null,
  error: null,
  setActiveSession: (activeSession) => set({ activeSession }),
  setError: (error) => set({ error }),
}));
