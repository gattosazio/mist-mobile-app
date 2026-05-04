import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storageKeys = {
  authToken: "mist-auth-token",
  authUser: "mist-auth-user",
} as const;

export async function setSecureItem(key: string, value: string) {
  if (Platform.OS === "web") {
    window.localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function getSecureItem(key: string) {
  if (Platform.OS === "web") {
    return window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export async function deleteSecureItem(key: string) {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
