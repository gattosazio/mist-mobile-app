const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

if (!backendUrl) {
  console.warn("EXPO_PUBLIC_BACKEND_URL is not set.");
}

export const env = {
  backendUrl: backendUrl ?? "",
};
