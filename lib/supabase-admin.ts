import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function extractProjectRefFromDbUrl(url?: string) {
  if (!url) return null;

  const fromPooler = /postgres\.([a-z0-9]+):/i.exec(url)?.[1];
  if (fromPooler) return fromPooler;

  const fromDirect = /db\.([a-z0-9]+)\.supabase\.co/i.exec(url)?.[1];
  if (fromDirect) return fromDirect;

  return null;
}

function getSupabaseUrl() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) return process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;

  const ref =
    extractProjectRefFromDbUrl(process.env.DIRECT_URL) ??
    extractProjectRefFromDbUrl(process.env.DATABASE_URL);
  if (!ref) return null;

  return `https://${ref}.supabase.co`;
}

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = getSupabaseUrl();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
