'use client';

import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  Mic,
  Star,
  Youtube,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { SITE, SOCIAL } from '@/lib/site';
import { readStickyContact } from '@/lib/sticky-contact';
import {
  ANSWER_PARAMS,
  MINIMUMS,
  REASON_LABEL,
  evaluateQualification,
  parseReasonList,
  type DisqualReason,
} from '@/lib/qualification';

// --- Outbound links ---------------------------------------------------------
const LINKS = {
  // Free planning tool we hand early-stage leads instead of a hard "no".
  calculator: '/cash-flow-gap',
  youtube: SOCIAL.youtube,
  newsletter: 'https://theweeklyfromshieldadvisory.substack.com',
  podcast: 'https://theliquidlunchproject.com',
} as const;

const CALCULATOR_BULLETS = [
  'Estimate your short-term cash flow gap',
  'See a suggested funding target',
  'Get a readiness score before you talk to a lender',
];

// The minimums, in the order we show them. Text is derived from
// lib/qualification.ts so the page and the routing tags can't drift apart.
const CRITERIA: Array<{ reason: DisqualReason; label: string }> = [
  {
    reason: 'revenue',
    label: `At least $${Math.round(MINIMUMS.monthlyRevenue / 1000)}K/month in revenue`,
  },
  {
    reason: 'tib',
    label: `${MINIMUMS.timeInBusinessMonths}+ months in business`,
  },
  { reason: 'fico', label: `A minimum FICO score of ${MINIMUMS.fico}` },
];

// Reasons GHL may name outright on the redirect, e.g. ?dq=fico,revenue
const REASON_PARAMS = ['dq', 'reason', 'reasons', 'disqualified'];

// Contact fields the GHL redirect can carry, so the tag lands on the right
// person even when sessionStorage is unavailable.
const CONTACT_PARAMS: Record<string, string[]> = {
  firstName: ['firstName', 'first_name'],
  lastName: ['lastName', 'last_name'],
  email: ['email'],
  phone: ['phone'],
  businessName: ['businessName', 'business_name', 'company_name'],
};

/**
 * Works out why the applicant was turned away, and tells GHL. The applicant's
 * answers ride in on the redirect from the Master Form; we read them, tag the
 * contact so the right nurture workflow fires, and hand the reasons back so the
 * page can name the actual gap instead of listing all three minimums.
 */
function useDisqualReasons(): DisqualReason[] {
  const params = useSearchParams();
  const sent = useRef(false);

  // Derived during render, not in an effect, so the copy below never flashes
  // the generic version first.
  const { answers, reasons } = useMemo(() => {
    const found = {
      fico: pickParam(params, ANSWER_PARAMS.fico),
      monthlyRevenue: pickParam(params, ANSWER_PARAMS.revenue),
      timeInBusiness: pickParam(params, ANSWER_PARAMS.tib),
    };
    return {
      answers: found,
      reasons: [
        ...new Set([
          ...parseReasonList(pickParam(params, REASON_PARAMS)),
          ...evaluateQualification(found).reasons,
        ]),
      ],
    };
  }, [params]);

  useEffect(() => {
    // Effects run twice in React strict mode; the tag call should not.
    if (sent.current || !reasons.length) return;

    const sticky = readStickyContact();
    const contact = {
      firstName: pickParam(params, CONTACT_PARAMS.firstName) || sticky.firstName,
      lastName: pickParam(params, CONTACT_PARAMS.lastName) || sticky.lastName,
      email: pickParam(params, CONTACT_PARAMS.email) || sticky.email,
      phone: pickParam(params, CONTACT_PARAMS.phone) || sticky.phone,
      businessName: pickParam(params, CONTACT_PARAMS.businessName),
    };
    // Without an identifier the tag has nowhere to land. GHL's own workflow
    // still has the contact, so this is a best-effort assist, never a blocker.
    if (!contact.email && !contact.phone) return;

    sent.current = true;
    fetch('/api/disqualify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contact, ...answers, reasons }),
    }).catch(() => {
      // Nothing useful to show the applicant here. GHL remains the system of
      // record; a failed tag just means the workflow is triggered manually.
    });
  }, [params, answers, reasons]);

  return reasons;
}

/** First non-empty value among `keys`. GHL field query keys vary by form. */
function pickParam(params: URLSearchParams, keys: string[]): string {
  for (const key of keys) {
    const value = params.get(key);
    if (value && value.trim()) return value.trim();
  }
  return '';
}

