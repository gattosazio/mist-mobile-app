import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { env } from "@/src/lib/env";
import { deleteSecureItem, storageKeys } from "@/src/lib/secure-storage";
import { screenStyles } from "@/src/theme/styles";

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const displayName = user?.username ?? "Preview User";
  const clearance = user?.clearance ?? "Workspace";
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "MU";

  const handleReplayOnboarding = async () => {
    await deleteSecureItem(storageKeys.onboardingSeen);
    router.replace("/(auth)/login");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleContactSupport = async () => {
    if (!env.supportEmail) {
      return;
    }

    await Linking.openURL(`mailto:${env.supportEmail}`);
  };

  return (
    <View style={screenStyles.settingsScreen}>
      <View style={screenStyles.settingsBackdropTop} />
      <View style={screenStyles.settingsBackdropBottom} />

      <View style={screenStyles.screenContent}>
        <View style={screenStyles.settingsHeroCard}>
          <View style={screenStyles.settingsProfileRow}>
            <View style={screenStyles.settingsAvatar}>
              <Text style={screenStyles.settingsAvatarText}>{initials}</Text>
            </View>

            <View style={screenStyles.settingsProfileCopy}>
              <Text style={screenStyles.settingsEyebrow}>Account</Text>
              <Text style={screenStyles.settingsTitle}>{displayName}</Text>
              <Text style={screenStyles.settingsBody}>Manage your workspace access, onboarding, and support options.</Text>
            </View>
          </View>

          <View style={screenStyles.settingsMetaRow}>
            <View style={screenStyles.settingsMetaChip}>
              <Text style={screenStyles.settingsMetaLabel}>Clearance</Text>
              <Text style={screenStyles.settingsMetaValue}>{clearance}</Text>
            </View>
            <View style={screenStyles.settingsMetaChip}>
              <Text style={screenStyles.settingsMetaLabel}>Environment</Text>
              <Text style={screenStyles.settingsMetaValue}>{__DEV__ ? "Preview" : "Live"}</Text>
            </View>
          </View>
        </View>

        <View style={screenStyles.settingsSectionCard}>
          <Text style={screenStyles.settingsSectionTitle}>Workspace tools</Text>

          <TouchableOpacity onPress={handleReplayOnboarding} style={screenStyles.settingsActionRow}>
            <View style={screenStyles.settingsActionIcon}>
              <Ionicons color="#1550ff" name="sparkles" size={18} />
            </View>
            <View style={screenStyles.settingsActionCopy}>
              <Text style={screenStyles.settingsActionTitle}>Replay onboarding</Text>
              <Text style={screenStyles.settingsActionBody}>Return to the first-run walkthrough the next time you land on login.</Text>
            </View>
            <Ionicons color="#8a97b2" name="chevron-forward" size={18} />
          </TouchableOpacity>

          {env.supportEmail ? (
            <TouchableOpacity onPress={handleContactSupport} style={screenStyles.settingsActionRow}>
              <View style={screenStyles.settingsActionIcon}>
                <Ionicons color="#1550ff" name="mail" size={18} />
              </View>
              <View style={screenStyles.settingsActionCopy}>
                <Text style={screenStyles.settingsActionTitle}>Contact support</Text>
                <Text style={screenStyles.settingsActionBody}>{env.supportEmail}</Text>
              </View>
              <Ionicons color="#8a97b2" name="chevron-forward" size={18} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={screenStyles.settingsSectionCard}>
          <Text style={screenStyles.settingsSectionTitle}>Session</Text>

          <TouchableOpacity onPress={handleSignOut} style={screenStyles.settingsDangerButton}>
            <Ionicons color="#ffffff" name="log-out-outline" size={18} />
            <Text style={screenStyles.settingsDangerButtonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
