import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://aqjfleanijwtfdfjimwz.supabase.co";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_wGEBtOFLO0It_-_dZ5XfbQ_kEVUJNpl";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? (Platform.OS === "web" ? window.localStorage : AsyncStorage) : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});

export function toAuthUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown>; last_sign_in_at?: string | null }) {
  const name = typeof user.user_metadata?.name === "string" ? user.user_metadata.name : user.email?.split("@")[0] ?? null;
  return {
    id: user.id,
    openId: user.id,
    name,
    email: user.email ?? null,
    loginMethod: "supabase-email",
    lastSignedIn: new Date(user.last_sign_in_at ?? Date.now()),
  } as const;
}
