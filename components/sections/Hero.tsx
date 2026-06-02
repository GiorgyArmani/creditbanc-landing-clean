'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import Counter from '../ui/Counter';
import TextType from '../ui/TextType';
import CLoader from '../ui/CLoader';
import { ROUTES } from '@/lib/site';
import { useMediaQuery } from '@/lib/useMediaQuery';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Hero loop assets live in /public/Hero Video. Mobile cycles the lighter
// three to keep bandwidth in check; desktop plays the full five.
const HERO_ASSETS_BASE = [
  { src: '/Hero%20Video/3.mp4', alt: 'Business owner success moment' },
  { src: '/Hero%20Video/5.mp4', alt: 'Operations on the move after funding' },
  { src: '/Hero%20Video/4.mp4', alt: 'Funded business in motion' },
];

const HERO_ASSETS_DESKTOP = [
  ...HERO_ASSETS_BASE,
  { src: '/Hero%20Video/1.mp4', alt: 'Advisor conversation with a business owner' },
  { src: '/Hero%20Video/2.mp4', alt: 'Capital deployed for business growth' },
];

const HERO_INTERVAL_MS = 9000;

// Cards render at 1500px+ in a smaller, fixed size. Each `left` clamps the
// peek-out: at narrower viewports `calc(-50vw + 780px)` pushes the card
// inside the circle so it never overlaps the heading column; on wider
// viewports the negative px target lets the card peek out the left side.
const CARD_POSITIONS = [
  { top: '58%', left: 'max(-129px, calc(-50vw + 780px))' },
  { top: '36%', left: 'max(-166px, calc(-50vw + 780px))' },
  { top: '14%', left: 'max(-92px, calc(-50vw + 780px))' },
  { top: '44%', left: 'max(-37px, calc(-50vw + 780px))' },
];

// Mobile mini-cards: one small chip per hero index, alternating between
// top-right and bottom-left of the loader. Just the headline value + a
// short label — no progress bars, paragraphs, or bullets.
const MOBILE_CARD_CONTENT = [
  { value: '$500K', label: 'Up to · 24hr' },
  { value: '$10M', label: 'Long Term Capital' },
  { value: 'One-on-One', label: 'Direct Advisor' },
  { value: 'Multi', label: 'Funding Programs' },
];

const MOBILE_CARD_POSITIONS = [
  { top: '6%', right: '-4%', left: 'auto', bottom: 'auto' },
  { bottom: '10%', left: '-4%', top: 'auto', right: 'auto' },
  { top: '6%', right: '-4%', left: 'auto', bottom: 'auto' },
  { bottom: '10%', left: '-4%', top: 'auto', right: 'auto' },
] as const;

function CardEyebrow({
  icon,
  title,
  note,
  iconBg = 'bg-primary-container',
  iconColor = 'text-on-primary-container',
}: {
  icon: string;
  title: string;
  note: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon name={icon} className={iconColor} />
      </div>
      <div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
          {title}
        </p>
        <p className="text-xs text-on-surface-variant font-semibold">{note}</p>
      </div>
    </div>
  );
}

