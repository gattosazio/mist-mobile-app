import { useMutation } from "@tanstack/react-query";
import { askPolicyQuestion, type AskPolicyRequest } from "@/src/api/rag.api";

export function useAskPolicyQuestion() {
  return useMutation({
    mutationFn: (payload: AskPolicyRequest) => askPolicyQuestion(payload),
  });
}
