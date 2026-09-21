import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import BookWithCreditBanc from '@/components/BookWithCreditBanc';
import { FloatingSupport } from '@/components/floating-support';
import OpenAIConversion from '@/components/OpenAIConversion';
import { LEAD_EVENT_AT } from '@/lib/openai-pixel';

export const metadata: Metadata = {
  title: 'Book Your Call — Credit Banc',
  description:
    'You’re pre-qualified. Pick a time with a Credit Banc advisor — your details are already filled in. 15 minutes, an honest read on your numbers, no pitch deck.',
  alternates: { canonical: '/book-with-creditbanc' },
  // Funnel page reached after qualifying — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function BookWithCreditBancPage() {
  return (
    <>
      {/* GHL only redirects here once an application clears our funding
          minimums, so reaching this page is the qualified-lead conversion.
          Switched off when the install is configured to count at submit time
          instead (lib/openai-pixel.ts). */}
      {LEAD_EVENT_AT === 'booking' && (
        <OpenAIConversion event="lead_created" onceKey="lead" />
      )}
      <Navbar />
      <main className="bg-surface">
        <Suspense fallback={<BookFallback />}>
          <BookWithCreditBanc />
        </Suspense>
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}

function BookFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">
        Loading your calendar…
      </div>
    </div>
  );
}
