import { NextResponse } from 'next/server';
import { upsertContact, addContactNote, GhlError } from '@/lib/ghl';
import { sendCashflowResultEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CashFlowGapLeadPayload {
  firstName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  // Optional calculator context — included in the contact note so the
  // advisor can see what the user was looking at when they handed off.
  gap?: string | number;
  surplus?: string | number;
  target?: string | number;
  totalCashIn?: string | number;
  totalCashNeeded?: string | number;
  risk?: string;
  score?: string | number;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function digitsOnly(s: string) {
  return s.replace(/\D+/g, '');
}

function buildNote(p: CashFlowGapLeadPayload): string {
  const lines: string[] = ['Cash Flow Gap calculator — lead capture.'];
  if (p.businessName) lines.push(`Business: ${p.businessName}`);

  const calc: string[] = [];
  if (p.target) calc.push(`Target ${p.target}`);
  if (p.gap) calc.push(`Gap ${p.gap}`);
  if (p.risk) calc.push(`Risk ${p.risk}`);
  if (p.score !== undefined && p.score !== null && p.score !== '')
    calc.push(`Readiness ${p.score}/100`);
  if (calc.length) {
    lines.push('');
    lines.push(`Calculator: ${calc.join(' · ')}`);
  }
  return lines.join('\n');
}

export async function POST(req: Request) {
  console.log('[cash-flow-gap-lead] ────── POST ──────');
  let payload: CashFlowGapLeadPayload;
  try {
    payload = (await req.json()) as CashFlowGapLeadPayload;
  } catch {
    console.warn('[cash-flow-gap-lead] invalid JSON body');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  console.log('[cash-flow-gap-lead] payload:', {
    firstName: payload.firstName,
    email: payload.email,
    phone: payload.phone,
    businessName: payload.businessName,
    gap: payload.gap,
    target: payload.target,
    risk: payload.risk,
    score: payload.score,
  });

  // The lead-gate form collects a single "name" string, but GHL stores
  // first/last separately. Split on the first whitespace: everything
  // before is the first name, everything after is the last name.
  const fullName = (payload.firstName || '').trim().replace(/\s+/g, ' ');
  const firstSpace = fullName.indexOf(' ');
  const firstName =
    firstSpace === -1 ? fullName : fullName.slice(0, firstSpace);
  const lastName = firstSpace === -1 ? '' : fullName.slice(firstSpace + 1);
  const email = (payload.email || '').trim().toLowerCase();
  const phoneRaw = (payload.phone || '').trim();
  const phone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const businessName = (payload.businessName || '').trim();

  if (!firstName) {
    console.warn('[cash-flow-gap-lead] validation: missing firstName');
    return NextResponse.json(
      { error: 'First name is required' },
      { status: 400 }
    );
  }
  if (!email || !isEmail(email)) {
    console.warn('[cash-flow-gap-lead] validation: invalid email', email);
    return NextResponse.json(
      { error: 'A valid email is required' },
      { status: 400 }
    );
  }
  if (!phone || phone.length < 10) {
    console.warn('[cash-flow-gap-lead] validation: invalid phone', phone);
    return NextResponse.json(
      { error: 'A valid phone is required' },
      { status: 400 }
    );
  }

  try {
    const { contactId } = await upsertContact({
      firstName,
      lastName: lastName || undefined,
      email,
      phone: `+${phone.length === 10 ? '1' + phone : phone}`,
      companyName: businessName || undefined,
      source: 'cash-flow-gap',
    });
    console.log(
      `[cash-flow-gap-lead] GHL upsert OK · contactId=${contactId} · email=${email}`
    );

    // Attach the calculator context as a note so advisors see it in GHL.
    // Failure here shouldn't kill the lead capture — log and continue.
    try {
      await addContactNote(contactId, buildNote(payload));
      console.log('[cash-flow-gap-lead] GHL note added');
    } catch (noteErr) {
      console.warn(
        '[cash-flow-gap-lead] addContactNote failed:',
        noteErr
      );
    }

    // Fire the result email. Don't block the response on email delivery.
    try {
      await sendCashflowResultEmail({
        firstName,
        email,
        businessName: businessName || undefined,
        results: {
          gap: payload.gap,
          surplus: payload.surplus,
          target: payload.target,
          totalCashIn: payload.totalCashIn,
          totalCashNeeded: payload.totalCashNeeded,
          risk: payload.risk,
          score: payload.score,
        },
      });
      console.log(`[cash-flow-gap-lead] email sent to ${email}`);
    } catch (emailErr) {
      console.error(
        '[cash-flow-gap-lead] sendCashflowResultEmail failed:',
        emailErr
      );
    }

    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    if (err instanceof GhlError) {
      console.error('[cash-flow-gap-lead] GHL upsert failed:', {
        status: err.status,
        message: err.message,
        body: err.body,
        payload: {
          firstName,
          email,
          phone,
          businessName,
        },
      });
      const isClient = err.status >= 400 && err.status < 500;
      return NextResponse.json(
        {
          error: isClient
            ? 'We couldn’t save your info. Please double-check and try again.'
            : 'Something went wrong on our side. Try again in a moment.',
          debug:
            process.env.NODE_ENV !== 'production'
              ? { status: err.status, body: err.body }
              : undefined,
        },
        { status: isClient ? 400 : 502 }
      );
    }
    console.error('[cash-flow-gap-lead] Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
