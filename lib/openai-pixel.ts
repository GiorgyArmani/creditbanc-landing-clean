// OpenAI measurement pixel (ChatGPT Ads) — client-side helpers.
//
// The whole install is dark until NEXT_PUBLIC_OPENAI_PIXEL_ID is set. With no
// ID the base snippet never renders, `window.oaiq` never exists, and every
// function here no-ops. Nothing reaches OpenAI until that variable lands.
//
// The journeys this measures:
//   ad click → any page of ours (the pixel stores the click's `oppref` in its
//   own first-party `__oppref` cookie, 30 days, scoped to creditbanc.io so it
//   covers www too) → a GHL form in an iframe → GHL redirects the page to one
//   of our own pages. Every hop is creditbanc.io, so the cookie carries
//   attribution across the whole funnel on its own. GHL also appends the
//   iframe's query string (UTMs, oppref) to its redirect URL.
//
//   /apply-now           → lead conversion on the redirect destination
//   /business-credit-101 → registration_completed the moment GHL reports the
//                          submit, before its redirect to the confirmation page
//
// Docs: https://developers.openai.com/ads/measurement-pixel

import {
  eventId,
  matchSeed,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from './openai-match';
import { sha256Hex } from './sha256';
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
  | 'appointment_scheduled'
  | 'registration_completed';

/**
 * Matching identifiers, in the field names and formats the pixel documents.
 * The *_sha256 fields are hashed here in the browser; raw email, phone and
 * names never leave this file. Location fields go as-is, as the docs allow.
 */
export interface PixelUser {
  email_sha256?: string;
  phone_number_sha256?: string;
  first_name_sha256?: string;
  last_name_sha256?: string;
  city?: string;
  region?: string;
  postal_code?: string;
}

// The contact captured at form submit, carried to whichever page the GHL
// redirect lands on so the conversion there can be matched to a person.
const MATCH_KEY = 'cb-oai-match';
// One marker per conversion, so a refresh or a back-button return to a funnel
// page cannot count the same lead twice. sessionStorage scopes it to the tab.
const FIRED_PREFIX = 'cb-oai-fired:';

interface StoredMatch {
  user: PixelUser;
  /** Shared with the Conversions API so the two sides dedupe. */
  eventIdSeed: string;
}

// Stand-ins for sessionStorage when it is unavailable (some privacy modes and
// in-app browsers). They only last for the current page, which is enough for
// conversions that fire at submit time.
const firedInMemory = new Set<string>();
let memoryMatch: StoredMatch | null = null;

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
  registration_completed: 'customer_action',
  custom: 'custom',
};

// Each shape also has a closed field list, and an undocumented field fails the
// same way. We only ever send `type`, which every shape allows, but the lists
// are recorded here so anyone adding a field knows the constraint:
//   contents         → type, amount, currency, contents
//   customer_action  → type, amount, currency
//   custom           → type, plan_id, amount, currency, contents
// Event options are limited to event_id, eventId, custom_event_name, opt_out.

// Normalization rules live in lib/openai-match.ts, shared with the server
// side so both hash the same way.

function upTo(value: string | undefined, max: number) {
  const v = (value || '').trim();
  return v.length <= max ? v : '';
}

function hashContact(contact: StickyContact): PixelUser {
  const user: PixelUser = {};
  const email = normalizeEmail(contact.email || '');
  const phone = normalizePhone(contact.phone || '');
  const first = normalizeName(contact.firstName || '');
  const last = normalizeName(contact.lastName || '');

  if (email) user.email_sha256 = sha256Hex(email);
  if (phone) user.phone_number_sha256 = sha256Hex(phone);
  if (first) user.first_name_sha256 = sha256Hex(first);
  if (last) user.last_name_sha256 = sha256Hex(last);

  const city = upTo(contact.city, 128);
  const region = upTo(contact.state, 128);
  const postal = upTo(contact.postalCode, 32);
  if (city) user.city = city;
  if (region) user.region = region;
  if (postal && /^[A-Za-z0-9 -]+$/.test(postal)) user.postal_code = postal;
  return user;
}

function readMatch(): StoredMatch | null {
  try {
    const raw = sessionStorage.getItem(MATCH_KEY);
    return raw ? (JSON.parse(raw) as StoredMatch) : memoryMatch;
  } catch {
    // sessionStorage unavailable. Use whatever this page captured itself.
    return memoryMatch;
  }
}

