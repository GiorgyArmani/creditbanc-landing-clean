// OpenAI Conversions API client (ChatGPT Ads). Server-only: it reads the API
// key. Never import this from a 'use client' component.
//
// Docs: https://developers.openai.com/ads/conversions-api
//
// OPENAI_CAPI_MODE decides what actually reaches OpenAI:
//   'validate' (default) — every request goes with validate_only: true.
//      OpenAI checks the event and answers, but saves nothing, so nothing is
//      counted, attributed or billed. This is the pre-launch state.
//   'live'  — events are saved and count as conversions.
//   'off'   — nothing is sent at all.
// Anything other than exactly 'live' stays safe, so a typo cannot go live.

import { createHash } from 'node:crypto';
import {
  eventId,
  matchSeed,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from './openai-match';

const ENDPOINT = 'https://bzr.openai.com/v1/events';
const API_KEY = process.env.OPEN_AI_ADS_API_KEY || '';
// Same pixel as the browser side. Deduplication only works within one pixel.
const PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || '';

export type CapiMode = 'live' | 'validate' | 'off';

export function capiMode(): CapiMode {
  const raw = (process.env.OPENAI_CAPI_MODE || '').trim().toLowerCase();
  if (raw === 'live') return 'live';
  if (raw === 'off') return 'off';
  return 'validate';
}

/** The contact as the CRM reports it. Raw values, never logged or sent. */
export interface CapiContact {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  /** CRM contact ID. Sent hashed as a stable external ID. */
  contactId?: string;
}

export interface CapiAttribution {
  /** Ad click ID, from the pixel's `__oppref` cookie. Passed unmodified. */
  oppref?: string;
  /** Browser reference, from the pixel's `__obref` cookie. Passed unmodified. */
  obref?: string;
}

interface CapiUser {
  emails_sha256?: string[];
  phone_numbers_sha256?: string[];
  first_names_sha256?: string[];
  last_names_sha256?: string[];
  external_ids_sha256?: string[];
  cities?: string[];
  regions?: string[];
  postal_codes?: string[];
  countries?: string[];
  obref?: string;
}

export interface CapiEvent {
  id: string;
  type: 'registration_completed';
  timestamp_ms: number;
  action_source: 'web';
  source_url: string;
  oppref?: string;
  user: CapiUser;
  data: { type: 'customer_action' };
}

function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function rawList(value: string | undefined, max: number) {
  const v = (value || '').trim().toLowerCase();
  return v && v.length <= max ? [v] : undefined;
}

/**
 * Hash and format the contact per OpenAI's rules. Raw email, phone and names
 * stop here: only their SHA-256 hashes leave this function. Location fields
 * go unhashed, as the docs require.
 */
export function buildUser(contact: CapiContact, attribution: CapiAttribution) {
  const user: CapiUser = {};
  const email = normalizeEmail(contact.email || '');
  const phone = normalizePhone(contact.phone || '');
  const first = normalizeName(contact.firstName || '');
  const last = normalizeName(contact.lastName || '');
  // External IDs are trimmed only, case preserved.
  const externalId = (contact.contactId || '').trim();

  const emailHash = email ? sha256(email) : '';
  const phoneHash = phone ? sha256(phone) : '';
  if (emailHash) user.emails_sha256 = [emailHash];
  if (phoneHash) user.phone_numbers_sha256 = [phoneHash];
  if (first) user.first_names_sha256 = [sha256(first)];
  if (last) user.last_names_sha256 = [sha256(last)];
  if (externalId) user.external_ids_sha256 = [sha256(externalId)];

  user.cities = rawList(contact.city, 128);
  user.regions = rawList(contact.state, 128);
  const postal = (contact.postalCode || '').trim();
  if (postal && postal.length <= 32 && /^[A-Za-z0-9 -]+$/.test(postal)) {
    user.postal_codes = [postal];
  }
  const country = (contact.country || '').trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(country)) user.countries = [country];

  const obref = (attribution.obref || '').trim();
  if (obref) user.obref = obref;

  // Drop the empty optional lists so the payload only carries what we have.
  for (const key of Object.keys(user) as (keyof CapiUser)[]) {
    if (user[key] === undefined) delete user[key];
  }
  return { user, emailHash, phoneHash };
}

/**
 * Build the registration_completed event. Null when the contact has neither
 * an email nor a phone: nothing to match on, and no stable event ID to
 * deduplicate against the pixel's copy.
 */
export function buildRegistrationEvent(input: {
  contact: CapiContact;
  attribution: CapiAttribution;
  sourceUrl: string;
  timestampMs: number;
}): CapiEvent | null {
  const { user, emailHash, phoneHash } = buildUser(
    input.contact,
    input.attribution
  );
  const seed = matchSeed({ emailSha256: emailHash, phoneSha256: phoneHash });
  if (!seed) return null;

  const oppref = (input.attribution.oppref || '').trim();
  return {
    // Same ID the pixel sends for this signup (lib/openai-pixel.ts), so
    // OpenAI keeps whichever copy arrives first and drops the other.
    id: eventId('registration_completed', seed),
    type: 'registration_completed',
    timestamp_ms: input.timestampMs,
    action_source: 'web',
    source_url: input.sourceUrl,
    ...(oppref ? { oppref } : {}),
    user,
    // Same data shape the pixel uses for this event.
    data: { type: 'customer_action' },
  };
}

export interface CapiResult {
  sent: boolean;
  mode: CapiMode;
  status?: number;
  body?: unknown;
  error?: string;
}

/** Send events to OpenAI, honoring OPENAI_CAPI_MODE. */
export async function sendEvents(events: CapiEvent[]): Promise<CapiResult> {
  const mode = capiMode();
  if (mode === 'off') return { sent: false, mode };
  if (!API_KEY || !PIXEL_ID) {
    return {
      sent: false,
      mode,
      error: 'OPEN_AI_ADS_API_KEY or NEXT_PUBLIC_OPENAI_PIXEL_ID is not set',
    };
  }

  const url = `${ENDPOINT}?pid=${encodeURIComponent(PIXEL_ID)}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        validate_only: mode !== 'live',
        integration_source: 'creditbanc-ghl',
        events,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // Not JSON. Keep the text.
    }
    return { sent: res.ok, mode, status: res.status, body };
  } catch (err) {
    return {
      sent: false,
      mode,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
