import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  buildRegistrationEvent,
  sendEvents,
  type CapiAttribution,
  type CapiContact,
} from '@/lib/openai-capi';

// Server-side `registration_completed` for the Business Credit Builder 101
// course, sent to OpenAI's Conversions API.
//
// Called by a GHL workflow, not by the browser: trigger "Form Submitted" on
// the course form(s), action "Webhook" to this URL. GHL only runs that
// trigger once it has saved the contact, so only a successfully created lead
// reaches OpenAI. A half-filled or failed form never gets here. Setup steps
// are in the README.
//
// The browser pixel sends the same signup with the same event ID, and OpenAI
// keeps whichever copy lands first. This copy catches the signups the browser
// misses (ad blockers, the form's instant redirect, closed tabs).
//
// What actually reaches OpenAI is controlled by OPENAI_CAPI_MODE (see
// lib/openai-capi.ts). It defaults to validate-only: OpenAI checks every
// event but records none until the mode is set to 'live'.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECRET = process.env.OPENAI_CAPI_WEBHOOK_SECRET || '';
const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://www.creditbanc.io').replace(/\/+$/, '');
const DEFAULT_SOURCE_URL = `${SITE_ORIGIN}/business-credit-101`;

type Json = Record<string, unknown>;

function obj(value: unknown): Json {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Json)
    : {};
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
}

/** First non-empty string among `keys`, searched across `sources` in order. */
function pick(sources: Json[], ...keys: string[]): string {
  for (const source of sources) {
    for (const key of keys) {
      const v = str(source[key]);
      if (v) return v;
    }
  }
  return '';
}

// Compare hashes so the check takes the same time whatever the input length.
function secretMatches(given: string) {
  if (!SECRET || !given) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(SECRET).digest();
  return timingSafeEqual(a, b);
}

function parseUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

/**
 * GHL's webhook payload: standard contact fields at the top level, custom
 * fields at the top level under their field names, the action's "Custom
 * Data" under `customData`, and attribution under `contact`. Field names
 * vary a little by GHL version, so each value is looked up a few ways.
 */
function readPayload(payload: Json) {
  const customData = obj(payload.customData);
  const nested = obj(payload.contact);
  const sources = [customData, payload, nested];

  let firstName = pick(sources, 'first_name', 'firstName');
  let lastName = pick(sources, 'last_name', 'lastName');
  if (!firstName && !lastName) {
    const full = pick(sources, 'full_name', 'fullName', 'name');
    const space = full.indexOf(' ');
    firstName = space === -1 ? full : full.slice(0, space);
    lastName = space === -1 ? '' : full.slice(space + 1);
  }

  const contact: CapiContact = {
    email: pick(sources, 'email'),
    phone: pick(sources, 'phone'),
    firstName,
    lastName,
    city: pick(sources, 'city'),
    state: pick(sources, 'state'),
    postalCode: pick(sources, 'postal_code', 'postalCode'),
    country: pick(sources, 'country'),
    contactId: pick(sources, 'contact_id', 'contactId'),
  };

  // The page the signup happened on, from GHL's attribution when it has one.
  const attributionSources = [
    obj(payload.attributionSource),
    obj(nested.attributionSource),
    obj(payload.lastAttributionSource),
    obj(nested.lastAttributionSource),
  ];
  const pageUrl = parseUrl(
    pick([customData, payload], 'source_url', 'page_url') ||
      pick(attributionSources, 'url', 'pageUrl')
  );

  // oppref/obref come from the form's hidden fields (saved as custom fields).
  // Failing that, the click ID may still be on the recorded page URL.
  const attribution: CapiAttribution = {
    oppref:
      pick(sources, 'oppref', 'OpenAI oppref', 'openai_oppref') ||
      pageUrl?.searchParams.get('oppref')?.trim() ||
      '',
    obref: pick(sources, 'obref', 'OpenAI obref', 'openai_obref'),
  };

  // Send only origin + path. GHL's URLs often carry the contact's name and
  // email in the query string, and those must not leave unhashed.
  const sourceUrl = pageUrl ? `${pageUrl.origin}${pageUrl.pathname}` : DEFAULT_SOURCE_URL;

  return { contact, attribution, sourceUrl };
}

export async function POST(req: Request) {
  if (!SECRET) {
    console.error('[openai-capi] OPENAI_CAPI_WEBHOOK_SECRET is not set; refusing');
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const url = new URL(req.url);
  const given = req.headers.get('x-webhook-secret') || url.searchParams.get('key') || '';
  if (!secretMatches(given)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // GHL's Custom Webhook key/value body is normally JSON, but accept a
  // form-encoded body too so a GHL setting can't silently break this.
  let payload: Json;
  const raw = await req.text();
  try {
    payload = obj(JSON.parse(raw));
  } catch {
    const form = new URLSearchParams(raw);
    payload = Object.fromEntries(form.entries());
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
  }

  const { contact, attribution, sourceUrl } = readPayload(payload);
  const event = buildRegistrationEvent({
    contact,
    attribution,
    sourceUrl,
    timestampMs: Date.now(),
  });
  if (!event) {
    console.warn('[openai-capi] skipped: contact has no email or phone');
    return NextResponse.json(
      { error: 'Contact has no email or phone' },
      { status: 422 }
    );
  }

  const result = await sendEvents([event]);

  // Log what was matched on, never the values themselves.
  console.log('[openai-capi] registration_completed', {
    mode: result.mode,
    eventId: event.id,
    identifiers: Object.keys(event.user),
    attributed: Boolean(event.oppref),
    sourceUrl: event.source_url,
    openaiStatus: result.status,
    openaiBody: result.sent ? undefined : result.body,
    error: result.error,
  });

  if (result.mode === 'off') {
    return NextResponse.json({ ok: true, mode: 'off', eventId: event.id });
  }
  // Non-2xx tells GHL the call failed, so it shows in the workflow history
  // and gets retried. A retry carries the same event ID, so it can't double
  // count.
  return NextResponse.json(
    {
      ok: result.sent,
      mode: result.mode,
      eventId: event.id,
      attributed: Boolean(event.oppref),
      openai: { status: result.status, body: result.body },
      ...(result.error ? { error: result.error } : {}),
    },
    { status: result.sent ? 200 : 502 }
  );
}
