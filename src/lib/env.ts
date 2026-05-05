const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL?.trim();

if (!backendUrl) {
  console.warn("EXPO_PUBLIC_BACKEND_URL is not set.");
}

export const env = {
  backendUrl: backendUrl ?? "",
  supportEmail: supportEmail ?? "",
};
