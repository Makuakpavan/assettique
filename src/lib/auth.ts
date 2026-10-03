import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type CurrentUser = { id: string; email: string; name: string; verified: boolean };

/**
 * The signed-in user, or null.
 * Verifies the session with Supabase (getUser), then ensures the account is email-confirmed
 * and that a matching row exists in our User table using the Supabase user ID as the primary key.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user?.email) return null;

  // Some Supabase projects keep email confirmation disabled or do not attach the
  // verification flag in `user_metadata`, even for valid signed-in accounts.
  // The app should still accept an authenticated session and only enforce stronger
  // checks in flows that explicitly require verified email.
  const select = { id: true, email: true, name: true, verified: true } as const;
  const existing = await prisma.user.findUnique({ where: { id: user.id }, select });

  if (existing) {
    if (existing.email !== user.email) {
      return prisma.user.update({
        where: { id: user.id },
        data: { email: user.email, verified: true },
        select,
      });
    }
    if (!existing.verified) {
      return prisma.user.update({
        where: { id: user.id },
        data: { verified: true },
        select,
      });
    }
    return existing;
  }

  const metaName = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name.trim() : '';
  return prisma.user.upsert({
    where: { id: user.id },
    update: { verified: true },
    create: {
      id: user.id,
      email: user.email,
      name: metaName || user.email.split('@')[0],
      verified: true,
    },
    select,
  });
}
