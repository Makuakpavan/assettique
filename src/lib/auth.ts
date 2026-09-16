import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type CurrentUser = { id: string; email: string; name: string };

/**
 * The signed-in user, or null.
 * Verifies the session with Supabase (getUser), then makes sure a matching row
 * exists in our own User table, using the Supabase user ID as the primary key.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const select = { id: true, email: true, name: true } as const;
  const existing = await prisma.user.findUnique({ where: { id: user.id }, select });

  if (existing) {
    // Keep email in sync if it was changed in Supabase
    if (existing.email !== user.email) {
      return prisma.user.update({ where: { id: user.id }, data: { email: user.email }, select });
    }
    return existing;
  }

  const metaName = typeof user.user_metadata?.name === 'string' ? user.user_metadata.name.trim() : '';
  // upsert (not create): two first-time requests arriving together must not both try to insert
  return prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email, name: metaName || user.email.split('@')[0] },
    select,
  });
}
