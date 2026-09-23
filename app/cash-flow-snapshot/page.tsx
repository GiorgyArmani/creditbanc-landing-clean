import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CashFlowGapCalculator from '@/components/CashFlowGapCalculator';
import { ROUTES, SITE } from '@/lib/site';

// Ad-review build of /cash-flow-gap: same calculator, tool-first framing.
// No site nav, no footer link farm, no apply pathway. The only exits are the
// privacy policy and an optional call booked inline on the results.
//
// noindex on purpose: it duplicates /cash-flow-gap, which is the page search
// should rank. Not in the sitemap either.
export const metadata: Metadata = {
  title: 'Cash Flow Gap Calculator — Free Planning Tool',
  description:
    'Free cash flow planning tool. See whether money going out over the next 90 days outpaces money coming in, and get a snapshot of your numbers by email.',
  alternates: { canonical: '/cash-flow-snapshot' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Cash Flow Gap Calculator | Credit Banc',
    description:
      'See whether money going out over the next 90 days outpaces money coming in.',
    type: 'website',
  },
};

export default function CashFlowSnapshotPage() {
  return (
    <>
      <header className="bg-surface border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 sm:h-20 flex items-center">
          {/* Brand mark only, deliberately not a link back into the site. */}
          <Image
            src="/powered-by-shield.png"
            alt="Credit Banc, Powered by Shield Advisory Group"
            width={1128}
            height={191}
            priority
            unoptimized
            className="h-9 sm:h-11"
            style={{ width: 'auto' }}
          />
        </div>
      </header>
      <main>
        <CashFlowGapCalculator variant="tool" />
      </main>
      <footer className="bg-on-secondary-fixed px-6 sm:px-8 py-8 text-xs text-white/55">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Credit Banc. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={ROUTES.privacy} className="hover:text-white">
              Privacy Policy
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-white">
              {SITE.email}
            </a>
            <a href={SITE.phoneTel} className="hover:text-white">
              {SITE.phone}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
