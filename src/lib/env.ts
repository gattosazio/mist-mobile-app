const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL?.trim();
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!backendUrl) {
  console.warn("EXPO_PUBLIC_BACKEND_URL is not set.");
}

if (!supabaseUrl) {
  console.warn("EXPO_PUBLIC_SUPABASE_URL is not set.");
}

if (!supabasePublishableKey) {
  console.warn("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.");
}

export const env = {
  backendUrl: backendUrl ?? "",
  supportEmail: supportEmail ?? "",
  supabaseUrl: supabaseUrl ?? "",
  supabasePublishableKey: supabasePublishableKey ?? "",
};
