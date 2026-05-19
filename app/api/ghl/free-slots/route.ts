import { NextResponse } from 'next/server';
import { getFreeSlots, GhlError } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_TZ = 'America/New_York';
const MAX_RANGE_DAYS = 21;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  const timezone = searchParams.get('timezone') || DEFAULT_TZ;

  const now = Date.now();
  let startDate = startParam ? Number(startParam) : now;
  let endDate = endParam
    ? Number(endParam)
    : now + 14 * 24 * 60 * 60 * 1000; // default: next 14 days

  if (!Number.isFinite(startDate) || !Number.isFinite(endDate)) {
    return NextResponse.json(
      { error: 'startDate and endDate must be epoch ms numbers' },
      { status: 400 }
    );
  }
  if (endDate <= startDate) {
    return NextResponse.json(
      { error: 'endDate must be after startDate' },
      { status: 400 }
    );
  }
  // Clamp the requested window so callers can't abuse the proxy.
  const maxEnd = startDate + MAX_RANGE_DAYS * 24 * 60 * 60 * 1000;
  if (endDate > maxEnd) endDate = maxEnd;

  try {
    const days = await getFreeSlots({ startDate, endDate, timezone });
    return NextResponse.json(
      { days, timezone },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    if (err instanceof GhlError) {
      return NextResponse.json(
        { error: err.message, detail: err.body },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 }
      );
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
