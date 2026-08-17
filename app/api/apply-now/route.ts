import { NextResponse } from 'next/server';
import { upsertContact, createAppointment, GhlError } from '@/lib/ghl';
import { evaluateQualification } from '@/lib/qualification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ApplyPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  notes?: string;
  slot?: string; // ISO start time with offset
  timezone?: string;
  source?: string;
  // Qualification (collected from the apply funnel):
  loanAmount?: string;
  fico?: string;
  monthlyRevenue?: string;
  timeInBusiness?: string;
  // Calculator context (optional, included in note for advisor):
  gap?: string | number;
  target?: string | number;
  risk?: string;
  score?: string | number;
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function digitsOnly(s: string) {
  return s.replace(/\D+/g, '');
}

function buildNote(p: ApplyPayload): string {
  const lines: string[] = ['Apply-now funnel submission.'];
  if (p.businessName) lines.push(`Business: ${p.businessName}`);

  // Qualification block — what the advisor needs to read first.
  const qual: string[] = [];
  if (p.loanAmount) qual.push(`Loan amount: ${p.loanAmount}`);
  if (p.fico) qual.push(`FICO: ${p.fico}`);
  if (p.monthlyRevenue) qual.push(`Monthly revenue: ${p.monthlyRevenue}`);
  if (p.timeInBusiness) qual.push(`Time in business: ${p.timeInBusiness}`);
  if (qual.length) {
    lines.push('');
    lines.push('-- Qualification --');
    lines.push(...qual);
  }

  if (p.notes) {
    lines.push('');
    lines.push(`Notes: ${p.notes}`);
  }

  const calc: string[] = [];
  if (p.target) calc.push(`Target ${p.target}`);
  if (p.gap) calc.push(`Gap ${p.gap}`);
  if (p.risk) calc.push(`Risk ${p.risk}`);
  if (p.score) calc.push(`Readiness ${p.score}/100`);
  if (calc.length) {
    lines.push('');
    lines.push(`Calculator: ${calc.join(' · ')}`);
  }
  return lines.join('\n');
}

export async function POST(req: Request) {
  let payload: ApplyPayload;
  try {
    payload = (await req.json()) as ApplyPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = (payload.firstName || '').trim();
  const lastName = (payload.lastName || '').trim();
  const email = (payload.email || '').trim().toLowerCase();
  const phoneRaw = (payload.phone || '').trim();
  const phone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const businessName = (payload.businessName || '').trim();
  const slot = (payload.slot || '').trim();

  if (!firstName) {
    return NextResponse.json({ error: 'First name is required' }, { status: 400 });
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (!phone || phone.length < 10) {
    return NextResponse.json({ error: 'A valid phone is required' }, { status: 400 });
  }
  if (!slot) {
    return NextResponse.json(
      { error: 'Please pick an available time slot' },
      { status: 400 }
    );
  }

  // Build qualification-derived tags so GHL workflows can route on them.
  const qualTags: string[] = ['apply-now-funnel'];
  if (payload.loanAmount) qualTags.push(`loan: ${payload.loanAmount}`);
  if (payload.fico) qualTags.push(`fico: ${payload.fico}`);
  if (payload.monthlyRevenue)
    qualTags.push(`revenue: ${payload.monthlyRevenue}`);
  if (payload.timeInBusiness) qualTags.push(`tib: ${payload.timeInBusiness}`);

  // Under the minimums? Tag the reason so the nurture workflow picks them up
  // (lib/qualification.ts). Same tags the /thanks-for-applying branch writes.
  qualTags.push(
    ...evaluateQualification({
      fico: payload.fico,
      monthlyRevenue: payload.monthlyRevenue,
      timeInBusiness: payload.timeInBusiness,
    }).tags
  );

  try {
    const { contactId } = await upsertContact({
      firstName,
      lastName: lastName || undefined,
      email,
      phone: `+${phone.length === 10 ? '1' + phone : phone}`,
      companyName: businessName || undefined,
      source: payload.source || 'apply-now',
      tags: qualTags,
      notes: buildNote(payload),
    });

    const appointment = await createAppointment({
      contactId,
      startTime: slot,
      title: `15-min advisor call · ${firstName}${lastName ? ' ' + lastName : ''}`,
      notes: buildNote(payload),
    });

    return NextResponse.json({
      ok: true,
      contactId,
      appointmentId: appointment.id,
      startTime: appointment.startTime || slot,
      endTime: appointment.endTime,
    });
  } catch (err) {
    if (err instanceof GhlError) {
      // Surface 4xx as user-friendly; 5xx as generic.
      const isClient = err.status >= 400 && err.status < 500;
      return NextResponse.json(
        {
          error: isClient
            ? 'We couldn’t book that slot. Please pick another time.'
            : 'Something went wrong on our side. Try again in a moment.',
          detail: err.body,
        },
        { status: isClient ? 409 : 502 }
      );
    }
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
