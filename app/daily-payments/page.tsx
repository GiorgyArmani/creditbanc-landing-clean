import type { Metadata } from 'next';
import Footer from '@/components/sections/Footer';
import McaFunnel from '@/components/McaFunnel';
import {
  flattenParams,
  resolveCta,
  resolveVariant,
  resolveVideo,
} from '@/lib/mca-funnel';

// SMS → landing funnel for owners already carrying a merchant cash advance.
// Copy, video cut, and CTA label are all URL-selected (see lib/mca-funnel.ts),
// which is what makes the A/B split a matter of which link the blast sends.
//
// noindex on purpose: five near-identical copy variants of one page is exactly
// the duplicate-content shape search engines penalize, and organic traffic
// would contaminate the test anyway. This page is not in the sitemap either.
export const metadata: Metadata = {
  title: 'Daily MCA Payments? See Your Options — Credit Banc',
  description:
    'Still making daily or weekly merchant cash advance payments? See whether you may qualify to replace high-frequency payments with a better-structured financing option.',
  alternates: { canonical: '/daily-payments' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Still making daily or weekly MCA payments? | Credit Banc',
    description:
      'See whether you may qualify to replace high-frequency payments with a better-structured financing option.',
    type: 'website',
  },
};

export default async function DailyPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Resolved on the server so the right headline is in the first HTML byte.
  // A client-side variant swap would flash the control first, which is both a
  // bad first impression off an SMS tap and a dirty measurement.
  const params = await searchParams;

  // The variant owns its video, so resolve the variant first and let ?vid=
  // override it only when a link explicitly names one.
  const variant = resolveVariant(params.v);

  return (
    <>
      <McaFunnel
        variant={variant}
        videoKey={resolveVideo(params.vid, variant)}
        ctaKey={resolveCta(params.cta)}
        params={flattenParams(params)}
      />
      <Footer />
    </>
  );
}
