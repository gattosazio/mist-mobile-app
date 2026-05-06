import { apiClient } from "@/src/lib/axios";

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

export async function createVoiceSession() {
  const { data } = await apiClient.post<LiveKitSessionResponse>(
    "/api/rtc/v1/session",
    {},
    {
      meta: {
        auth: true,
      },
    }
  );

  return data;
}

export async function closeVoiceSession(sessionId: string) {
  const { data } = await apiClient.delete<CloseVoiceSessionResponse>(`/api/rtc/v1/session/${sessionId}`, {
    meta: {
      auth: true,
    },
  });

  return data;
}
