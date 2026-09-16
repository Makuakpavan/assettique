'use client';

import { useEffect, useState } from 'react';
import type { ApiListing } from '@/lib/listingAdapters';

type Status = 'idle' | 'loading' | 'found' | 'not-found' | 'error';

/**
 * Loads /api/listings/[id] when `enabled` is true.
 * A listing of the wrong type (e.g. a property ID opened under /automotive) counts as not found.
 */
export function useApiListing(id: string, type: 'vehicle' | 'property', enabled: boolean) {
  const [listing, setListing] = useState<ApiListing | null>(null);
  const [status, setStatus] = useState<Status>(enabled ? 'loading' : 'idle');

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setStatus('loading');

    fetch(`/api/listings/${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) return setStatus('not-found');
        if (!res.ok) return setStatus('error');
        const data: ApiListing = await res.json();
        if (cancelled) return;
        if (data.type !== type) return setStatus('not-found');
        setListing(data);
        setStatus('found');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id, type, enabled]);

  return { listing, status };
}
