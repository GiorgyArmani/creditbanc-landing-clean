'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';
import DomeGallery, { type DomeImageItem } from '../ui/DomeGallery';
import CircularGallery from '../ui/CircularGallery';

interface Program {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  body: string;
  expanded: {
    intro: string;
    bullets: string[];
    bestFor: string;
  };
  image: string;
  imageAlt: string;
}

const PROGRAMS: Program[] = [
  {
    id: 'sba',
    icon: 'account_balance',
    title: 'SBA Financing',
    tagline: 'For bigger plans with more moving parts.',
    body: 'Government-backed financing for acquisitions, working capital, commercial real estate, refinancing, startup costs, and long-term growth.',
    expanded: {
      intro:
        'SBA loans are designed for the moves that need patient capital and structure. Lower down payments, longer terms, and rates that reflect your business profile rather than the lender’s risk appetite.',
      bullets: [
        'Loan amounts up to $5M with terms up to 25 years',
        'Use of funds: acquisitions, real estate, working capital, refi',
        'Lower down payment than conventional commercial loans',
        'Designed for established and growing operators',
      ],
      bestFor:
        'Owners ready to acquire a business, buy real estate, or restructure debt with longer-term, lower-payment financing.',
    },
    image: '/advisory.webp',
    imageAlt: 'SBA Financing',
  },
  {
    id: 'real-estate',
    icon: 'domain',
    title: 'Real Estate Financing',
    tagline: 'For deals where the property is doing some of the talking.',
    body: 'Rental property, fix-and-flip, ground-up construction, hard money, commercial mortgage, and owner-occupied financing.',
    expanded: {
      intro:
        'Property-backed financing built around the deal, not just the borrower. From quick close hard money to long-hold rental DSCR loans, we work with lenders who actually understand real estate.',
      bullets: [
        'Rental DSCR, fix-and-flip, ground-up construction, hard money',
        'Commercial mortgage and owner-occupied options',
        'Quick close available on hard money / bridge deals',
        'Programs structured around property cash flow, not personal income',
      ],
      bestFor:
        'Investors and operators with a property in play — acquiring, holding, building, or repositioning.',
    },
    image: '/real%20estate.png',
    imageAlt: 'Real Estate Financing',
  },
  {
    id: 'small-business',
    icon: 'storefront',
    title: 'Small Business Funding',
    tagline: 'For the money stuff owners deal with every week.',
    body: 'Working capital, equipment, lines of credit, term loans, payroll, inventory, short-term gaps, growth needs, or "oh, sh*t" moments.',
    expanded: {
      intro:
        'The everyday capital that keeps the business running and growing. Faster decisions, less paperwork, and structures that fit cash flow rather than fight it.',
      bullets: [
        'Working capital, term loans, lines of credit, equipment financing',
        'Decisions in hours, funding often within 24–48 hours',
        'Payment structures matched to revenue cadence',
        'Stackable with longer-term financing when it makes sense',
      ],
      bestFor:
        'Operators handling payroll, inventory, equipment, growth pushes, or short-term cash-flow gaps.',
    },
    image: '/smallbusinessfunding.png',
    imageAlt: 'Small Business Funding',
  },
  {
    id: 'lines-of-credit',
    icon: 'credit_card',
    title: 'Business Lines of Credit',
    tagline: 'Capital on standby. Pay only for what you actually use.',
    body: 'Revolving lines for unpredictable cash needs — inventory swings, seasonal payroll, opportunistic buys, or just sleeping at night.',
    expanded: {
      intro:
        'A line of credit is the most flexible tool in the toolbox. Draw what you need, pay it down, draw again. We help you size and structure it so it fits how cash actually moves through your business.',
      bullets: [
        'Revolving access up to $500K on qualifying profiles',
        'Interest only on what you draw, not what you’re approved for',
        'Useful for seasonality, payroll smoothing, and quick opportunities',
        'Pairs well with longer-term financing for bigger projects',
      ],
      bestFor:
        'Owners with seasonal swings, lumpy payables, or who want capital ready before they need it.',
    },
    image: '/moneythrow.gif',
    imageAlt: 'Business Lines of Credit',
  },
  {
    id: 'equipment',
    icon: 'precision_manufacturing',
    title: 'Equipment Financing',
    tagline: 'For the gear that pays itself off.',
    body: 'Trucks, machinery, tech, kitchen, medical, and specialty equipment — financed against the asset, not just the balance sheet.',
    expanded: {
      intro:
        'Equipment financing is built around the asset itself, which usually means simpler underwriting, lower down payments, and tax treatment that often works in your favor. New or used. Buy or lease.',
      bullets: [
        'Up to 100% financing on qualifying equipment',
        'Terms typically 24–84 months matched to useful life',
        'New, used, and private-party purchases supported',
        'Section 179 / bonus depreciation often applies',
      ],
      bestFor:
        'Operators expanding capacity, replacing aging gear, or buying revenue-generating assets.',
    },
    image: '/happy%20owner%202.mp4',
    imageAlt: 'Equipment Financing',
  },
  {
    id: 'term-loans',
    icon: 'savings',
    title: 'Term Loans',
    tagline: 'A defined plan with a clear finish line.',
    body: 'Lump-sum financing with fixed payments and a defined term — for projects, expansions, debt restructure, or one-time growth bets.',
    expanded: {
      intro:
        'Term loans are the workhorse of business financing: take a lump sum today, pay it back on a known schedule. Best when you know exactly what the capital is for and what it should produce.',
      bullets: [
        'Fixed payments, fixed term, fully amortizing structures',
        'Loan amounts from $25K up to $1M+ depending on profile',
        'Often used for expansion, build-outs, debt consolidation',
        'Simpler underwriting than SBA when speed matters',
      ],
      bestFor:
        'Owners with a defined project, a known ROI, and a desire to avoid open-ended debt.',
    },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLHJ3M7hF-CdJznUP3qmGm9tA6XEmD6DYD21VBAbrXmERtYt4z88Tah4AJbgn98bHP-DJK-jmGR6otffcx7eLvWDs4E2tiZxqyOM69dKZ_vATg-LDx1eGJ_d9MIc4KaayZwvvhOKGOVTvWEncD8Jqq8Z0h7mKJnsboDVWERWy9unj63RH3koPq8I7C5coyLLQA0H84ckB7VsX6uvcMX2qziYn6YK3sS6nZ_tpJDIxGe_u-GY6766K8cI8pg7I7AsHx3h5NaL2E29s',
    imageAlt: 'Term Loans',
  },
];

