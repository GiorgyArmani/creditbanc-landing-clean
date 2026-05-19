import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import ApplyNowFunnel from '@/components/ApplyNowFunnel';

export const metadata: Metadata = {
  title: 'Schedule Your Call — Credit Banc',
  description:
    'Lock in your 15-minute call with a Credit Banc advisor. No pitch deck, no script — just an honest read on your numbers and the right capital structure.',
  alternates: { canonical: '/apply-now' },
  openGraph: {
    title: 'Schedule Your Call | Credit Banc',
    description:
      'Book your 15-min advisor call with Credit Banc. Honest read on your numbers, no pitch deck.',
    type: 'website',
  },
};

export default function ApplyNowPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 bg-surface">
        <Suspense fallback={<ApplyFallback />}>
          <ApplyNowFunnel />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ApplyFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">Loading your details…</div>
    </div>
  );
}
