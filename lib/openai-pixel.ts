// OpenAI measurement pixel (ChatGPT Ads) — client-side helpers.
//
// The whole install is dark until NEXT_PUBLIC_OPENAI_PIXEL_ID is set. With no
// ID the base snippet never renders, `window.oaiq` never exists, and every
// function here no-ops. Nothing reaches OpenAI until that variable lands.
//
// The journey this measures:
//   ad click → any page of ours (the pixel stores the click's `oppref` in its
//   own first-party `__oppref` cookie, 30 days) → /apply-now, where the GHL
//   Master Form runs in an iframe → GHL redirects to one of our own pages →
//   the conversion fires there. Every hop is creditbanc.io, so the cookie
//   carries attribution across the whole funnel on its own — we never have to
//   thread `oppref` through the form.
//
// Docs: https://developers.openai.com/ads/measurement-pixel

import type { StickyContact } from './sticky-contact';

/** Empty unless the pixel ID is configured, which is what keeps this dark. */
export const PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || '';

// Where the lead conversion fires — the one open question from the media
// buyer, left as a switch so it can be answered without a code change:
//
//   'booking' (default) — fire on /book-with-creditbanc, which GHL only
//     redirects to when the applicant clears our funding minimums. Counts
//     qualified leads only. Cleaner signal to optimize toward later.
//   'submit' — fire the moment the GHL form broadcasts a successful submit on
//     /apply-now. Counts every application, including the ones routed to
//     /thanks-for-applying for being below minimums. More volume, softer
//     signal.
export const LEAD_EVENT_AT: 'booking' | 'submit' =
  process.env.NEXT_PUBLIC_OPENAI_LEAD_EVENT_AT === 'submit'
    ? 'submit'
    : 'booking';

// Pixel debug logging. On outside production so local checks are visible, and
// forceable anywhere with NEXT_PUBLIC_OPENAI_PIXEL_DEBUG=true when the ad team
// needs to watch events land on the live site. Leaving it on permanently just
// means noisy consoles for clients.
export const PIXEL_DEBUG =
  process.env.NEXT_PUBLIC_OPENAI_PIXEL_DEBUG === 'true' ||
  (process.env.NEXT_PUBLIC_OPENAI_PIXEL_DEBUG !== 'false' &&
    process.env.NODE_ENV !== 'production');

/** Standard event names we use. See /ads/supported-events for the full list. */
export type PixelEvent =
  | 'page_viewed'
  | 'lead_created'
  | 'appointment_scheduled';

/** SHA-256 identifiers for conversion matching. Raw values never leave here. */
export interface PixelUser {
  email_sha256?: string;
  phone_number_sha256?: string;
  first_name_sha256?: string;
  last_name_sha256?: string;
}

// The contact captured at form submit, carried to whichever page the GHL
// redirect lands on so the conversion there can be matched to a person.
const MATCH_KEY = 'cb-oai-match';
// One marker per conversion, so a refresh or a back-button return to a funnel
// page cannot count the same lead twice. sessionStorage scopes it to the tab.
const FIRED_PREFIX = 'cb-oai-fired:';

interface StoredMatch {
  user: PixelUser;
  /** Shared with the Conversions API later so the two sides dedupe. */
  eventIdSeed: string;
}

type Oaiq = (...args: unknown[]) => void;

/**
 * The pixel command queue, or null when the pixel is not installed. The base
 * snippet defines `window.oaiq` synchronously in <head>, so by the time any
 * React effect runs it either exists or the pixel is switched off entirely.
 */
function queue(): Oaiq | null {
  if (!PIXEL_ID || typeof window === 'undefined') return null;
  const oaiq = (window as unknown as { oaiq?: Oaiq }).oaiq;
  return typeof oaiq === 'function' ? oaiq : null;
}

// The SDK validates every event against a shape picked by event name, and
// silently drops anything that does not match ("validation failed; event
// dropped" — logged once per distinct problem, so a mismatch is easy to miss
// entirely). The mapping is not in the published docs and is not uniform:
// page views want `contents` while the conversions want `customer_action`.
// These values are lifted from the SDK's own table (oaiq.min.js 0.1.41) and
// verified against a live pixel.
const DATA_TYPE: Record<PixelEvent | 'custom', string> = {
  page_viewed: 'contents',
  lead_created: 'customer_action',
  appointment_scheduled: 'customer_action',
  custom: 'custom',
};

