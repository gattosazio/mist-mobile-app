import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#09111f" },
        headerTintColor: "#f7fafc",
        tabBarStyle: { backgroundColor: "#09111f" },
        tabBarActiveTintColor: "#f4c95d",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen name="chat/index" options={{ title: "Chat" }} />
      <Tabs.Screen name="voice/index" options={{ title: "Voice" }} />
      <Tabs.Screen name="settings/index" options={{ title: "Settings" }} />
    </Tabs>
  );
}