interface Channel {
  id: string;
  Icon: typeof Youtube;
  label: string;
  body: string;
  cta: string;
  href: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'youtube',
    Icon: Youtube,
    label: 'YouTube',
    body: 'Real advice from real experts. Matt, Luigi, and the Credit Banc team share quick, no-nonsense tips on funding, strategy, and growth — basically, everything business owners need to scale smarter and stress less.',
    cta: 'Watch the Latest',
    href: LINKS.youtube,
  },
  {
    id: 'newsletter',
    Icon: Mail,
    label: 'The Newsletter',
    body: 'Every Friday, we send the insights smart business owners actually use: funding trends, tax moves, and growth strategies you can act on now. It’s the one email that could change how you run your business.',
    cta: 'Join the List',
    href: LINKS.newsletter,
  },
  {
    id: 'podcast',
    Icon: Mic,
    label: 'The Podcast',
    body: 'Part business school, part bar stool. Each Wednesday, Matt and Luigi sit down with entrepreneurs, investors, and industry pros to talk money, mistakes, and momentum.',
    cta: 'Listen & Subscribe',
    href: LINKS.podcast,
  },
];

// Shared motion ---------------------------------------------------------------
const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const inView = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.4 },
} as const;

/** "monthly revenue and time in business" from the reasons we found. */
function reasonSentence(reasons: DisqualReason[]): string {
  const labels = reasons.map((r) => REASON_LABEL[r]);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

/** Lead-in to the "not yet." stamp, scaled to how much they're missing. */
function closingLine(reasons: DisqualReason[]): string {
  if (reasons.length === 1) {
    return 'You may be closer than you think. Either way, this is not a no forever. It’s a ';
  }
  if (reasons.length === 2) {
    return 'You may be close on one of these and need a little more time on the other. Either way, this is not a no forever. It’s a ';
  }
  return 'You may be close on one of these. You may need a little more time on all three. Either way, this is not a no forever. It’s a ';
}

export default function ThanksForApplying() {
  const reasons = useDisqualReasons();
  const knowsWhy = reasons.length > 0;

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* 1. The "not yet" message — cream                                  */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-surface px-6 sm:px-8 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24">
        {/* Soft drifting brand glow behind the headline. */}
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, -20, 0], y: [0, 20, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative max-w-3xl mx-auto text-center"
          variants={stagger}
          {...inView}
        >
          {/* Reassuring "we got it" pill */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-on-primary-container"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Application received
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-secondary-fixed leading-[1.05]"
          >
            You&rsquo;re Not Rejected.
            <br className="hidden sm:block" />{' '}
            <span className="text-on-secondary-fixed">You&rsquo;re Just </span>
            <motion.span
              className="text-primary inline-block origin-bottom"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: [-8, 5, -3, 1, 0] }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                opacity: { delay: 0.5, duration: 0.35 },
                scale: {
                  delay: 0.5,
                  type: 'spring',
                  stiffness: 320,
                  damping: 14,
                },
                rotate: { delay: 0.5, duration: 0.85, ease: EASE },
              }}
            >
              Early.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-xl sm:text-2xl font-bold text-primary"
          >
            Thanks for reaching out to Credit Banc.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            {knowsWhy ? (
              <>
                Based on what you shared, your {reasonSentence(reasons)}{' '}
                {reasons.length > 1 ? 'aren’t' : 'isn’t'}{' '}
                <em>quite</em>{' '}
                at our minimums right now. Here&rsquo;s what we need to see:
              </>
            ) : (
              <>
                Based on what you shared, your business isn&rsquo;t{' '}
                <em>quite</em> at our minimums right now. In most cases, we need
                to see:
              </>
            )}
          </motion.p>

          <motion.ul
            variants={fadeUp}
            className="mx-auto mt-6 max-w-md space-y-3 text-left"
          >
            {CRITERIA.map(({ reason, label }) => {
              // Only call out a miss when we actually know why they're here.
              const missed = reasons.includes(reason);
              return (
                <li
                  key={reason}
                  className="flex items-start gap-3 text-base sm:text-lg text-on-surface"
                >
                  {missed ? (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-on-surface-variant" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  )}
                  <span className={missed ? 'text-on-surface-variant' : ''}>
                    {label}
                    {missed && (
                      <span className="ml-2 inline-block rounded-full border border-outline-variant/60 px-2 py-0.5 align-middle text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                        Keep building
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </motion.ul>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-lg sm:text-xl text-on-surface"
          >
            {closingLine(reasons)}
            {/* "not yet" stamps onto the page like a rubber stamp hitting paper */}
            <motion.span
              className="inline-block rounded-md border-2 border-primary px-2.5 py-0.5 font-extrabold text-primary"
              initial={{ scale: 1.8, opacity: 0, rotate: -12 }}
              whileInView={{ scale: 1, opacity: 1, rotate: -3 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 11,
                delay: 0.15,
              }}
            >
              not yet.
            </motion.span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            A lot of our strongest clients were once exactly where you are right
            now. Keep building revenue, let a little more time stack up, work on
            keeping credit in range, and come back when you&rsquo;re there.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-headline text-lg sm:text-xl font-bold text-on-secondary-fixed"
          >
            We&rsquo;ll be happy to take another look.
          </motion.p>

          {/* Bouncing cue that connects to the freebie below */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col items-center gap-1 text-on-surface-variant"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              First, grab this
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 2. "But before you go…" — Cash Flow Gap Calculator (emerald)       */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden px-6 sm:px-8 py-20 sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0d3b2a 0%, #165e44 55%, #2ea878 100%)',
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-5xl mx-auto">
          <motion.div className="text-center" variants={stagger} {...inView}>
            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            >
              Before you go&hellip;
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto"
            >
              Instead of sending you off with a shrug, here&rsquo;s a free tool
              to help you plan the next move:{' '}
              <strong className="text-white">
                our Cash Flow Gap Calculator.
              </strong>
            </motion.p>
           
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="mt-12 rounded-[28px] bg-surface-container-lowest shadow-2xl overflow-hidden grid md:grid-cols-2"
          >
            {/* Visual panel */}
            <div className="relative min-h-[240px] md:min-h-full flex items-center justify-center bg-on-secondary-fixed p-10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="relative flex flex-col items-center text-center text-white">
                {/* Calculator gently floats with a pulsing ring */}
                <div className="relative">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary/40"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Calculator className="h-10 w-10 text-on-secondary-fixed" />
                  </motion.div>
                </div>
                <p className="mt-6 font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Free Planning Tool
                </p>
                <p className="mt-2 font-headline text-2xl font-extrabold">
                  Cash Flow Gap Calculator
                </p>
              </div>
            </div>

            {/* Content panel */}
            <div className="p-8 sm:p-10">
              <div className="flex gap-1 text-primary mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -45 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.25 + i * 0.09,
                      type: 'spring',
                      stiffness: 320,
                      damping: 12,
                    }}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </motion.span>
                ))}
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface mb-5">
                In about 60 seconds, you&rsquo;ll:
              </h3>
              <motion.ul
                className="space-y-3 mb-8"
                variants={stagger}
                {...inView}
              >
                {CALCULATOR_BULLETS.map((b) => (
                  <motion.li
                    key={b}
                    variants={fadeUp}
                    className="flex items-start gap-3 text-sm sm:text-base text-on-surface"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.a
                href={LINKS.calculator}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary text-on-secondary-fixed px-8 py-4 rounded-lg font-bold uppercase tracking-wide text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                Open the Calculator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 3. "Build Smarter While You Build Bigger" — cream                 */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-surface px-6 sm:px-8 py-20 sm:py-28">
        <motion.div
          aria-hidden
          className="absolute -bottom-24 right-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-6xl mx-auto">
          <motion.div className="text-center" variants={stagger} {...inView}>
            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-on-secondary-fixed"
            >
              Build Smarter While You Build Bigger
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto"
            >
              If you want to stay sharp while you grow, here are a few places our
              clients hang out:
            </motion.p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((channel, i) => (
              <motion.div
                key={channel.id}
                className="group flex h-full flex-col rounded-2xl bg-surface-container-lowest border border-surface-variant shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 22px 40px -20px rgba(32,37,54,0.45)' }}
              >
                <div className="flex items-center gap-3 bg-on-secondary-fixed px-6 py-5">
                  <motion.span
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0"
                    whileHover={{ rotate: [0, -12, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <channel.Icon className="h-5 w-5 text-on-secondary-fixed" />
                  </motion.span>
                  <span className="font-headline text-lg font-bold text-white">
                    {channel.label}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {channel.body}
                  </p>
                  <a
                    href={channel.href}
                    target={
                      channel.href.startsWith('http') ? '_blank' : undefined
                    }
                    rel={
                      channel.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="mt-6 inline-flex items-center gap-2 self-start bg-primary text-on-secondary-fixed px-6 py-3 rounded-lg font-bold text-sm transition-transform hover:scale-[1.03]"
                  >
                    {channel.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-on-surface-variant">
              Questions in the meantime? Call an Advisor at{' '}
              <a
                href={SITE.phoneTel}
                className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
              >
                {SITE.phone}
              </a>
              . (We don&rsquo;t bite. Promise.)
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
