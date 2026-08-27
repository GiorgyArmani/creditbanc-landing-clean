// Carries the contact from the /apply-now Master Form to the
// /book-with-creditbanc calendar so nobody types their details twice.
//
// GHL's own "sticky contact" feature is enabled on the calendar, but it does
// not work through our embeds on its own. The widgets don't share storage:
// they're third-party iframes on leadconnectorhq.com, so the calendar iframe
// can't read what the form iframe wrote. Instead the form iframe broadcasts
// the contact to the PARENT page with
// `postMessage(['set-sticky-contacts', '_ud', <json>, <locationId>, <fp>])`
// and the calendar iframe later asks the parent for it. Bridging those two is
// GHL's form_embed.js — which is loaded on both pages but evidently isn't
// completing the handoff across a page navigation.
//
// So we listen for the same broadcast ourselves and stash the contact in
// sessionStorage on our own origin, then prefill the calendar from it. This is
// a fallback: an explicit contact param on the booking URL always wins (see
// components/BookWithCreditBanc.tsx). sessionStorage scopes it to the tab, so
// one visitor's details never surface for the next.

const STORAGE_KEY = 'cb-sticky-contact';

// Only trust the GHL widget origins. postMessage is open to any frame on the
// page, and this data prefills a form, so an unchecked listener would let any
// embed put words in the client's mouth.
const TRUSTED_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*(leadconnectorhq\.com|msgsndr\.com)$/;

export interface StickyContact {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// The payload shape varies by widget version: sometimes the contact fields sit
// at the top level, sometimes under `.contact`. GHL's own redirect builder
// spreads both, so do the same.
function parsePayload(raw: string): StickyContact | null {
  let data: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const nested = (parsed as Record<string, unknown>).contact;
    data = {
      ...(parsed as Record<string, unknown>),
      ...(nested && typeof nested === 'object'
        ? (nested as Record<string, unknown>)
        : {}),
    };
  } catch {
    return null;
  }

  const full = str(data.full_name) || str(data.name);
  const firstSpace = full.indexOf(' ');
  const contact: StickyContact = {
    firstName:
      str(data.first_name) ||
      (firstSpace === -1 ? full : full.slice(0, firstSpace)),
    lastName:
      str(data.last_name) || (firstSpace === -1 ? '' : full.slice(firstSpace + 1)),
    email: str(data.email) || str(data.email_lower_case),
    phone: str(data.phone),
  };

  // A payload with no usable contact fields is worse than none — it would
  // overwrite nothing but still look like a hit.
  return contact.firstName || contact.email || contact.phone ? contact : null;
}

/**
 * Subscribe to the GHL form iframe's contact broadcast, which it sends to the
 * parent page the moment someone submits. Returns a cleanup function for the
 * caller's effect.
 *
 * This is the one place the origin check and payload parsing live — anything
 * that wants to react to a submit should come through here rather than adding
 * its own `message` listener. An unchecked listener would let any embed on the
 * page forge a contact.
 */
export function onStickyContact(
  callback: (contact: StickyContact) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const onMessage = (event: MessageEvent) => {
    if (!TRUSTED_ORIGIN.test(event.origin)) return;
    const data = event.data;
    if (!Array.isArray(data) || data[0] !== 'set-sticky-contacts') return;
    if (typeof data[2] !== 'string') return;

    const contact = parsePayload(data[2]);
    if (contact) callback(contact);
  };

  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}

/**
 * Listen for the GHL form iframe's contact broadcast and stash it.
 * Returns a cleanup function for the caller's effect.
 */
export function captureStickyContact(): () => void {
  return onStickyContact((contact) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(contact));
    } catch {
      // sessionStorage unavailable (strict privacy modes) — the calendar just
      // falls back to whatever the redirect URL carries.
    }
  });
}

export function readStickyContact(): StickyContact {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StickyContact) : {};
  } catch {
    return {};
  }
}