function renderHeroCard(index: number) {
  switch (index) {
    case 0:
      return (
        <>
          <CardEyebrow
            icon="bolt"
            title="Funded in 24 hours"
            note="No collateral for qualifying businesses"
          />
          <div className="flex items-baseline justify-between mb-3">
            <Counter
              stops={[10, 50, 150, 500]}
              prefix="$"
              suffix="K"
              duration={5}
              delay={0.4}
              times={[0, 0.25, 0.55, 0.8, 1]}
              className="text-4xl font-black text-on-surface tracking-tight tabular-nums"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Up to
            </span>
          </div>
          <div className="relative h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 signature-gradient rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: ['0%', '2%', '10%', '30%', '100%'] }}
              transition={{
                duration: 5,
                delay: 0.4,
                times: [0, 0.25, 0.55, 0.8, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {[2, 10, 30].map((pct) => (
              <span
                key={pct}
                aria-hidden
                className="absolute top-1/2 -translate-y-1/2 h-2.5 w-px bg-on-surface/15"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <span>$10K</span>
            <span>$500K</span>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <CardEyebrow
            icon="schedule"
            title="Long Term Capital Solutions"
            note=""
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-4xl font-black text-on-surface tracking-tight tabular-nums">
              $10M
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Up to
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant mb-3">
            10-year terms, monthly 
            payments & competitive rates.
          </p>
          <div className="flex flex-wrap gap-2">
            {['SBA', 'Term Loans'].map((chip) => (
              <span
                key={chip}
                className="px-2.5 py-1 rounded-full bg-primary-container/40 text-[10px] font-bold uppercase tracking-widest text-on-primary-container"
              >
                {chip}
              </span>
            ))}
          </div>
        </>
      );
    case 2:
      return (
        <>
          <CardEyebrow
            icon="support_agent"
            title="Direct Advisor Access"
            note=""
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-3xl font-black text-on-surface tracking-tight">
              One-on-One Support
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant mb-4">
            Talk through your options with a real advisor &mdash; not a call
            center script reader.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-on-surface">
            <Icon name="check_circle" className="text-primary text-base" />
            No chatbot handoffs.
          </div>
        </>
      );
    case 3:
    default:
      return (
        <>
          <CardEyebrow
            icon="apps"
            title="Not a One-Trick Lender"
            note=""
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-3xl font-black text-on-surface tracking-tight">
              Multiple Funding Programs
            </span>
          </div>
      
          <div className="flex flex-wrap gap-2">
            {['SBA', 'Equipment', 'LOC', 'Real Estate'].map((chip) => (
              <span
                key={chip}
                className="px-2.5 py-1 rounded-full bg-primary-container/40 text-[10px] font-bold uppercase tracking-widest text-on-primary-container"
              >
                {chip}
              </span>
            ))}
          </div>
        </>
      );
  }
}

export default function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  // xl: 1280px+
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  // Cards show at 1500x925 and up. Below that (smaller laptops) the
  // loader carries the hero on its own. Cards stay at a single smaller
  // size at all visible widths; the clamp on each card's `left` keeps it
  // inside the circle on narrower screens and lets it peek out on wider.
  const isWideDesktop = useMediaQuery(
    '(min-width: 1500px) and (min-height: 925px)'
  );
  // Skip the heavy 2.4 MB GIF on mobile — only cycle the 3 lighter images.
  const heroAssets = isDesktop ? HERO_ASSETS_DESKTOP : HERO_ASSETS_BASE;

  // Gate loader rendering until after hydration. useMediaQuery defaults
  // to false on SSR/first paint, so without this the mobile loader
  // briefly renders on desktop before snapping to the desktop layout —
  // visible as a small flash of the hero circle at viewport center.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset to the first asset whenever the asset set changes (e.g. mobile
  // ↔ desktop swap). The loader itself drives index advancement via its
  // animation onComplete, so no setInterval is needed here.
  useEffect(() => {
    setHeroIndex(0);
  }, [heroAssets.length]);

  return (
    <section className="relative min-h-[640px] sm:min-h-[760px] xl:h-[calc(100vh-6rem)] xl:max-h-[860px] flex items-center px-6 sm:px-8 pt-8 pb-16 overflow-clip bg-surface">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-center">
        <motion.div
          className="xl:col-span-6 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="font-headline text-5xl md:text-6xl xl:text-[5.5rem] 2xl:text-[6.5rem] font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95] mb-6"
          >
            Funding Is Our Favorite{' '}
            <span className="relative inline-block px-3 text-white">
              <motion.span
                aria-hidden
                className="absolute inset-y-1 left-0 right-0 bg-primary-container rounded-sm -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ originX: 0 }}
              />
              <span className="relative">F Word</span>
            </span>
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="font-headline text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold tracking-tight text-on-secondary-fixed mb-6 min-h-[2.5rem] xl:max-w-none"
          >
            <TextType
              as="span"
              text={[
                'Fast matters. Fit matters more.',
                'Less guessing. Better funding.',
                'Real Advisors. Real options.',
                'Capital that actually fits.',
              ]}
              typingSpeed={55}
              deletingSpeed={25}
              pauseDuration={2200}
              initialDelay={1800}
              cursorClassName="text-primary font-normal"
            />
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg xl:text-xl 2xl:text-2xl text-on-surface-variant max-w-xl xl:max-w-none mb-8 leading-relaxed"
          >
            Get working capital for growth, payroll, inventory, equipment, or
            cash-flow gaps, with monthly payment options and real Advisor
            guidance. Because <em>&ldquo;you&rsquo;re approved&rdquo;</em> is
            not the same as <em>&ldquo;this is a good idea.&rdquo;</em>
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.a
              href={ROUTES.apply}
              className="bg-on-secondary-fixed text-primary-fixed px-10 py-5 rounded-lg font-bold text-base inline-block"
              whileHover={{
                scale: 1.04,
                boxShadow: '0 22px 40px -12px rgba(0, 3, 33, 0.4)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              Get Funded
            </motion.a>
          </motion.div>
        </motion.div>
        {isMounted && !isDesktop && (
          <div className="flex justify-center w-full">
            <div
              className="relative"
              style={{ width: 'min(90vw, 460px)', aspectRatio: '1 / 1' }}
            >
              <CLoader
                assets={heroAssets}
                intervalMs={HERO_INTERVAL_MS}
                size={460}
                index={heroIndex}
                onIndexChange={setHeroIndex}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  style={
                    MOBILE_CARD_POSITIONS[
                      heroIndex % MOBILE_CARD_POSITIONS.length
                    ]
                  }
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute z-20 bg-[#fdf8e8] px-3.5 py-2 rounded-xl shadow-[0_0_0_1px_rgba(32,37,54,0.05),0_0_18px_-4px_rgba(32,37,54,0.12),0_16px_32px_-10px_rgba(32,37,54,0.30)] border border-outline-variant/25"
                >
                  <p className="font-headline text-xl font-black text-on-surface tracking-tight tabular-nums leading-none">
                    {
                      MOBILE_CARD_CONTENT[
                        heroIndex % MOBILE_CARD_CONTENT.length
                      ].value
                    }
                  </p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mt-1">
                    {
                      MOBILE_CARD_CONTENT[
                        heroIndex % MOBILE_CARD_CONTENT.length
                      ].label
                    }
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {isMounted && isDesktop && (
        <div
          className="absolute z-0"
          style={{
            top: '50%',
            right: 0,
            width: 920,
            height: 920,
            transform: 'translate(15%, -50%)',
          }}
        >
          <CLoader
            assets={HERO_ASSETS_DESKTOP}
            intervalMs={HERO_INTERVAL_MS}
            size={920}
            index={heroIndex}
            onIndexChange={setHeroIndex}
          />
          {isWideDesktop && (
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                style={{
                  top: CARD_POSITIONS[heroIndex % CARD_POSITIONS.length].top,
                  left: CARD_POSITIONS[heroIndex % CARD_POSITIONS.length].left,
                }}
                initial={{ opacity: 0, y: 32, rotate: -8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
                exit={{ opacity: 0, y: -16, rotate: 2, scale: 0.94 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 0, y: -4 }}
                className="absolute z-20 w-60 bg-[#fdf8e8] p-5 rounded-xl shadow-[0_0_0_1px_rgba(32,37,54,0.05),0_0_24px_-4px_rgba(32,37,54,0.12),0_28px_50px_-12px_rgba(32,37,54,0.30)] border border-outline-variant/25"
              >
                {renderHeroCard(heroIndex % CARD_POSITIONS.length)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
      <div
        aria-hidden
        className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl -z-10"
      />
    </section>
  );
}
