import { apiFetch } from "@/src/api/client";

export type LiveKitSessionResponse = {
  sessionId: string;
  roomName: string;
  participantIdentity: string;
  token: string;
};

export type CloseVoiceSessionResponse = {
  sessionId: string;
  roomName?: string;
  status: "closed" | "not_found";
  endedAt?: string | null;
  endReason?: string | null;
};

export function createVoiceSession() {
  return apiFetch<LiveKitSessionResponse>("/api/rtc/v1/session", {
    method: "POST",
    auth: true,
  });
}

export function closeVoiceSession(sessionId: string) {
  return apiFetch<CloseVoiceSessionResponse>(`/api/rtc/v1/session/${sessionId}`, {
    method: "DELETE",
    auth: true,
  });
}
