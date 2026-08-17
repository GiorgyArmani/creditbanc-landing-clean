import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import ThanksForApplying from '@/components/ThanksForApplying';
import { FloatingSupport } from '@/components/floating-support';

export const metadata: Metadata = {
  title: 'You’re Just Early — Credit Banc',
  description:
    'Not quite at our funding minimums yet? This isn’t a no, it’s a not yet. Grab our free Business Credit Builder Course and the resources our clients use to grow.',
  alternates: { canonical: '/thanks-for-applying' },
  // Funnel branch page — keep it out of search results.
  robots: { index: false, follow: false },
};

// The disqualification reason arrives as a search param on GHL's redirect, and
// the copy below reads it. Render per request so the server and the client
// agree on which minimums the applicant missed.
export const dynamic = 'force-dynamic';

export default function ThanksForApplyingPage() {
  return (
    <>
      <main className="bg-surface">
        {/* Reads the disqualification reason off the GHL redirect's params. */}
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <ThanksForApplying />
        </Suspense>
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
