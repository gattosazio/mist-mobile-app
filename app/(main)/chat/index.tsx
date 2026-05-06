import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAskPolicyQuestion } from "@/src/features/chat/hooks/use-ask-policy-question";
import { useChatStore } from "@/src/features/chat/store/chat-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { screenStyles } from "@/src/theme/styles";

const STARTER_PROMPTS = [
  "What is the current WFH policy?",
  "How many annual leave days do I get?",
  "What is the reimbursement process for travel?",
] as const;

const QUICK_TOPICS = [
  "Leave policy",
  "WFH rules",
  "Travel claims",
  "Medical benefits",
] as const;

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState("");
  const listRef = useRef<FlatList>(null);
  const activeThreadId = useChatStore((state) => state.activeThreadId);
  const thread = useChatStore((state) => state.threads[activeThreadId]);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const setConversationState = useChatStore((state) => state.setConversationState);
  const askMutation = useAskPolicyQuestion();

  const messages = thread?.messages ?? [];

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  const sendQuestion = async (draft = question) => {
    const trimmedQuestion = draft.trim();

    if (!trimmedQuestion || askMutation.isPending) {
      return;
    }

    appendMessage(activeThreadId, {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmedQuestion,
    });
    setQuestion("");

    try {
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
    } catch {
      // The mutation error is surfaced below the composer.
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 84 : 20}
      style={screenStyles.chatScreen}
    >
      <View style={screenStyles.chatBackdropTop} />
      <View style={screenStyles.chatBackdropBottom} />

      <View style={screenStyles.screenContent}>
        <View style={screenStyles.chatHeroCard}>
          <Text style={screenStyles.chatHeroEyebrow}>MIST Assistant</Text>
          <Text style={screenStyles.chatHeroTitle}>Policy chat</Text>
          <Text style={screenStyles.chatHeroBody}>
            Ask policy questions in plain language and get clear answers grounded in your company handbook.
          </Text>

          <View style={screenStyles.chatTopicRow}>
            {QUICK_TOPICS.map((topic) => (
              <TouchableOpacity key={topic} onPress={() => setQuestion(topic)} style={screenStyles.chatTopicChip}>
                <Text style={screenStyles.chatTopicChipText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {messages.length === 0 ? (
          <View style={screenStyles.chatEmptyCard}>
            <Text style={screenStyles.chatEmptyTitle}>Start with a policy question</Text>
            <Text style={screenStyles.chatEmptyBody}>
              Use a prompt below or ask your own question about leave, WFH, expenses, approvals, or handbook rules.
            </Text>

            <View style={screenStyles.chatPromptList}>
              {STARTER_PROMPTS.map((prompt) => (
                <TouchableOpacity key={prompt} onPress={() => void sendQuestion(prompt)} style={screenStyles.chatPromptChip}>
                  <Text style={screenStyles.chatPromptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            contentContainerStyle={screenStyles.chatListContent}
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={screenStyles.chatList}
            renderItem={({ item }) => (
              <View style={item.role === "user" ? screenStyles.userBubble : screenStyles.assistantBubble}>
                <Text style={screenStyles.bubbleRole}>{item.role === "user" ? "You" : "MIST"}</Text>
                <Text style={item.role === "user" ? screenStyles.userBubbleText : screenStyles.bubbleText}>
                  {item.text}
                </Text>
              </View>
            )}
          />
        )}

        {askMutation.isPending ? (
          <View style={screenStyles.chatTypingCard}>
            <View style={screenStyles.chatTypingDots}>
              <ActivityIndicator color="#1550ff" size="small" />
            </View>
            <View style={screenStyles.chatTypingTextWrap}>
              <Text style={screenStyles.chatTypingTitle}>MIST is preparing an answer</Text>
              <Text style={screenStyles.chatTypingBody}>Checking the latest configured policy guidance.</Text>
            </View>
          </View>
        ) : null}

        <View style={screenStyles.chatComposerCard}>
          <View style={screenStyles.composer}>
            <Text style={screenStyles.chatComposerLabel}>Ask a policy question</Text>
            <TextInput
              multiline
              onChangeText={setQuestion}
              onFocus={() => {
                requestAnimationFrame(() => {
                  listRef.current?.scrollToEnd({ animated: true });
                });
              }}
              placeholder="For example: What is our WFH policy?"
              placeholderTextColor="#8a8fa8"
              style={screenStyles.composerInput}
              value={question}
            />
            <View style={screenStyles.chatShortcutRow}>
              {STARTER_PROMPTS.slice(0, 2).map((prompt) => (
                <TouchableOpacity key={prompt} onPress={() => setQuestion(prompt)} style={screenStyles.chatShortcutChip}>
                  <Text numberOfLines={1} style={screenStyles.chatShortcutChipText}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={screenStyles.chatComposerFooter}>
              <Text style={screenStyles.chatComposerHint}>Responses are based on your configured company guidance.</Text>
              <Pressable
                disabled={askMutation.isPending}
                onPress={() => void sendQuestion()}
                style={({ pressed }) => [
                  screenStyles.chatSendButton,
                  pressed ? screenStyles.chatSendButtonPressed : null,
                  askMutation.isPending ? screenStyles.chatSendButtonDisabled : null,
                ]}
              >
                <Text style={screenStyles.chatSendButtonText}>{askMutation.isPending ? "Sending..." : "Send"}</Text>
              </Pressable>
            </View>
          </View>

          {askMutation.error ? <Text style={screenStyles.error}>{askMutation.error.message}</Text> : null}
        </View>

        <View style={{ height: Math.max(insets.bottom, 12) }} />
      </View>
    </KeyboardAvoidingView>
  );
}
