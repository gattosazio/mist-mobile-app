import { apiClient } from "@/src/lib/axios";

export type ConversationState = {
  lastPolicyQuestion: string;
  pendingClarification: {
    type: "department" | "policy_type";
    options: string[];
  } | null;
  lastResolvedPolicyType?: string | null;
  lastResolvedDepartment?: string | null;
};

export type AskPolicyRequest = {
  question: string;
  policy_type?: string | null;
  department?: string | null;
  conversationState?: ConversationState | null;
};

export type AskPolicyResponse = {
  mode?: "policy_redirect" | "policy_specific";
  answer: string;
  confidence?: "low" | "medium" | "high";
  escalationNeeded?: boolean;
  needsClarification?: boolean;
  clarificationType?: "department" | "policy_type" | string | null;
  clarificationOptions?: string[];
  citations?: Array<{
    title?: string;
    documentTitle?: string;
    sectionTitle?: string;
    sourceUrl?: string;
    policyType?: string | null;
    department?: string | null;
  }>;
  retrievedChunks?: unknown[];
  retrievalMethod?: string;
  resolvedPolicyType?: string | null;
  resolvedDepartment?: string | null;
  conversationState?: ConversationState | null;
  error?: string;
};

export async function askPolicyQuestion(payload: AskPolicyRequest) {
  const { data } = await apiClient.post<AskPolicyResponse>("/api/rag/v1/ask", payload, {
    meta: {
      auth: true,
    },
  });

  return data;
}
