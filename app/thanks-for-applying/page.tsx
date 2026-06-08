import type { Metadata } from 'next';
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

export default function ThanksForApplyingPage() {
  return (
    <>
      <main className="bg-surface">
        <ThanksForApplying />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
