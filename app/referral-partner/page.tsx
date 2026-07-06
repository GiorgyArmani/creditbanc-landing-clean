import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import ReferralPartner from '@/components/ReferralPartner';

// One shared referral landing page. Every partner uses the exact same page —
// the only thing that changes per link is the `referral_partner` URL param
// (e.g. /referral-partner?referral_partner=ali_ghamlouch), which the embedded
// GHL form reads for attribution.
export const metadata: Metadata = {
  title: 'Referral Partner Portal — Credit Banc',
  description:
    'Sent here by a CPA, banker, or consultant? Credit Banc helps business owners sort through funding options, cut through the noise, and figure out what actually makes sense.',
  alternates: { canonical: '/referral-partner' },
  openGraph: {
    title: 'Referral Partner Portal | Credit Banc',
    description:
      'You were sent here for a reason. Explore working capital, SBA loans, lines of credit, and more with a dedicated Credit Banc Advisor.',
    type: 'website',
  },
};

export default function ReferralPartnerPage() {
  return (
    <>
      <main className="bg-surface">
        <Suspense fallback={<ReferralFallback />}>
          <ReferralPartner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ReferralFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">Loading…</div>
    </div>
  );
}
