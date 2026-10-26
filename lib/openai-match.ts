// Identifier formatting and event IDs shared by the OpenAI pixel (browser) and
// the Conversions API (server).
//
// Both sides must produce byte-identical output: a value normalized
// differently on one side hashes to something that never matches, and an
// event ID built differently defeats deduplication, so the conversion counts
// twice. Keeping one copy here is what guarantees they agree.
//
// Rules from https://developers.openai.com/ads/conversions-api (user
// identifiers). Pure functions, safe to import from client and server code.

/** Trim and lowercase. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

/**
 * Digits only, country code kept, no leading `+` or zeros, 8–15 digits. GHL
 * often stores US numbers as a bare 10 digits, so those get the US code.
 * Returns '' when the result is not a plausible number.
 */
export function normalizePhone(value: string) {
  let digits = value.replace(/\D+/g, '').replace(/^0+/, '');
  if (digits.length === 10) digits = `1${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? digits : '';
}

/** Lowercase, whitespace and ASCII punctuation removed, accents kept. */
export function normalizeName(value: string) {
  return value.toLowerCase().replace(/[\s!-/:-@[-`{-~]+/g, '');
}

/**
 * The seed both sides derive the event ID from, with no shared state: the
 * first 32 hex chars of the email hash, or of the phone hash when there is no
 * email. Null when neither exists (the browser then uses a random seed, and
 * that conversion cannot be deduplicated against a server copy).
 */
export function matchSeed(hashes: {
  emailSha256?: string;
  phoneSha256?: string;
}): string | null {
  const source = hashes.emailSha256 || hashes.phoneSha256;
  return source ? source.slice(0, 32) : null;
}

/**
 * Pixel `event_id` and Conversions API `id`. OpenAI deduplicates on pixel ID +
 * event name + this value, keeping whichever copy arrives first.
 */
export function eventId(event: string, seed: string) {
  return `${event}:${seed}`;
}
