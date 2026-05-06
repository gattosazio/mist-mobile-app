import { createClient } from "@supabase/supabase-js";
import { env } from "@/src/lib/env";

export const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
