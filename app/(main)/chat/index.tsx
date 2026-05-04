import { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAskPolicyQuestion } from "@/src/features/chat/hooks/use-ask-policy-question";
import { useChatStore } from "@/src/features/chat/store/chat-store";
import { screenStyles } from "@/src/theme/styles";

export default function ChatScreen() {
  const [question, setQuestion] = useState("");
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const thread = useChatStore((state) => state.threads[activeThreadId]);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const setConversationState = useChatStore((state) => state.setConversationState);
  const askMutation = useAskPolicyQuestion();

  const messages = useMemo(() => thread?.messages ?? [], [thread?.messages]);

  const sendQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || askMutation.isPending) {
      return;
    }

    appendMessage(activeThreadId, {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmedQuestion,
    });
    setQuestion("");

    const response = await askMutation.mutateAsync({
      question: trimmedQuestion,
      conversationState: thread?.conversationState ?? null,
    });

    appendMessage(activeThreadId, {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text: response.answer,
    });
    setConversationState(activeThreadId, response.conversationState ?? null);
  };

  return (
    <View style={screenStyles.screen}>
      <View style={screenStyles.sectionHeader}>
        <Text style={screenStyles.title}>Policy chat</Text>
        <Text style={screenStyles.body}>Conversation state is persisted per thread in local app state.</Text>
      </View>

      <FlashList
        contentContainerStyle={screenStyles.listContent}
        data={messages}
        estimatedItemSize={72}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.role === "user" ? screenStyles.userBubble : screenStyles.assistantBubble}>
            <Text style={screenStyles.bubbleRole}>{item.role}</Text>
            <Text style={screenStyles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />

      {askMutation.error ? <Text style={screenStyles.error}>{askMutation.error.message}</Text> : null}

      <View style={screenStyles.composer}>
        <TextInput
          multiline
          onChangeText={setQuestion}
          placeholder="Ask a policy question"
          placeholderTextColor="#64748b"
          style={screenStyles.composerInput}
          value={question}
        />
        <TouchableOpacity onPress={sendQuestion} style={screenStyles.button}>
          <Text style={screenStyles.buttonText}>{askMutation.isPending ? "Sending..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
