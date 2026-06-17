import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import ScheduleACall from '@/components/ScheduleACall';

export const metadata: Metadata = {
  title: 'Schedule a Call — Credit Banc',
  description:
    'Not sure what you need? Give us 15 minutes. We’ll help you get clear, get strategic, and build a funding plan that fits your business — not the bank’s checklist.',
  alternates: { canonical: '/schedule-a-call' },
  // Marketing/ad landing page — keep it out of organic search so paid traffic
  // is the only way in and the funnel stays clean.
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Schedule a Call | Credit Banc',
    description:
      'Book a free 15-minute strategy call. Get clear, get strategic, and build a funding plan that fits your business.',
    type: 'website',
  },
};

export default function ScheduleACallPage() {
  return (
    <>
      <main className="bg-surface">
        <Suspense fallback={<ScheduleFallback />}>
          <ScheduleACall />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ScheduleFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">
        Loading your calendar…
      </div>
    </div>
  );
}
