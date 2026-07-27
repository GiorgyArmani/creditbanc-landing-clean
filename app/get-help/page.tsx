import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import GetHelpBooking from '@/components/GetHelpBooking';
import { FloatingSupport } from '@/components/floating-support';

// Simple, no-form scheduling page linked from the nurture email and the
// Business Credit Builder course. Books straight into the main round-robin
// calendar so a stuck student can grab a 15-minute advisor call without
// completing the prequalification form first.
export const metadata: Metadata = {
  title: 'Get Help — Book a Free Call | Credit Banc',
  description:
    'Stuck? Book a free 15-minute call with a Credit Banc advisor for one-on-one help. Additional business credit repair support available too.',
  alternates: { canonical: '/get-help' },
  // Course-only page — shared via the nurture email and inside the Business
  // Credit Builder course, never meant to be found in search.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Stuck? Don’t Stay There. | Credit Banc',
    description:
      'Book a free 15-minute call with a Credit Banc advisor for one-on-one help.',
    type: 'website',
  },
};

export default function GetHelpPage() {
  return (
    <>
      <Navbar />
      <main className="bg-surface">
        <GetHelpBooking />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
