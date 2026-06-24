import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
// Team layout variants — swap which one renders below to compare:
//   AboutTeam        → featured bento (founders large, rest in a gallery)
//   AboutTeamChroma  → React Bits spotlight gallery (cursor reveals color)
import AboutHero from '@/components/sections/AboutHero';
import AboutTeam from '@/components/sections/AboutTeam';
import AboutTeamChroma from '@/components/sections/AboutTeamChroma';
import Spotlight from '@/components/sections/Spotlight';
import CTA from '@/components/sections/CTA';
import { FloatingSupport } from '@/components/floating-support';
import { TEAM_MEMBERS } from '@/lib/team';
import { personLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About Credit Banc — Meet the People Behind the Funding',
  description:
    'Credit Banc is built around real Advisors who help business owners compare options, understand the structure, and choose capital that fits. Meet the team and see us in the press.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Credit Banc | Meet the People Behind the Funding',
    description:
      'Real Advisors who help business owners compare financing options and choose capital that actually fits the move they are trying to make.',
    type: 'website',
  },
};

// Flip this to compare the two team layouts. 'chroma' = React Bits spotlight
// gallery, 'bento' = featured bento.
const TEAM_VARIANT: 'chroma' | 'bento' = 'bento';

// One Person node per team member — ties real, named experts (with their
// LinkedIn / Forbes profiles) to the Credit Banc org for E-E-A-T.
const TEAM_LD = TEAM_MEMBERS.map(personLd);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TEAM_LD) }}
      />
      <Navbar />
      <main className="pt-24">
        <AboutHero />
        {TEAM_VARIANT === 'chroma' ? <AboutTeamChroma /> : <AboutTeam />}
        <Spotlight />
        <CTA />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
