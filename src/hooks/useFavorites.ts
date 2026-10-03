'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const STORAGE_KEY = 'assettique:favorites';

function readStoredFavoriteIds() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeStoredFavoriteIds(ids: Iterable<string>) {
  if (typeof window === 'undefined') return;

  try {
    const unique = Array.from(new Set(ids));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  } catch {
    // Ignore storage failures silently.
  }
}

export function useFavorites() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const localFavorites = new Set(readStoredFavoriteIds());
    setFavorites(localFavorites);

    if (!user) {
      setIsLoaded(true);
      return;
    }

    let active = true;

    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          const ids = Array.isArray(data.favorites) ? data.favorites.map((item: { id: string }) => item.id) : [];
          const merged = new Set([...localFavorites, ...ids]);
          if (active) setFavorites(merged);
          writeStoredFavoriteIds(merged);
        }
      } catch {
        if (active) setFavorites(localFavorites);
      } finally {
        if (active) setIsLoaded(true);
      }
    };

    void loadFavorites();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user) {
        const next = pathname && pathname !== '/login' ? pathname : '/';
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        writeStoredFavoriteIds(next);
        return next;
      });

      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: id }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok && !data.ignored) {
          setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            writeStoredFavoriteIds(next);
            return next;
          });
          throw new Error(data.error || 'Could not update favorite');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [pathname, router, user]
  );

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
