'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import type { AuthError } from '@supabase/supabase-js';
import { PageLayout } from '@/components/layout/PageLayout';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { safeNextPath } from '@/lib/safeNextPath';

type Mode = 'signin' | 'signup' | 'forgot';

const inputClass =
  'w-full bg-luxury-dark border border-luxury-border rounded-xl pl-11 pr-4 py-3 text-sm text-luxury-ivory placeholder:text-luxury-muted/60 focus:outline-none focus:border-gold-500/50';

// Turns Supabase errors into plain language
function friendlyError(error: AuthError): string {
  // Older self-hosted Supabase versions don't send error codes
  const code =
    error.code ??
    (/invalid login credentials/i.test(error.message) ? 'invalid_credentials'
      : /email not confirmed/i.test(error.message) ? 'email_not_confirmed'
      : undefined);

  switch (code) {
    case 'invalid_credentials':
      return 'Wrong email or password.';
    case 'email_not_confirmed':
      return 'Please confirm your email first — check your inbox for the link.';
    case 'user_already_exists':
      return 'An account with this email already exists. Try signing in.';
    case 'weak_password':
      return 'Please choose a stronger password.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a minute and try again.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
}

// Full page load after signing in: Next.js may have cached "go to /login" for protected
// pages while signed out (link prefetching), so a client-side navigation could bounce back.
function goTo(path: string) {
  window.location.assign(path);
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const linkError = searchParams.get('error') === 'link';

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError ? 'That link has expired or was opened on a different device. Please sign in or request a new link.' : null
  );
  const [notice, setNotice] = useState<string | null>(null);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setNotice(null);

    if (!email.trim()) return setError('Enter your email address.');
    if (mode !== 'forgot' && !password) return setError('Enter your password.');
    if (mode === 'signup' && !name.trim()) return setError('Enter your name.');
    if (mode === 'signup' && password.length < 8) return setError('Password must be at least 8 characters.');

    setLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) return setError(friendlyError(error));
        goTo(next);
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() },
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) return setError(friendlyError(error));
        if (data.session) {
          // Email confirmation is off in Supabase: signed in straight away
          goTo(next);
        } else {
          setNotice(`Almost there — we've sent a confirmation link to ${email.trim()}. Open it on this device to finish signing up.`);
          setPassword('');
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${origin}/auth/callback?next=/account/password`,
        });
        if (error && (error.code === 'over_email_send_rate_limit' || error.code === 'over_request_rate_limit')) {
          return setError(friendlyError(error));
        }
        // Same message either way, so the form doesn't reveal which emails have accounts
        setNotice('If an account exists for that email, a password reset link is on its way.');
      }
    } catch {
      setError('Could not reach the sign-in service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'signin' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'RESET PASSWORD';

  return (
    <div className="section-padding py-16 pb-24 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-luxury-card rounded-2xl border border-luxury-border p-8"
      >
        <p className="text-sm tracking-[0.3em] text-gold-400 uppercase mb-2 text-center">Assettique</p>
        <h1 className="text-3xl font-light text-center mb-8">{title}</h1>

        {!isSupabaseConfigured ? (
          <p role="alert" className="text-sm text-luxury-muted text-center">
            {process.env.NODE_ENV === 'development'
              ? 'Sign-in is not set up yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart the dev server.'
              : 'Sign-in is temporarily unavailable. Please try again later.'}
          </p>
        ) : (
          <div
            className="space-y-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          >
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input aria-label="Full name" autoComplete="name" placeholder="Full name" className={inputClass}
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
              <input aria-label="Email" type="email" autoComplete="email" placeholder="Email address" className={inputClass}
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input aria-label="Password" type="password" placeholder={mode === 'signup' ? 'Password (min. 8 characters)' : 'Password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className={inputClass}
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button onClick={() => switchMode('forgot')} className="text-xs text-luxury-muted hover:text-gold-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
            {notice && <p role="status" className="text-sm text-emerald-400">{notice}</p>}

            <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading
                ? 'PLEASE WAIT…'
                : mode === 'signin' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'}
            </button>

            <p className="text-sm text-luxury-muted text-center pt-2">
              {mode === 'signin' ? (
                <>New to Assettique?{' '}
                  <button onClick={() => switchMode('signup')} className="text-gold-400 hover:underline">Create an account</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => switchMode('signin')} className="text-gold-400 hover:underline">Sign in</button>
                </>
              )}
            </p>
          </div>
        )}

        <p className="text-xs text-luxury-muted/60 text-center mt-8">
          <Link href="/" className="hover:text-gold-400 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageLayout>
      {/* useSearchParams needs a Suspense boundary */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </PageLayout>
  );
}
