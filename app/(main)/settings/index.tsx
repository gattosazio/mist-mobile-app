import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { screenStyles } from "@/src/theme/styles";

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View style={screenStyles.screen}>
      <View style={screenStyles.card}>
        <Text style={screenStyles.title}>Settings</Text>
        <Text style={screenStyles.body}>Session and environment wiring for the first mobile pass.</Text>
        <Text style={screenStyles.meta}>User: {user?.username ?? "Unknown"}</Text>
        <Text style={screenStyles.meta}>Clearance: {user?.clearance ?? "Unknown"}</Text>

        <TouchableOpacity onPress={signOut} style={screenStyles.secondaryButton}>
          <Text style={screenStyles.secondaryButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
