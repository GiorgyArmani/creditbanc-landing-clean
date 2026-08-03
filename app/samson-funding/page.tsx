import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import SamsonFunding from '@/components/SamsonFunding';

// Co-branded referral landing page for Samson Funding. Same shape and same GHL
// form as /referral-partner — the difference is Samson's branding and a baked-in
// referral_partner=samson_funding attribution, so a bare link still attributes.
// A rep-specific ?referral_partner= override still wins.
//
// noindex: the page carries a third party's name and mark and is only ever
// reached from Samson's own links, so it should not compete in search.
export const metadata: Metadata = {
  title: 'Samson Funding × Credit Banc — Business Funding With Up to 10-Year Terms',
  description:
    'Samson Funding has partnered with Credit Banc to give business owners access to a nationwide lender network: lines of credit, equipment financing, A/R factoring, SBA loans, term loans, and more.',
  alternates: { canonical: '/samson-funding' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Samson Funding × Credit Banc | More Ways to Fund Your Business',
    description:
      'Explore working capital, equipment financing, lines of credit, SBA loans, debt consolidation, and commercial real estate financing with a dedicated Credit Banc Advisor.',
    type: 'website',
  },
};

export default function SamsonFundingPage() {
  return (
    <>
      {/* No Navbar. This is a standalone landing page Samson sends traffic to —
          the Credit Banc site nav would only pull visitors out of the flow. The
          co-brand lockup at the top of the hero serves as the header. */}
      <main className="bg-surface">
        <Suspense fallback={<SamsonFallback />}>
          <SamsonFunding />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function SamsonFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">Loading…</div>
    </div>
  );
}
