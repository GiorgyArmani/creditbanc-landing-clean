'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Icon from '../ui/Icon';

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
  stat?: { value: string; label: string };
  secondaryStat?: { value: string; label: string };
  ctaLabel: string;
  image?: string;
  imageAlt?: string;
}

interface ProgramSet {
  label: string;
  primary: Program;
  side: Program;
  wide: Program;
}

const PROGRAM_SETS: ProgramSet[] = [
  {
    label: 'Foundational',
    primary: {
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
      ctaLabel: 'Learn More',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDtfPh2GVbAf1ZSwDsqv9GNZ96yUEklqMoJXkM6vhKzFiTSp2OurfAFaTIxvrzsFulKa3m4IGET6GeoFVZVbZblfwFz974x1Y8VFNex4QbN8zRgm1L7jzqlU6myl_Bb-d5gdJFaW5O4BNIkDCFCf8hVCcje408P8OVf4ZOtWcMsh-HHdAjblw6782plIxF1Xwp4kOuqevmMbCfy3S2s-gyURWIgIVf9UaZr8M55lnqinujSqQ4zwQX0ZtbQtJl759Jw264NOYNo7aU',
      imageAlt: 'Stack of coins representing SBA government-backed financing',
    },
    side: {
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
      ctaLabel: 'View Options',
    },
    wide: {
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
      stat: { value: '$250k', label: 'Max Funding' },
      secondaryStat: { value: 'Instant', label: 'Decision' },
      ctaLabel: 'Check Eligibility',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLHJ3M7hF-CdJznUP3qmGm9tA6XEmD6DYD21VBAbrXmERtYt4z88Tah4AJbgn98bHP-DJK-jmGR6otffcx7eLvWDs4E2tiZxqyOM69dKZ_vATg-LDx1eGJ_d9MIc4KaayZwvvhOKGOVTvWEncD8Jqq8Z0h7mKJnsboDVWERWy9unj63RH3koPq8I7C5coyLLQA0H84ckB7VsX6uvcMX2qziYn6YK3sS6nZ_tpJDIxGe_u-GY6766K8cI8pg7I7AsHx3h5NaL2E29s',
      imageAlt: 'Small business owner reviewing capital and equipment financing options',
    },
  },
  {
    label: 'Specialty',
    primary: {
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
      ctaLabel: 'Learn More',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDtfPh2GVbAf1ZSwDsqv9GNZ96yUEklqMoJXkM6vhKzFiTSp2OurfAFaTIxvrzsFulKa3m4IGET6GeoFVZVbZblfwFz974x1Y8VFNex4QbN8zRgm1L7jzqlU6myl_Bb-d5gdJFaW5O4BNIkDCFCf8hVCcje408P8OVf4ZOtWcMsh-HHdAjblw6782plIxF1Xwp4kOuqevmMbCfy3S2s-gyURWIgIVf9UaZr8M55lnqinujSqQ4zwQX0ZtbQtJl759Jw264NOYNo7aU',
      imageAlt: 'Business credit and capital reserve illustration',
    },
    side: {
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
      ctaLabel: 'View Options',
    },
    wide: {
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
      stat: { value: '$1M+', label: 'Available' },
      secondaryStat: { value: '5 yr', label: 'Avg Term' },
      ctaLabel: 'Check Eligibility',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLHJ3M7hF-CdJznUP3qmGm9tA6XEmD6DYD21VBAbrXmERtYt4z88Tah4AJbgn98bHP-DJK-jmGR6otffcx7eLvWDs4E2tiZxqyOM69dKZ_vATg-LDx1eGJ_d9MIc4KaayZwvvhOKGOVTvWEncD8Jqq8Z0h7mKJnsboDVWERWy9unj63RH3koPq8I7C5coyLLQA0H84ckB7VsX6uvcMX2qziYn6YK3sS6nZ_tpJDIxGe_u-GY6766K8cI8pg7I7AsHx3h5NaL2E29s',
      imageAlt: 'Business owner reviewing term loan financing',
    },
  },
];

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  open: {
    height: 'auto' as const,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Products() {
  const [setIndex, setSetIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const matchIndex = PROGRAM_SETS.findIndex(
        (s) =>
          s.primary.id === hash || s.side.id === hash || s.wide.id === hash
      );
      if (matchIndex >= 0 && matchIndex !== setIndex) {
        setSetIndex(matchIndex);
        setExpandedId(null);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [setIndex]);

  const activeSet = PROGRAM_SETS[setIndex];

  const goPrev = () => {
    setExpandedId(null);
    setSetIndex((i) => (i - 1 + PROGRAM_SETS.length) % PROGRAM_SETS.length);
  };
  const goNext = () => {
    setExpandedId(null);
    setSetIndex((i) => (i + 1) % PROGRAM_SETS.length);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="solutions"
      className="relative py-32 px-8 bg-surface-container-low overflow-hidden"
    >
      {PROGRAM_SETS.flatMap((s) => [s.primary.id, s.side.id, s.wide.id]).map(
        (id) => (
          <span
            key={id}
            id={id}
            aria-hidden
            className="block absolute -top-24"
          />
        )
      )}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Financial Solutions
          </p>
          <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-secondary-fixed mb-6">
            Different Needs Require Different Funding.{' '}
            <span className="text-primary">(Shocking, We Know.)</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Credit Banc helps business owners compare financing options based
            on what they&rsquo;re trying to do, how fast they need capital, and
            what kind of structure their cash flow can handle.
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {PROGRAM_SETS.map((set, i) => (
              <button
                key={set.label}
                type="button"
                onClick={() => {
                  setExpandedId(null);
                  setSetIndex(i);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  i === setIndex
                    ? 'bg-on-secondary-fixed text-white shadow-lg'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                }`}
              >
                {set.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mr-2">
              {String(setIndex + 1).padStart(2, '0')} /{' '}
              {String(PROGRAM_SETS.length).padStart(2, '0')}
            </span>
            <SliderButton onClick={goPrev} direction="prev" />
            <SliderButton onClick={goNext} direction="next" />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={setIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <PrimaryCard
                program={activeSet.primary}
                isExpanded={expandedId === activeSet.primary.id}
                isAnyExpanded={expandedId !== null}
                onToggle={() => toggleExpand(activeSet.primary.id)}
                index={0}
              />
              <SideCard
                program={activeSet.side}
                isExpanded={expandedId === activeSet.side.id}
                isAnyExpanded={expandedId !== null}
                onToggle={() => toggleExpand(activeSet.side.id)}
                index={1}
              />
              <WideCard
                program={activeSet.wide}
                isExpanded={expandedId === activeSet.wide.id}
                isAnyExpanded={expandedId !== null}
                onToggle={() => toggleExpand(activeSet.wide.id)}
                index={2}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SliderButton({
  onClick,
  direction,
}: {
  onClick: () => void;
  direction: 'prev' | 'next';
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous programs' : 'Next programs'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-11 h-11 rounded-full bg-on-secondary-fixed text-white flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
    >
      <Icon
        name={direction === 'prev' ? 'arrow_back' : 'arrow_forward'}
        className="text-lg"
      />
    </motion.button>
  );
}

function ExpandedContent({ program }: { program: Program }) {
  return (
    <motion.div
      variants={expandVariants}
      initial="collapsed"
      animate="open"
      exit="collapsed"
      className="overflow-hidden"
    >
      <div className="pt-6 mt-6 border-t border-current/10 space-y-5 text-current">
        <p className="leading-relaxed opacity-80">{program.expanded.intro}</p>
        <ul className="space-y-2.5">
          {program.expanded.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm leading-relaxed">
              <Icon
                name="check_circle"
                className="text-primary text-lg shrink-0 mt-0.5"
              />
              <span className="opacity-90">{b}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-lg p-4 bg-current/5 border border-current/10">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
            Best for
          </p>
          <p className="text-sm leading-relaxed opacity-95">
            {program.expanded.bestFor}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ExpandToggle({
  expanded,
  label,
  onClick,
  className = '',
}: {
  expanded: boolean;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ gap: '1rem' }}
      className={`font-bold border-b-2 pb-1 inline-flex items-center gap-2 ${className}`}
    >
      {expanded ? 'Show Less' : label}
      <motion.span
        animate={{ rotate: expanded ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="inline-flex"
      >
        <Icon name="arrow_forward" />
      </motion.span>
    </motion.button>
  );
}

interface CardProps {
  program: Program;
  isExpanded: boolean;
  isAnyExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function PrimaryCard({
  program,
  isExpanded,
  isAnyExpanded,
  onToggle,
  index,
}: CardProps) {
  const colSpan = isExpanded
    ? 'md:col-span-12'
    : isAnyExpanded
      ? 'md:col-span-6'
      : 'md:col-span-8';

  return (
    <motion.div
      layout
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      className={`${colSpan} bg-surface-container-lowest p-12 rounded-xl border transition-colors ${
        isExpanded
          ? 'border-primary/40 shadow-[0_30px_70px_-25px_rgba(0,108,76,0.35)]'
          : 'border-outline-variant/15 hover:border-primary/30'
      }`}
    >
      <motion.div
        layout
        className={`flex flex-col gap-10 ${
          isExpanded ? '' : 'md:flex-row items-center'
        }`}
      >
        <div className="flex-1">
          <Icon
            name={program.icon}
            className="text-4xl text-primary mb-6"
          />
          <h3 className="text-3xl font-bold mb-2 text-on-surface">
            {program.title}
          </h3>
          <p className="text-base font-semibold text-primary mb-4">
            {program.tagline}
          </p>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            {program.body}
          </p>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <div className="text-on-surface mb-8">
                <ExpandedContent program={program} />
              </div>
            )}
          </AnimatePresence>

          <ExpandToggle
            expanded={isExpanded}
            label={program.ctaLabel}
            onClick={onToggle}
            className="text-primary border-primary"
          />
        </div>
        {!isExpanded && program.image && (
          <motion.div
            layout
            className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden grayscale relative"
          >
            <Image
              src={program.image}
              alt={program.imageAlt || program.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SideCard({
  program,
  isExpanded,
  isAnyExpanded,
  onToggle,
  index,
}: CardProps) {
  const colSpan = isExpanded
    ? 'md:col-span-12'
    : isAnyExpanded
      ? 'md:col-span-6'
      : 'md:col-span-4';

  return (
    <motion.div
      layout
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      className={`${colSpan} bg-on-secondary-fixed p-12 rounded-xl text-white flex flex-col justify-between ${
        isExpanded ? 'shadow-[0_30px_70px_-25px_rgba(0,3,33,0.5)]' : ''
      }`}
    >
      <div>
        <Icon
          name={program.icon}
          className="text-4xl text-primary-container mb-6"
        />
        <h3 className="text-3xl font-bold mb-2">{program.title}</h3>
        <p className="text-base font-semibold text-primary-container mb-4">
          {program.tagline}
        </p>
        <p className="text-slate-400 leading-relaxed mb-6">{program.body}</p>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <div className="text-slate-300 mb-8">
              <ExpandedContent program={program} />
            </div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        type="button"
        onClick={onToggle}
        className="signature-gradient text-white w-full py-4 rounded-lg font-bold text-center inline-flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        {isExpanded ? 'Show Less' : program.ctaLabel}
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="inline-flex"
        >
          <Icon name="arrow_forward" />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

function WideCard({ program, isExpanded, onToggle, index }: CardProps) {
  return (
    <motion.div
      layout
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      className={`md:col-span-12 bg-surface-container-highest p-12 rounded-xl border transition-colors ${
        isExpanded
          ? 'border-primary/40 shadow-[0_30px_70px_-25px_rgba(0,108,76,0.35)]'
          : 'border-outline-variant/15'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {!isExpanded && program.image && (
          <motion.div
            layout
            className="order-2 md:order-1 relative aspect-video"
          >
            <Image
              src={program.image}
              alt={program.imageAlt || program.title}
              fill
              className="rounded-xl shadow-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        )}
        <motion.div
          layout
          className={`text-on-surface ${isExpanded ? 'md:col-span-2' : 'order-1 md:order-2'}`}
        >
          <Icon name={program.icon} className="text-4xl text-primary mb-6" />
          <h3 className="text-3xl font-bold mb-2">{program.title}</h3>
          <p className="text-base font-semibold text-primary mb-4">
            {program.tagline}
          </p>
          <p className="text-on-surface-variant mb-6 leading-relaxed">
            {program.body}
          </p>

          {(program.stat || program.secondaryStat) && !isExpanded && (
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
              {program.stat && (
                <motion.div
                  className="p-4 bg-surface-container rounded-lg"
                  whileHover={{ y: -3 }}
                >
                  <p className="text-2xl font-bold text-on-surface">
                    {program.stat.value}
                  </p>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tighter">
                    {program.stat.label}
                  </p>
                </motion.div>
              )}
              {program.secondaryStat && (
                <motion.div
                  className="p-4 bg-surface-container rounded-lg"
                  whileHover={{ y: -3 }}
                >
                  <p className="text-2xl font-bold text-on-surface">
                    {program.secondaryStat.value}
                  </p>
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tighter">
                    {program.secondaryStat.label}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          <AnimatePresence initial={false}>
            {isExpanded && (
              <div className="mb-8">
                <ExpandedContent program={program} />
              </div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={onToggle}
            className="bg-primary text-white px-8 py-4 rounded-lg font-bold inline-flex items-center gap-2"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 18px 35px -12px rgba(0, 108, 76, 0.45)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            {isExpanded ? 'Show Less' : program.ctaLabel}
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="inline-flex"
            >
              <Icon name="arrow_forward" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
