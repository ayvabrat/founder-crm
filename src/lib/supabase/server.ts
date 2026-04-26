import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseServerConfig = Boolean(url && serviceRoleKey);

export function getSupabaseServerClient() {
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server env is not configured");
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

