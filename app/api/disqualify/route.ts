import { NextResponse } from 'next/server';
import { upsertContact, addContactNote, GhlError } from '@/lib/ghl';
import {
  evaluateQualification,
  parseReasonList,
  DISQUALIFIED_TAG,
  MINIMUMS,
  REASON_LABEL,
  type DisqualReason,
} from '@/lib/qualification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Tags an applicant GHL turned away so the matching nurture workflow can pick
// them up. Called from /thanks-for-applying, which is where the Master Form
// sends anyone under the funding minimums.
//
// The caller passes the applicant's answers (fico / monthlyRevenue /
// timeInBusiness) and/or an explicit `reasons` list; both are merged, so this
// works whether the GHL redirect forwards the raw answers or just names the
// reason. Nothing is written to GHL unless at least one reason lands.

interface DisqualifyPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  fico?: string | number;
  monthlyRevenue?: string | number;
  timeInBusiness?: string | number;
  /** Reasons GHL named outright, e.g. ['fico', 'revenue']. */
  reasons?: string[] | string;
  source?: string;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function digitsOnly(s: string) {
  return s.replace(/\D+/g, '');
}

const MINIMUM_TEXT: Record<DisqualReason, string> = {
  fico: `${MINIMUMS.fico} FICO`,
  revenue: `$${MINIMUMS.monthlyRevenue.toLocaleString('en-US')}/mo revenue`,
  tib: `${MINIMUMS.timeInBusinessMonths} months in business`,
};

function buildNote(
  reasons: DisqualReason[],
  answers: Partial<Record<DisqualReason, string>>
): string {
  const lines: string[] = ['Disqualified at the apply-now funnel.'];
  lines.push('');
  for (const reason of reasons) {
    const answer = answers[reason];
    lines.push(
      `${REASON_LABEL[reason]}: ${answer || 'not provided'} (minimum ${MINIMUM_TEXT[reason]})`
    );
  }
  lines.push('');
  lines.push(`Tagged: ${reasons.map((r) => DISQUALIFIED_TAG[r]).join(', ')}`);
  return lines.join('\n');
}

export async function POST(req: Request) {
  let payload: DisqualifyPayload;
  try {
    payload = (await req.json()) as DisqualifyPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = (payload.firstName || '').trim();
  const lastName = (payload.lastName || '').trim();
  const email = (payload.email || '').trim().toLowerCase();
  const phoneRaw = (payload.phone || '').trim();
  const phone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const businessName = (payload.businessName || '').trim();

  // GHL matches the existing contact on email or phone. Without one of them an
  // upsert would create a nameless duplicate, which is worse than no tag.
  const hasEmail = Boolean(email) && isEmail(email);
  const hasPhone = phone.length >= 10;
  if (!hasEmail && !hasPhone) {
    return NextResponse.json(
      { error: 'An email or phone is required to tag the contact' },
      { status: 400 }
    );
  }

  const derived = evaluateQualification({
    fico: payload.fico,
    monthlyRevenue: payload.monthlyRevenue,
    timeInBusiness: payload.timeInBusiness,
  });
  const named = parseReasonList(payload.reasons);
  const reasons = [...new Set([...named, ...derived.reasons])];

  // No readable reason means we don't know which workflow they belong in.
  // Leave the contact alone rather than guessing.
  if (!reasons.length) {
    console.log('[disqualify] no reason determined; skipping GHL write');
    return NextResponse.json({ ok: true, tags: [], reasons: [] });
  }

  const tags = reasons.map((r) => DISQUALIFIED_TAG[r]);

  try {
    const { contactId } = await upsertContact({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: hasEmail ? email : undefined,
      phone: hasPhone
        ? `+${phone.length === 10 ? '1' + phone : phone}`
        : undefined,
      companyName: businessName || undefined,
      source: payload.source || 'apply-now-disqualified',
      tags,
    });
    console.log(
      `[disqualify] tagged contactId=${contactId} · ${tags.join(', ')}`
    );

    // Context for the advisor. A failed note shouldn't cost us the tag.
    try {
      await addContactNote(contactId, buildNote(reasons, derived.answers));
    } catch (noteErr) {
      console.warn('[disqualify] addContactNote failed:', noteErr);
    }

    return NextResponse.json({ ok: true, contactId, tags, reasons });
  } catch (err) {
    if (err instanceof GhlError) {
      console.error('[disqualify] GHL upsert failed:', {
        status: err.status,
        body: err.body,
      });
      return NextResponse.json(
        { error: 'Could not tag the contact' },
        { status: err.status >= 400 && err.status < 500 ? 400 : 502 }
      );
    }
    console.error('[disqualify] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
