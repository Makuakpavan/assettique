import { NextRequest, NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { safeNextPath } from '@/lib/safeNextPath';

/**
 * Where Supabase email links land (sign-up confirmation, password reset).
 * Supports both link styles:
 *   ?code=…                    (default templates, PKCE flow)
 *   ?token_hash=…&type=…       (custom templates using {{ .TokenHash }})
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get('next'));
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (isSupabaseConfigured) {
    const supabase = await createClient();

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, origin));
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(new URL(next, origin));
    }
  }

  const failed = new URL('/login', origin);
  failed.searchParams.set('error', 'link');
  return NextResponse.redirect(failed);
}
