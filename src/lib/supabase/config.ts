// Supabase settings (Dashboard → Project Settings → API Keys / Data API).
// NEXT_PUBLIC_ values are safe in the browser; the publishable (anon) key is designed for that.
// Some setups store the key as NEXT_PUBLIC_SUPABASE_ANON_KEY, so accept either name.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

/** False until both env vars are set, so the site still loads before auth is configured. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