export default function Products() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const match = PROGRAMS.find((p) => p.id === hash);
      if (match) setOpenId(match.id);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (openId) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openId]);

  const galleryItems: DomeImageItem[] = PROGRAMS.map((p) => ({
    src: p.image,
    alt: p.title,
    id: p.id,
    label: p.title,
  }));

  const openProgram = openId
    ? PROGRAMS.find((p) => p.id === openId) ?? null
    : null;

  return (
    <section
      id="solutions"
      className="relative bg-surface-container-low overflow-hidden"
    >
      {PROGRAMS.map((p) => (
        <span
          key={p.id}
          id={p.id}
          aria-hidden
          className="block absolute -top-24"
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 sm:pt-28 md:pt-32 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Financial Solutions
          </p>
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-secondary-fixed mb-6 max-w-5xl">
            Different Needs Require Different Funding.{' '}
            <motion.span
              className="text-primary inline-block origin-bottom-left"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: [-8, 5, -3, 1, 0],
              }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                opacity: { delay: 0.55, duration: 0.35 },
                scale: {
                  delay: 0.55,
                  duration: 0.55,
                  type: 'spring',
                  stiffness: 320,
                  damping: 14,
                },
                rotate: {
                  delay: 0.55,
                  duration: 0.85,
                  times: [0, 0.3, 0.6, 0.85, 1],
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              (Shocking, We Know.)
            </motion.span>
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <Icon name="open_with" className="text-primary text-base" />
              <span className="md:hidden">Swipe to explore.</span>
              <span className="hidden md:inline">Drag the dome to explore.</span>
            </span>
            <span className="hidden md:inline text-on-surface-variant/30">
              |
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="touch_app" className="text-primary text-base" />
              Tap any program to see how it works, what it&rsquo;s for, and who
              it fits.
            </span>
          </p>
        </motion.div>
      </div>

      <div className="relative w-screen h-[460px] md:hidden bg-on-secondary-fixed">
        <CircularGallery
          items={PROGRAMS.filter(
            (p) => !/\.(mp4|webm|mov|m4v)(\?|$)/i.test(p.image)
          ).map((p) => ({
            image: p.image,
            text: p.title.toUpperCase(),
            id: p.id,
          }))}
          bend={1}
          textColor="#ffffff"
          borderRadius={0.06}
          font="900 32px Manrope, system-ui, sans-serif"
          scrollSpeed={2}
          scrollEase={0.05}
          onItemClick={(id) => setOpenId(id)}
        />
      </div>

      <div className="relative w-screen h-[760px] lg:h-[900px] xl:h-[1100px] hidden md:block">
        <DomeGallery
          images={galleryItems}
          grayscale={true}
          overlayBlurColor="#f4f3f1"
          imageBorderRadius="12px"
          openedImageBorderRadius="20px"
          fit={1}
          minRadius={1080}
          maxVerticalRotationDeg={7}
          segments={14}
          dragDampening={2}
          onItemClick={(id) => setOpenId(id)}
        />
      </div>

      <AnimatePresence>
        {openProgram && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 bg-on-secondary-fixed/70 backdrop-blur-sm"
              onClick={() => setOpenId(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="program-title"
              className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-surface-container-lowest rounded-[28px] shadow-2xl overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative flex-1 overflow-y-auto overscroll-contain">
                <div className="sticky top-0 z-20 h-0 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Close"
                    className="pointer-events-auto absolute top-4 right-4 w-10 h-10 rounded-full bg-on-secondary-fixed/60 hover:bg-on-secondary-fixed/80 text-white backdrop-blur-sm flex items-center justify-center transition-colors shadow-md"
                  >
                    <Icon name="close" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-square md:aspect-auto md:min-h-[420px] bg-on-secondary-fixed">
                  {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(openProgram.image) ? (
                    <video
                      src={openProgram.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={openProgram.image}
                      alt={openProgram.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="object-cover"
                      unoptimized={openProgram.image.endsWith('.gif')}
                    />
                  )}
                  <div className="absolute inset-0 bg-on-secondary-fixed/15 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                      <Icon
                        name={openProgram.icon}
                        className="text-on-primary-container text-2xl"
                      />
                    </div>
                    <div className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-container">
                      Credit Banc Program
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <h3
                    id="program-title"
                    className="font-headline text-3xl font-extrabold text-on-surface mb-2"
                  >
                    {openProgram.title}
                  </h3>
                  <p className="text-base font-semibold text-primary mb-5">
                    {openProgram.tagline}
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    {openProgram.body}
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    {openProgram.expanded.intro}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {openProgram.expanded.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm leading-relaxed text-on-surface"
                      >
                        <Icon
                          name="check_circle"
                          className="text-primary text-lg shrink-0 mt-0.5"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg p-4 bg-primary-container/15 border border-primary/10 mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                      Best for
                    </p>
                    <p className="text-sm leading-relaxed text-on-surface">
                      {openProgram.expanded.bestFor}
                    </p>
                  </div>
                  <a
                    href="https://creditbanc.io/apply-now"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Check Eligibility
                    <Icon name="arrow_forward" />
                  </a>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
