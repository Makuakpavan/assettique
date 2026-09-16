/**
 * Only allow same-site paths like "/seller?tab=listings".
 * Parses the value the same way the browser will (which silently drops tabs and
 * newlines, so "/\t/evil.com" becomes "//evil.com") and rejects anything that
 * would leave this site.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/')) return '/';

  const base = 'http://assettique.invalid';
  let url: URL;
  try {
    url = new URL(next, base);
  } catch {
    return '/';
  }
  if (url.origin !== base) return '/';
  // "/..//evil.com" normalises to the path "//evil.com", which a browser treats as another site
  if (url.pathname.startsWith('//')) return '/';

  return url.pathname + url.search + url.hash;
}
