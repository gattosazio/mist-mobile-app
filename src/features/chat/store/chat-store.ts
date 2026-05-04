import { create } from "zustand";
import type { ConversationState } from "@/src/api/rag.api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
  conversationState: ConversationState | null;
};

type ChatState = {
  activeThreadId: string;
  threads: Record<string, ChatThread>;
  appendMessage: (threadId: string, message: ChatMessage) => void;
  setConversationState: (threadId: string, state: ConversationState | null) => void;
};

const defaultThreadId = "default";

export const useChatStore = create<ChatState>((set) => ({
  activeThreadId: defaultThreadId,
  threads: {
    [defaultThreadId]: {
      id: defaultThreadId,
      title: "General",
      messages: [],
      conversationState: null,
    },
  },
  appendMessage: (threadId, message) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: {
          ...state.threads[threadId],
          messages: [...state.threads[threadId].messages, message],
        },
      },
    })),
  setConversationState: (threadId, conversationState) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: {
          ...state.threads[threadId],
          conversationState,
        },
      },
    })),
}));
