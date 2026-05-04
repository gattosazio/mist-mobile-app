import { Text, TouchableOpacity, View } from "react-native";
import { useVoiceSession } from "@/src/features/voice/hooks/use-voice-session";
import { screenStyles } from "@/src/theme/styles";

export default function VoiceScreen() {
  const {
    activeSession,
    startSession,
    endSession,
    isStarting,
    isEnding,
    error,
  } = useVoiceSession();

  return (
    <View style={screenStyles.screen}>
      <View style={screenStyles.card}>
        <Text style={screenStyles.title}>Voice session</Text>
        <Text style={screenStyles.body}>
          This scaffold creates and tears down LiveKit sessions against the current backend.
        </Text>

        <Text style={screenStyles.meta}>
          {activeSession
            ? `Connected to ${activeSession.roomName} as ${activeSession.participantIdentity}`
            : "No active session"}
        </Text>

        <TouchableOpacity
          disabled={isStarting || Boolean(activeSession)}
          onPress={startSession}
          style={screenStyles.button}
        >
          <Text style={screenStyles.buttonText}>{isStarting ? "Starting..." : "Start voice"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isEnding || !activeSession}
          onPress={endSession}
          style={screenStyles.secondaryButton}
        >
          <Text style={screenStyles.secondaryButtonText}>{isEnding ? "Ending..." : "End voice"}</Text>
        </TouchableOpacity>

        {error ? <Text style={screenStyles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}
