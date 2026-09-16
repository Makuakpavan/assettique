import { parseBudgetNaira } from '@/lib/money';

export type AssetType = 'vehicle' | 'property';

// Words that point to a car or a property. Multi-word phrases are fine.
const VEHICLE_WORDS = [
  'car', 'vehicle', 'automobile', 'automotive', 'suv', 'sedan', 'coupe', 'convertible', 'truck', 'jeep',
  'mercedes', 'benz', 'amg', 'g63', 'g wagon', 'g-wagon', 'maybach', 'range rover', 'land rover', 'rolls royce',
  'rolls-royce', 'cullinan', 'bentley', 'lamborghini', 'urus', 'ferrari', 'porsche', 'cayenne', 'lexus', 'toyota',
  'land cruiser', 'prado', 'bmw', 'audi', 'tesla', 'cadillac', 'escalade', 'mileage', 'horsepower', 'engine',
];
const PROPERTY_WORDS = [
  'land', 'property', 'properties', 'plot', 'acre', 'hectare', 'sqm', 'estate', 'house', 'home', 'duplex',
  'bungalow', 'apartment', 'flat', 'penthouse', 'villa', 'mansion', 'terrace', 'waterfront', 'beachfront',
  'real estate', 'c of o', 'governor\'s consent', 'bedroom',
];
const LOCATIONS = [
  'Lagos', 'Lekki', 'Ikoyi', 'Victoria Island', 'Banana Island', 'Ikeja', 'Ajah', 'Epe',
  'Abuja', 'Maitama', 'Asokoro', 'Wuse', 'Gwarinpa', 'Jabi', 'Katampe',
  'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Jos', 'Kaduna', 'Benin City', 'Calabar', 'Uyo',
  'Asaba', 'Owerri', 'Abeokuta', 'Ilorin', 'Warri',
  'Accra', 'Nairobi', 'Johannesburg', 'Cape Town', 'Kigali', 'Dubai',
];
// Common words that say nothing about which asset someone wants
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'under', 'below', 'above', 'over', 'less', 'more', 'than', 'need', 'want',
  'looking', 'find', 'show', 'some', 'any', 'that', 'this', 'these', 'those', 'from', 'near', 'around', 'within',
  'budget', 'million', 'billion', 'naira', 'ngn', 'price', 'cheaper', 'cheap', 'better', 'bigger', 'smaller',
  'something', 'anything', 'what', 'which', 'have', 'you', 'your', 'please', 'can', 'could', 'would', 'like',
  'good', 'best', 'nice', 'one', 'also', 'about', 'suitable', 'buy', 'buying', 'get', 'there', 'are', 'is',
  'max', 'maximum', 'min', 'minimum', 'not', 'too', 'much', 'all', 'show', 'me',
]);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Whole-word match, allowing a plural "s" (car/cars, plot/plots)
const hasWord = (text: string, word: string) =>
  new RegExp(`(^|[^a-z0-9])${escapeRegex(word.toLowerCase())}s?(?=$|[^a-z0-9])`).test(text.toLowerCase());

export function detectType(text: string): AssetType | null {
  const v = VEHICLE_WORDS.filter((w) => hasWord(text, w)).length;
  // Remove car phrases first so "Land Rover" / "Land Cruiser" don't also count as "land"
  const withoutCarPhrases = VEHICLE_WORDS.filter((w) => w.includes(' ')).reduce(
    (t, phrase) => t.replace(new RegExp(escapeRegex(phrase), 'gi'), ' '),
    text
  );
  const p = PROPERTY_WORDS.filter((w) => hasWord(withoutCarPhrases, w)).length;
  if (v === p) return null; // none, or genuinely mixed
  return v > p ? 'vehicle' : 'property';
}

export function detectLocation(text: string): string | null {
  return LOCATIONS.find((place) => hasWord(text, place)) ?? null;
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z0-9][a-z0-9-]*/g) ?? [];
  const useful = (w: string) =>
    /^(19|20)\d{2}$/.test(w) || // model years like 2024
    (/[a-z]/.test(w) && (w.length >= 3 || /\d/.test(w)) && // words, and codes like "g63" or "x5"
      !/^\d+(\.\d+)?(k|m|b|bn|mil)$/.test(w)); // …but not price shorthand like "150m" or "1bn"
  return Array.from(new Set(words.filter((w) => useful(w) && !STOPWORDS.has(w))));
}

export interface MatchCriteria {
  type: AssetType | null;
  location: string | null;
  budgetNaira: number | null;
  keywords: string[];
}

/**
 * Works out what the user is after from the conversation so far (oldest first).
 * The most recent message that mentions a type / location / budget wins, so
 * "Luxury SUV in Lagos" followed by "something cheaper" still means SUVs in Lagos.
 */
export function deriveCriteria(userMessages: string[]): MatchCriteria {
  const newestFirst = [...userMessages].reverse();
  const firstHit = <T>(fn: (m: string) => T | null) => {
    for (const m of newestFirst) {
      const hit = fn(m);
      if (hit !== null) return hit;
    }
    return null;
  };
  return {
    type: firstHit(detectType),
    location: firstHit(detectLocation),
    budgetNaira: firstHit(parseBudgetNaira),
    keywords: Array.from(new Set(newestFirst.slice(0, 3).flatMap(extractKeywords))),
  };
}

export interface MatchableListing {
  title: string;
  description: string;
  category: string | null;
  location: string;
  specs: unknown;
  publishedAt?: Date | null;
}

function searchableText(l: MatchableListing): string {
  const specValues =
    l.specs && typeof l.specs === 'object' ? Object.values(l.specs as Record<string, unknown>).join(' ') : '';
  return `${l.title} ${l.description} ${l.category ?? ''} ${l.location} ${specValues}`;
}

export function scoreListing(l: MatchableListing, keywords: string[]): number {
  const text = searchableText(l);
  return keywords.filter((k) => hasWord(text, k)).length;
}

/**
 * Ranks candidates (already filtered by type/location/budget in the database).
 * - context: what the AI is allowed to talk about (best matches first)
 * - cards:   up to 3 listings to show as recommendation cards
 */
export function rankListings<T extends MatchableListing>(listings: T[], criteria: MatchCriteria) {
  const scored = listings
    .map((listing) => ({ listing, score: scoreListing(listing, criteria.keywords) }))
    .sort((a, b) => b.score - a.score);

  const hasFilters = Boolean(criteria.type || criteria.location || criteria.budgetNaira);
  // With no filters, only listings that actually mention the user's words count as matches.
  // (Otherwise "Maybach" would return whatever was listed most recently.)
  const matches = hasFilters ? scored : scored.filter((s) => s.score > 0);

  return {
    context: matches.slice(0, 8).map((s) => s.listing),
    cards: matches.slice(0, 3).map((s) => s.listing),
  };
}
