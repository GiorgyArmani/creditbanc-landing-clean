// GHL (GoHighLevel) v2 API client — server-only.
// Never import this from a "use client" component; it reads private env vars.

const GHL_BASE = process.env.GHL_BASE || 'https://services.leadconnectorhq.com';
const GHL_TOKEN = process.env.GHL_TOKEN || process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID || '';
const GHL_APPLY_TAGS = (process.env.GHL_APPLY_TAGS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Different GHL endpoints expect different `Version` headers.
const VERSION_CALENDARS = '2021-04-15';
const VERSION_CONTACTS = '2021-07-28';

export class GhlError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'GhlError';
    this.status = status;
    this.body = body;
  }
}

function ensureConfig() {
  if (!GHL_TOKEN) throw new GhlError('GHL token missing', 500, null);
  if (!GHL_LOCATION_ID) throw new GhlError('GHL location id missing', 500, null);
}

async function ghlFetch<T>(
  path: string,
  init: RequestInit & { version: string }
): Promise<T> {
  const { version, headers, ...rest } = init;
  const url = `${GHL_BASE}${path}`;
  const method = (rest.method || 'GET').toUpperCase();
  console.log(`[ghl] → ${method} ${path} (version=${version})`);
  if (rest.body && typeof rest.body === 'string') {
    try {
      const parsed = JSON.parse(rest.body);
      console.log('[ghl] request body:', parsed);
    } catch {
      // non-JSON body, skip
    }
  }

  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${GHL_TOKEN}`,
      Version: version,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    cache: 'no-store',
  });

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  console.log(`[ghl] ← ${method} ${path} status=${res.status}`);
  if (!res.ok) {
    console.error('[ghl] error body:', body);
    throw new GhlError(
      `GHL ${path} failed (${res.status})`,
      res.status,
      body
    );
  }
  console.log('[ghl] success body:', body);
  return body as T;
}

// ---------- Free slots ----------

export interface FreeSlotsResponse {
  [dateKey: string]: { slots: string[] } | string | undefined;
  traceId?: string;
}

export interface DaySlots {
  date: string; // "YYYY-MM-DD"
  slots: string[]; // ISO strings with offset
}

export async function getFreeSlots(params: {
  startDate: number; // epoch ms
  endDate: number; // epoch ms
  timezone: string; // e.g. "America/New_York"
  calendarId?: string;
}): Promise<DaySlots[]> {
  ensureConfig();
  const calendarId = params.calendarId || GHL_CALENDAR_ID;
  if (!calendarId) throw new GhlError('GHL calendar id missing', 500, null);

  const qs = new URLSearchParams({
    startDate: String(params.startDate),
    endDate: String(params.endDate),
    timezone: params.timezone,
  });

  const data = await ghlFetch<FreeSlotsResponse>(
    `/calendars/${encodeURIComponent(calendarId)}/free-slots?${qs.toString()}`,
    { method: 'GET', version: VERSION_CALENDARS }
  );

  const out: DaySlots[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'traceId') continue;
    if (
      value &&
      typeof value === 'object' &&
      'slots' in value &&
      Array.isArray((value as { slots: unknown }).slots)
    ) {
      out.push({
        date: key,
        slots: ((value as { slots: string[] }).slots || []).slice().sort(),
      });
    }
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

// ---------- Contact upsert ----------

export interface UpsertContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  customFields?: Array<{ id: string; field_value: string | number }>;
}

export interface UpsertContactResponse {
  contact?: { id?: string; locationId?: string };
  new?: boolean;
  traceId?: string;
}

export async function upsertContact(
  input: UpsertContactInput
): Promise<{ contactId: string; isNew: boolean }> {
  ensureConfig();
  const tags = Array.from(
    new Set([...(input.tags || []), ...GHL_APPLY_TAGS])
  ).filter(Boolean);

  const body = {
    locationId: GHL_LOCATION_ID,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    companyName: input.companyName,
    source: input.source || 'apply-now',
    tags: tags.length ? tags : undefined,
    customFields:
      input.customFields && input.customFields.length
        ? input.customFields
        : undefined,
  };

  const data = await ghlFetch<UpsertContactResponse>('/contacts/upsert', {
    method: 'POST',
    body: JSON.stringify(body),
    version: VERSION_CONTACTS,
  });

  const id = data.contact?.id;
  if (!id) {
    throw new GhlError('GHL upsert returned no contact id', 502, data);
  }
  return { contactId: id, isNew: Boolean(data.new) };
}

// ---------- Contact note ----------

export async function addContactNote(
  contactId: string,
  noteBody: string
): Promise<void> {
  ensureConfig();
  await ghlFetch(`/contacts/${encodeURIComponent(contactId)}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body: noteBody }),
    version: VERSION_CONTACTS,
  });
}

// ---------- Appointment create ----------

export interface CreateAppointmentInput {
  contactId: string;
  startTime: string; // ISO with offset, must match a free slot
  endTime?: string; // optional; GHL infers from calendar slot duration if omitted
  title?: string;
  notes?: string;
  calendarId?: string;
}

export interface CreateAppointmentResponse {
  id?: string;
  calendarId?: string;
  contactId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  traceId?: string;
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<CreateAppointmentResponse> {
  ensureConfig();
  const calendarId = input.calendarId || GHL_CALENDAR_ID;
  if (!calendarId) throw new GhlError('GHL calendar id missing', 500, null);

  const body: Record<string, unknown> = {
    calendarId,
    locationId: GHL_LOCATION_ID,
    contactId: input.contactId,
    startTime: input.startTime,
    title: input.title || '15-min advisor call · Credit Banc',
    appointmentStatus: 'confirmed',
    ignoreDateRange: false,
    toNotify: true,
  };
  if (input.endTime) body.endTime = input.endTime;
  if (input.notes) body.notes = input.notes;

  return ghlFetch<CreateAppointmentResponse>(
    '/calendars/events/appointments',
    {
      method: 'POST',
      body: JSON.stringify(body),
      version: VERSION_CALENDARS,
    }
  );
}

export const ghlConfig = {
  hasCalendar: Boolean(GHL_CALENDAR_ID),
  locationId: GHL_LOCATION_ID,
};
