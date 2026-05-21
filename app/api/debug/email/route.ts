// Dev-only diagnostic: GET /api/debug/email
//   → verifies SMTP creds with nodemailer.verify()
// POST /api/debug/email { "to": "you@example.com" }
//   → sends a minimal test email so we can confirm delivery end-to-end

import { NextResponse } from 'next/server';
import {
  verifyTransporter,
  sendCashflowResultEmail,
  describeSmtpConfig,
} from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function guard(): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug endpoints disabled in production' },
      { status: 404 }
    );
  }
  return null;
}

export async function GET() {
  const blocked = guard();
  if (blocked) return blocked;
  const result = await verifyTransporter();
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  const body = (await req.json().catch(() => ({}))) as { to?: string };
  const to = body.to;
  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to" in body', config: describeSmtpConfig() },
      { status: 400 }
    );
  }
  try {
    await sendCashflowResultEmail({
      firstName: 'Debug',
      email: to,
      results: {
        gap: 12500,
        target: 75000,
        risk: 'Elevated',
        score: 62,
      },
    });
    return NextResponse.json({
      ok: true,
      sentTo: to,
      config: describeSmtpConfig(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        config: describeSmtpConfig(),
      },
      { status: 500 }
    );
  }
}
