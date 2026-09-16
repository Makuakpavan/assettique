import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';
import { safeNextPath } from '@/lib/safeNextPath';

// Pages that need a signed-in user (API routes check auth themselves and return 401).
const PROTECTED_PREFIXES = ['/seller', '/dashboard', '/transaction', '/account'];

const isProtected = (path: string) =>
  PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

/** Refreshes the Supabase session cookie and guards protected pages. */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!isSupabaseConfigured) {
    // Auth not set up yet: public pages work, protected pages go to /login (which explains).
    return isProtected(path) ? redirectToLogin(request) : NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // No-cache headers so a CDN never serves one user's session to another
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Do not put code between createServerClient and getClaims().
  // getClaims() verifies the token's signature (locally with the project's public keys,
  // or via Supabase for legacy keys). Never trust getSession() on the server.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  if (!user && isProtected(path)) {
    return withCookies(redirectToLogin(request), response);
  }

  // Signed-in users don't need the login page
  if (user && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = safeNextPath(request.nextUrl.searchParams.get('next'));
    url.search = '';
    return withCookies(NextResponse.redirect(url), response);
  }

  return response;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

// A redirect is a new response, so carry over any refreshed auth cookies + headers
function withCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  ['cache-control', 'expires', 'pragma'].forEach((key) => {
    const value = source.headers.get(key);
    if (value) target.headers.set(key, value);
  });
  return target;
}
