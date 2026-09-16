import { getCurrentUser } from '@/lib/auth';

/**
 * ID of the signed-in seller, or null when nobody is signed in.
 * Never take sellerId from the request body.
 */
export async function getCurrentSellerId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
