'use client';

// Team section — ChromaGrid variant (React Bits spotlight gallery).
// Same data/intro/popup as AboutTeam; swap the import in app/about/page.tsx to
// compare. Cards desaturate until the cursor spotlight reveals their color.

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import TextType from '../ui/TextType';
import ChromaGrid, { type ChromaItem } from '../ui/ChromaGrid';
import { TEAM_MEMBERS } from '@/lib/team';

export default function AboutTeamChroma() {
  const items: ChromaItem[] = useMemo(
    () =>
      TEAM_MEMBERS.map((m) => {
        const li = m.socials?.find((s) => s.type === 'linkedin');
        return {
          image: m.photo ?? '',
          title: m.name,
          subtitle: m.role,
          handle: li ? 'in' : undefined,
          url: li?.href,
        };
      }),
    []
  );

  return (
    <section id="team" className="relative px-6 sm:px-8 py-20 sm:py-28 bg-surface">
      <div
        aria-hidden
        className="absolute -left-40 top-32 w-96 h-96 rounded-full bg-primary-container/15 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto">
        {/* Intro */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-secondary-fixed leading-[1.02] mb-6">
            Meet the People
            <br />
            Behind the Funding!
          </h1>
          <div className="space-y-4 text-lg sm:text-xl text-on-surface-variant leading-relaxed">
            <p>
              Business funding can get complicated fast. Terms, timing,
              repayment, cash flow, use of funds, fine print…you get the picture.
            </p>
            <p>
              That&rsquo;s why Credit Banc is built around real Advisors who help
              business owners compare options, understand the structure, and
              choose capital that actually fits the move they are trying to make.
            </p>
          </div>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed mt-8 min-h-[2.25rem]">
            <TextType
              as="span"
              text="Fast is nice."
              typingSpeed={45}
              initialDelay={300}
              loop={false}
              showCursor={false}
            />{' '}
            <TextType
              as="span"
              className="text-primary"
              text="Smart is better."
              typingSpeed={45}
              initialDelay={920}
              loop={false}
              cursorClassName="text-primary font-normal"
            />
          </p>
        </motion.div>

        {/* Spotlight gallery */}
        <motion.div
          className="mt-14 sm:mt-20 [--cols:2] sm:[--cols:3] lg:[--cols:4]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChromaGrid items={items} radius={300} rows={[2, 4, 4]} />
        </motion.div>
      </div>
    </section>
  );
}
