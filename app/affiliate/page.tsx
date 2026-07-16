import type { Metadata } from 'next';
import Footer from '@/components/sections/Footer';
import AffiliateClub from '@/components/AffiliateClub';

export const metadata: Metadata = {
  title: 'The "I Know Someone" Club — Refer a Business Owner, Earn $500',
  description:
    'Everyone knows a small business owner. Share your link, and if we can help them get funded, we’ll send you a $500 gift card of your choice. No limit on referrals.',
  alternates: { canonical: '/affiliate' },
  openGraph: {
    title: 'Join the "I Know Someone" Club | Credit Banc',
    description:
      'Share your link with the business owners you know. If their deal funds through Credit Banc, you earn a $500 gift card of your choice.',
    type: 'website',
  },
};

export default function AffiliatePage() {
  return (
    <>
      <main className="bg-surface">
        <AffiliateClub />
      </main>
      <Footer />
    </>
  );
}
