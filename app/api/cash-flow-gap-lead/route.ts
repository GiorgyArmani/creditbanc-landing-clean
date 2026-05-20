import { NextResponse } from 'next/server';
import { upsertContact, GhlError } from '@/lib/ghl';

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
  let payload: CashFlowGapLeadPayload;
  try {
    payload = (await req.json()) as CashFlowGapLeadPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const firstName = (payload.firstName || '').trim();
  const email = (payload.email || '').trim().toLowerCase();
  const phoneRaw = (payload.phone || '').trim();
  const phone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const businessName = (payload.businessName || '').trim();

  if (!firstName) {
    return NextResponse.json(
      { error: 'First name is required' },
      { status: 400 }
    );
  }
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: 'A valid email is required' },
      { status: 400 }
    );
  }
  if (!phone || phone.length < 10) {
    return NextResponse.json(
      { error: 'A valid phone is required' },
      { status: 400 }
    );
  }

  try {
    const { contactId } = await upsertContact({
      firstName,
      email,
      phone: `+${phone.length === 10 ? '1' + phone : phone}`,
      companyName: businessName || undefined,
      source: 'cash-flow-gap',
      tags: ['cash-flow-gap'],
      notes: buildNote(payload),
    });

    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    if (err instanceof GhlError) {
      const isClient = err.status >= 400 && err.status < 500;
      return NextResponse.json(
        {
          error: isClient
            ? 'We couldn’t save your info. Please double-check and try again.'
            : 'Something went wrong on our side. Try again in a moment.',
        },
        { status: isClient ? 400 : 502 }
      );
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
