// Money rule for Assettique:
//   Database  -> kobo, stored as BigInt   (₦1 = 100 kobo)
//   API + UI  -> naira, as a plain number (matches formatPrice / formatNumber)
// Convert ONLY at the API boundary, using the helpers below.

const KOBO_PER_NAIRA = 100;

/** DB value (kobo BigInt) -> naira number for JSON / UI. */
export function koboToNaira(kobo: bigint): number {
  return Number(kobo) / KOBO_PER_NAIRA;
}

/**
 * Naira from a request body -> kobo BigInt for the DB.
 * Returns null if the value isn't a positive, finite amount.
 */
export function nairaToKobo(naira: unknown): bigint | null {
  const value = typeof naira === 'string' ? Number(naira.replace(/,/g, '')) : naira;
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  return BigInt(Math.round(value * KOBO_PER_NAIRA));
}

/** Makes a Prisma listing safe for NextResponse.json (BigInt can't be serialized). */
export function serializeListing<T extends { price: bigint }>(
  listing: T
): Omit<T, 'price'> & { price: number } {
  return { ...listing, price: koboToNaira(listing.price) };
}

/**
 * Reads a budget out of free text and returns it in naira.
 * Handles: "₦200 million", "N200m", "NGN 1.5 billion", "under 1bn", "₦250,000,000".
 * A bare number needs a currency sign or a million/billion word, so "3–5 acres" is ignored.
 */
export function parseBudgetNaira(text: string): number | null {
  const currency = String.raw`(?:₦|\bngn\s*|\bn(?=\d))`;
  const amount = String.raw`(\d[\d,]*(?:\.\d+)?)`;
  // Words that signal a budget, so "under 200m" counts even without a ₦ sign
  const budgetWord = String.raw`\b(?:under|below|max(?:imum)?|budget(?:\s+of)?|up\s+to|less\s+than|within|at\s+most|not\s+more\s+than)\s*`;
  // Short units (m, b) only count with a currency sign or a budget word: "500m from the lagoon" is not a budget.
  const withUnit =
    text.match(new RegExp(`${currency}\\s*${amount}\\s*(billion|bn|b|million|mil|m)\\b`, 'i')) ||
    text.match(new RegExp(`${budgetWord}${amount}\\s*(billion|bn|b|million|mil|m)\\b`, 'i')) ||
    text.match(new RegExp(`${amount}\\s*(billion|bn|million|mil)\\b`, 'i'));
  if (withUnit) {
    const value = Number(withUnit[1].replace(/,/g, ''));
    const multiplier = withUnit[2].toLowerCase().startsWith('b') ? 1_000_000_000 : 1_000_000;
    return value * multiplier;
  }

  const withCurrency = text.match(new RegExp(`${currency}\\s*${amount}`, 'i'));
  if (withCurrency) {
    return Number(withCurrency[1].replace(/,/g, ''));
  }

  return null;
}
