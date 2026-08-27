import { NextResponse } from 'next/server';
import { upsertContact, addContactNote, GhlError } from '@/lib/ghl';
import { watchBucket, type WatchTag } from '@/lib/mca-funnel';

// Records how much of the funnel video a lead watched, onto their GHL contact.
//
// Called from /daily-payments the moment the embedded GHL form broadcasts a
// submit (see lib/sticky-contact.ts) — that broadcast is the only point where
// an anonymous viewer and a named lead are the same known person.
//
// Watch depth lands as a bucketed TAG rather than a number, because tags are
// what GHL workflows and smart lists can actually trigger on. The exact
// percentage goes in a note for the advisor to read before the call.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface VideoEngagementPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  /** 0-100, the maximum reached — not where playback stopped. */
  watchedPct?: number;
  /** Whether play ever started, so "opened and ignored" is distinguishable. */
  played?: boolean;
  /** Whether they turned the sound on. A strong intent signal on muted autoplay. */
  unmuted?: boolean;
  videoTitle?: string;
  videoId?: string;
  pageVariant?: string;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function digitsOnly(s: string) {
  return s.replace(/\D+/g, '');
}

function buildNote(p: VideoEngagementPayload, tag: WatchTag): string {
  const pct = Math.round(p.watchedPct ?? 0);
  const lines: string[] = ['Video engagement — /daily-payments funnel.'];

  if (!p.played) {
    lines.push('Did not press play. Submitted from the page copy alone.');
  } else {
    lines.push(`Watched ${pct}% of "${p.videoTitle || p.videoId || 'the video'}".`);
    lines.push(
      p.unmuted
        ? 'Turned the sound on.'
        : 'Left it muted (autoplay starts muted by default).'
    );
  }

  if (p.pageVariant) lines.push(`Page variant: ${p.pageVariant}.`);
  lines.push(`Tag applied: ${tag}.`);
  return lines.join('\n');
}

export async function POST(req: Request) {
  let payload: VideoEngagementPayload;
  try {
    payload = (await req.json()) as VideoEngagementPayload;
  } catch {
    console.warn('[video-engagement] invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (payload.email || '').trim().toLowerCase();
  const phoneRaw = (payload.phone || '').trim();
  const phone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const firstName = (payload.firstName || '').trim();
  const lastName = (payload.lastName || '').trim();

  // GHL matches an existing contact on email or phone. Without at least one
  // there is nothing to attach to, and upserting would mint an orphan record.
  const hasEmail = Boolean(email && isEmail(email));
  const hasPhone = phone.length >= 10;
  if (!hasEmail && !hasPhone) {
    console.warn('[video-engagement] no usable identifier; skipping');
    return NextResponse.json(
      { error: 'An email or phone is required' },
      { status: 400 }
    );
  }

  const played = Boolean(payload.played);
  const watchedPct = played ? Number(payload.watchedPct) || 0 : 0;
  const tag = played ? watchBucket(watchedPct) : 'video-not-played';

  console.log('[video-engagement] payload:', {
    email,
    phone,
    played,
    watchedPct,
    tag,
    videoId: payload.videoId,
    pageVariant: payload.pageVariant,
  });

  try {
    const { contactId } = await upsertContact({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: hasEmail ? email : undefined,
      phone: hasPhone
        ? `+${phone.length === 10 ? '1' + phone : phone}`
        : undefined,
      // Passed explicitly. upsertContact defaults source to 'apply-now' when
      // omitted, which would overwrite the attribution the form just set.
      source: 'sms-daily-payments',
      // Only this submission's bucket — the other buckets are listed so a
      // re-submission can be cleaned up by a workflow if it ever matters.
      tags: [tag],
    });
    console.log(
      `[video-engagement] GHL upsert OK · contactId=${contactId} · tag=${tag}`
    );

    // The readable version for the advisor. A failure here must not fail the
    // request — the tag, which is the part workflows depend on, is already set.
    try {
      await addContactNote(contactId, buildNote(payload, tag));
    } catch (noteErr) {
      console.warn('[video-engagement] addContactNote failed:', noteErr);
    }

    return NextResponse.json({ ok: true, contactId, tag });
  } catch (err) {
    if (err instanceof GhlError) {
      console.error('[video-engagement] GHL upsert failed:', {
        status: err.status,
        message: err.message,
        body: err.body,
      });
      // Nothing user-facing depends on this call — the lead was already
      // captured by the form itself. Report and move on.
      return NextResponse.json(
        { error: 'Could not record engagement' },
        { status: err.status >= 400 && err.status < 500 ? 400 : 502 }
      );
    }
    console.error('[video-engagement] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
