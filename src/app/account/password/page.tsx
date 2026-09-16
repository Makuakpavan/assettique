'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { createClient } from '@/lib/supabase/client';

const inputClass =
  'w-full bg-luxury-dark border border-luxury-border rounded-xl pl-11 pr-4 py-3 text-sm text-luxury-ivory placeholder:text-luxury-muted/60 focus:outline-none focus:border-gold-500/50';

// Reached from the password-reset email (via /auth/callback) or while signed in.
// Middleware sends signed-out visitors to /login.
export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    setError(null);
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        setError(error.code === 'same_password' ? 'Choose a password different from your current one.' : error.message);
      } else {
        setDone(true);
      }
    } catch {
      setError('Could not reach the sign-in service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="section-padding py-16 pb-24 flex justify-center">
        <div className="w-full max-w-md bg-luxury-card rounded-2xl border border-luxury-border p-8">
          <h1 className="text-3xl font-light text-center mb-8">NEW PASSWORD</h1>
          {done ? (
            <div className="text-center space-y-6">
              <p role="status" className="text-sm text-emerald-400">Your password has been updated.</p>
              <Link href="/seller" className="btn-primary inline-block">Go to Seller Portal</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input aria-label="New password" type="password" autoComplete="new-password" placeholder="New password (min. 8 characters)"
                  className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-muted" />
                <input aria-label="Confirm password" type="password" autoComplete="new-password" placeholder="Confirm new password"
                  className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()} />
              </div>
              {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
              <button onClick={handleSave} disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? 'SAVING…' : 'SAVE PASSWORD'}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
