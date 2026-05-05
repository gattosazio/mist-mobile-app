import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { screenStyles } from "@/src/theme/styles";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.username ?? "Preview User";
  const clearance = user?.clearance ?? "Workspace";
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "MU";

  return (
    <Tabs
      screenOptions={{
        headerStyle: screenStyles.header,
        headerTitleStyle: screenStyles.headerTitle,
        headerShadowVisible: false,
        headerTintColor: "#3d4ae0",
        sceneStyle: { backgroundColor: "#f6f8ff" },
        tabBarStyle: screenStyles.tabBar,
        tabBarActiveTintColor: "#3d4ae0",
        tabBarInactiveTintColor: "#777b93",
      }}
    >
      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="chatbubble-ellipses" size={size} />,
          headerTitle: () => (
            <View style={screenStyles.appHeaderTitleWrap}>
              <Text style={screenStyles.appHeaderEyebrow}>MIST Workspace</Text>
              <Text style={screenStyles.appHeaderTitle}>Policy Chat</Text>
            </View>
          ),
          headerRight: () => (
            <View style={screenStyles.appHeaderProfile}>
              <View style={screenStyles.appHeaderProfileTextWrap}>
                <Text numberOfLines={1} style={screenStyles.appHeaderProfileName}>
                  {displayName}
                </Text>
                <Text numberOfLines={1} style={screenStyles.appHeaderProfileMeta}>
                  {clearance}
                </Text>
              </View>
              <View style={screenStyles.appHeaderAvatar}>
                <Text style={screenStyles.appHeaderAvatarText}>{initials}</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="voice/index"
        options={{
          title: "Voice",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="mic" size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="settings" size={size} />,
        }}
      />
    </Tabs>
  );
}
