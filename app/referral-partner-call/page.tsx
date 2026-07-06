import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import ReferralPartnerCall from '@/components/ReferralPartnerCall';

// Post-referral scheduling page. Reached after the referral form is submitted
// (e.g. /referral-partner-call?referral_partner=ali_ghamlouch). Same page for
// every partner — only the referral_partner param changes, which the embedded
// GHL calendar reads for attribution.
export const metadata: Metadata = {
  title: 'Book Your Call — Credit Banc',
  description:
    'We’ve got your info. Skip the wait and pick a time on the calendar to talk funding options with a dedicated Credit Banc Advisor.',
  alternates: { canonical: '/referral-partner-call' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Book Your Call | Credit Banc',
    description:
      'Pick a time on the calendar to talk funding options with a Credit Banc Advisor.',
    type: 'website',
  },
};

export default function ReferralPartnerCallPage() {
  return (
    <>
      <main className="bg-surface">
        <Suspense fallback={<CallFallback />}>
          <ReferralPartnerCall />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function CallFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">
        Loading your calendar…
      </div>
    </div>
  );
}
