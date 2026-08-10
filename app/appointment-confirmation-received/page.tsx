import type { Metadata } from 'next';
import Footer from '@/components/sections/Footer';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import { FloatingSupport } from '@/components/floating-support';

// End of the apply-now funnel. The GHL booking calendar redirects here after a
// slot is confirmed, so the path must match the calendar's "thank you page"
// URL exactly. `/appointment-confirmation` is aliased to this route in
// next.config.js for older calendar configs that still point at the short path.
export const metadata: Metadata = {
  title: 'You’re Booked — Credit Banc',
  description:
    'Your 15-minute call with a Credit Banc Advisor is confirmed. Here’s what to expect before we talk.',
  alternates: { canonical: '/appointment-confirmation-received' },
  // Post-conversion funnel page — keep it out of search results.
  robots: { index: false, follow: false },
};

// GHL appends the booking details to the calendar's redirect URL, but the exact
// keys vary by calendar config, so read the common shapes. Same defensive
// aliasing as the prefill in components/BookWithCreditBanc.tsx.
function pick(
  params: Record<string, string | string[] | undefined>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = params[key];
    const str = Array.isArray(value) ? value[0] : value;
    if (str && str.trim()) return str.trim();
  }
  return '';
}

export default async function AppointmentConfirmationReceivedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Read the booking details on the server so the confirmation itself is in the
  // first paint. Reading them client-side (useSearchParams) would opt the whole
  // page out of prerendering and show the client a loading state right after
  // they booked.
  const params = await searchParams;

  const first =
    pick(params, 'first_name', 'firstName') ||
    pick(params, 'full_name', 'name').split(' ')[0] ||
    '';
  const greetingName = first
    ? first.charAt(0).toUpperCase() + first.slice(1)
    : '';

  const startRaw = pick(
    params,
    'event_start_time',
    'start_time',
    'startTime',
    'selected_slot'
  );

  return (
    <>
      <main className="bg-surface">
        <AppointmentConfirmation
          greetingName={greetingName}
          startRaw={startRaw}
        />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