// Deduplication only works if the browser and the server arrive at the same
// event ID independently. Seeding it from the email hash (or the phone hash
// when there is no email) does that: the GHL webhook behind
// app/api/openai/registration hashes the same contact and computes the same
// ID, with no shared state between them. With neither there is nothing stable
// to derive from, so we fall back to a random seed.
function randomSeed() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 32);
}

/**
 * True when this conversion already fired in this tab; otherwise marks it.
 *
 * Without storage, page-load conversions are skipped, because counting every
 * refresh is worse than missing one. Submit-triggered conversions pass
 * `memoryFallback`: they only run on a real GHL success message, so skipping
 * them would silently drop every lead from a browser that blocks storage.
 */
function alreadyFired(key: string, memoryFallback: boolean): boolean {
  if (firedInMemory.has(key)) return true;
  try {
    if (sessionStorage.getItem(FIRED_PREFIX + key)) return true;
    sessionStorage.setItem(FIRED_PREFIX + key, '1');
  } catch {
    if (!memoryFallback) return true;
  }
  firedInMemory.add(key);
  return false;
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
 *
 * Runs synchronously (the Promise return type is kept for existing callers).
 * Once it returns, the event sits in the SDK's queue, and the SDK sends it
 * with keepalive/sendBeacon even if the page navigates away right after.
 */
export async function fireConversion(
  event: PixelEvent | 'custom',
  options: {
    customEventName?: string;
    onceKey: string;
    /** Only for conversions triggered by a real submit. See alreadyFired. */
    memoryFallback?: boolean;
  }
) {
  const oaiq = queue();
  if (!oaiq) return;
  if (alreadyFired(options.onceKey, options.memoryFallback === true)) return;

  const match = readMatch();
  // Re-init with the hashed contact before measuring. Calling init again with
  // the full user object is the documented way to supply it after the fact.
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
  stashMatch(contact);
  if (LEAD_EVENT_AT === 'submit') {
    await fireConversion('lead_created', {
      onceKey: 'lead',
      memoryFallback: true,
    });
  }
}

// ---------------------------------------------------------------------------
// Course signup handoff
//
// The course opt-in form redirects the whole page to
// /business-credit-builder/confirmation right after GHL broadcasts the
// submit. Tested in a browser: when that redirect starts in the same instant
// as the broadcast, the page is already unloading by the time our listener
// runs, the SDK's last flush has already happened, and an event queued here is
// lost. GHL only awaits its own tracking call before redirecting, so in
// production the gap can be close to zero.
//
// So the submit hands the conversion to the confirmation page as well, in a
// short-lived first-party cookie. A cookie rather than sessionStorage because
// ads land on creditbanc.io while GHL redirects to www.creditbanc.io, and
// storage does not cross origins. It holds the event ID and the already-hashed
// identifiers only, never raw contact data, and is deleted as soon as it is
// read. Both pages send the same event_id, which is OpenAI's documented
// deduplication key, so a signup counts once even when both get through.

const HANDOFF_COOKIE = 'cb_oai_reg';
const HANDOFF_MAX_AGE_S = 600;

interface Handoff {
  seed: string;
  user: Pick<
    PixelUser,
    | 'email_sha256'
    | 'phone_number_sha256'
    | 'first_name_sha256'
    | 'last_name_sha256'
  >;
}

function cookieAttributes() {
  const host = window.location.hostname;
  const domain =
    host === 'creditbanc.io' || host.endsWith('.creditbanc.io')
      ? '; Domain=creditbanc.io'
      : '';
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  return `; Path=/; SameSite=Lax${domain}${secure}`;
}

function writeHandoff(match: StoredMatch) {
  const { email_sha256, phone_number_sha256, first_name_sha256, last_name_sha256 } =
    match.user;
  const handoff: Handoff = {
    seed: match.eventIdSeed,
    user: { email_sha256, phone_number_sha256, first_name_sha256, last_name_sha256 },
  };
  try {
    document.cookie = `${HANDOFF_COOKIE}=${encodeURIComponent(
      JSON.stringify(handoff)
    )}; Max-Age=${HANDOFF_MAX_AGE_S}${cookieAttributes()}`;
  } catch {
    // Cookies blocked: the in-page conversion is the only attempt.
  }
}

function takeHandoff(): Handoff | null {
  try {
    const entry = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${HANDOFF_COOKIE}=`));
    if (!entry) return null;
    // Delete first, so a refresh or a second mount can never re-send it.
    document.cookie = `${HANDOFF_COOKIE}=; Max-Age=0${cookieAttributes()}`;
    const parsed = JSON.parse(
      decodeURIComponent(entry.slice(HANDOFF_COOKIE.length + 1))
    ) as Handoff;
    return typeof parsed?.seed === 'string' && parsed.seed ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Called when the course opt-in form (CourseOptInForm) broadcasts a successful
 * submit. GHL only sends that broadcast once it has saved the contact, so a
 * half-filled, invalid or failed form never counts as a signup.
 *
 * Synchronous on purpose: hash, hand off, queue, all in the same tick the
 * broadcast arrives, which gives the in-page event its best chance against
 * GHL's redirect. The handoff covers the cases where it still loses.
 */
export async function handleCourseRegistered(contact: StickyContact) {
  if (!PIXEL_ID) return;
  const match = stashMatch(contact);
  writeHandoff(match);
  await fireConversion('registration_completed', {
    onceKey: 'course-signup',
    memoryFallback: true,
  });
}

/**
 * Mounted on /business-credit-builder/confirmation. Sends the course signup
 * handed off by the form page, if there is one. A direct visit, a refresh or
 * a shared link has no handoff cookie, so nothing fires.
 */
export function firePendingRegistration() {
  const oaiq = queue();
  if (!oaiq) return;
  const handoff = takeHandoff();
  if (!handoff) return;

  const user = Object.fromEntries(
    Object.entries(handoff.user).filter(
      ([, v]) => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v)
    )
  );
  if (Object.keys(user).length > 0) {
    oaiq('init', { pixelId: PIXEL_ID, user });
  }
  oaiq(
    'measure',
    'registration_completed',
    { type: DATA_TYPE.registration_completed },
    { event_id: eventId('registration_completed', handoff.seed) }
  );
}

// Hash the submitted contact and keep it for the conversion that follows,
// whether it fires on this page or on the one the GHL redirect lands on.
function stashMatch(contact: StickyContact): StoredMatch {
  let user: PixelUser = {};
  try {
    user = hashContact(contact);
  } catch {
    // Unhashed data must never be sent, so on failure the conversion simply
    // goes out unmatched.
  }

  const seed =
    matchSeed({
      emailSha256: user.email_sha256,
      phoneSha256: user.phone_number_sha256,
    }) || randomSeed();
  const match: StoredMatch = { user, eventIdSeed: seed };
  memoryMatch = match;
  try {
    sessionStorage.setItem(MATCH_KEY, JSON.stringify(match));
  } catch {
    // No storage: the in-memory copy still covers this page's conversion.
  }
  return match;
}

// ---------------------------------------------------------------------------
// Attribution for the server side
//
// The Conversions API does not capture attribution itself. The pixel keeps it
// in two first-party cookies: `__oppref` (the ad click, 30 days) and `__obref`
// (a random browser reference, 365 days). The course form gets both as query
// params, its hidden fields save them on the GHL contact, and the GHL webhook
// hands them back to app/api/openai/registration unchanged.

const ATTRIBUTION_COOKIES = { oppref: '__oppref', obref: '__obref' } as const;

/**
 * The pixel's attribution cookies, as `{ oppref, obref }` query params. Empty
 * when the pixel is off, consent was declined (the pixel deletes both), or
 * this browser never came from an ad.
 */
export function readPixelAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  if (!PIXEL_ID || typeof document === 'undefined') return out;
  try {
    const cookies = document.cookie.split('; ');
    for (const [param, name] of Object.entries(ATTRIBUTION_COOKIES)) {
      const entry = cookies.find((c) => c.startsWith(`${name}=`));
      if (!entry) continue;
      const value = decodeURIComponent(entry.slice(name.length + 1)).trim();
      // Opaque IDs, passed through unmodified. The length cap only stops a
      // corrupted cookie from bloating the iframe URL.
      if (value && value.length <= 512) out[param] = value;
    }
  } catch {
    // Cookies unreadable: the conversion still goes out, just unattributed.
  }
  return out;
}