// Each shape also has a closed field list, and an undocumented field fails the
// same way. We only ever send `type`, which every shape allows, but the lists
// are recorded here so anyone adding a field knows the constraint:
//   contents         → type, amount, currency, contents
//   customer_action  → type, amount, currency
//   custom           → type, plan_id, amount, currency, contents
// Event options are limited to event_id, eventId, custom_event_name, opt_out.

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// OpenAI does not publish normalization rules, so we use the convention every
// other ad platform expects: trimmed and lowercased email, digits-only phone
// carrying its country code. Our applicants are US businesses, so a bare
// 10-digit number gets a leading 1.
function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D+/g, '');
  return digits.length === 10 ? `1${digits}` : digits;
}

async function hashContact(contact: StickyContact): Promise<PixelUser> {
  const user: PixelUser = {};
  const email = normalizeEmail(contact.email || '');
  const phone = normalizePhone(contact.phone || '');
  const first = (contact.firstName || '').trim().toLowerCase();
  const last = (contact.lastName || '').trim().toLowerCase();

  if (email) user.email_sha256 = await sha256Hex(email);
  if (phone) user.phone_number_sha256 = await sha256Hex(phone);
  if (first) user.first_name_sha256 = await sha256Hex(first);
  if (last) user.last_name_sha256 = await sha256Hex(last);
  return user;
}

function readMatch(): StoredMatch | null {
  try {
    const raw = sessionStorage.getItem(MATCH_KEY);
    return raw ? (JSON.parse(raw) as StoredMatch) : null;
  } catch {
    // sessionStorage unavailable (strict privacy modes). The conversion still
    // fires, just without the hashed identifiers.
    return null;
  }
}

// Deduplication only works if the browser and the server arrive at the same
// event ID independently. Seeding it from the email hash does that: a GHL
// webhook hashing the same contact email server-side computes the same ID,
// with no shared state between them. Without an email there is nothing stable
// to derive from, so we fall back to a random seed — fine today, since the
// Conversions API half is not live yet.
function eventId(event: string, seed: string) {
  return `${event}:${seed}`;
}

function randomSeed() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 32);
}

function alreadyFired(key: string): boolean {
  try {
    if (sessionStorage.getItem(FIRED_PREFIX + key)) return true;
    sessionStorage.setItem(FIRED_PREFIX + key, '1');
    return false;
  } catch {
    // Without storage we cannot guard, and an over-count is worse than a
    // missed refresh, so treat an unreadable marker as "already fired".
    return true;
  }
}

/** `page_viewed` for the current route. Safe to call on every navigation. */
export function firePageView() {
  queue()?.('measure', 'page_viewed', { type: DATA_TYPE.page_viewed });
}

/**
 * Fire a conversion once per session, matched to the contact captured at form
 * submit when we have one.
 *
 * `onceKey` is what the repeat guard keys on — pass the same key anywhere the
 * same real-world conversion could fire from.
 */
export async function fireConversion(
  event: PixelEvent | 'custom',
  options: { customEventName?: string; onceKey: string }
) {
  const oaiq = queue();
  if (!oaiq) return;
  if (alreadyFired(options.onceKey)) return;

  const match = readMatch();
  // Re-init with the hashed contact before measuring. Calling init again with
  // fuller user data is the documented way to supply it after the fact.
  if (match?.user && Object.keys(match.user).length > 0) {
    oaiq('init', { pixelId: PIXEL_ID, user: match.user });
  }

  const seed = match?.eventIdSeed || randomSeed();
  const name = options.customEventName || event;
  oaiq(
    'measure',
    event,
    { type: DATA_TYPE[event] },
    {
      event_id: eventId(name, seed),
      ...(event === 'custom' && options.customEventName
        ? { custom_event_name: options.customEventName }
        : {}),
    }
  );
}

/**
 * Called when the GHL form iframe broadcasts a successful submit to the parent
 * page (lib/sticky-contact.ts). Stashes the hashed contact for whichever page
 * the redirect lands on, and fires the lead conversion here when the install
 * is configured to count at submit time.
 *
 * This is the part the iframe was supposed to make impossible: the form posts
 * the contact out to us, so we get the submit moment and the identifiers
 * without reaching into the frame.
 */
export async function handleLeadSubmitted(contact: StickyContact) {
  if (!PIXEL_ID) return;

  let user: PixelUser = {};
  try {
    user = await hashContact(contact);
  } catch {
    // crypto.subtle needs a secure context. Unhashed data must never be sent,
    // so on failure the conversion simply goes out unmatched.
  }

  const seed = user.email_sha256 ? user.email_sha256.slice(0, 32) : randomSeed();
  try {
    sessionStorage.setItem(
      MATCH_KEY,
      JSON.stringify({ user, eventIdSeed: seed } satisfies StoredMatch)
    );
  } catch {
    // No storage: the conversion on the next page fires unmatched.
  }

  if (LEAD_EVENT_AT === 'submit') {
    await fireConversion('lead_created', { onceKey: 'lead' });
  }
}
