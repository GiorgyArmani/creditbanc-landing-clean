'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { MotionConfig, motion, type Variants } from 'framer-motion';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import VideoFacade from '@/components/ui/VideoFacade';
import { readAttribution } from '@/lib/attribution';
import { onStickyContact } from '@/lib/sticky-contact';
import {
  CTA_LABELS,
  FUNNEL_VIDEOS,
  PREQUAL_FORM_HEIGHT,
  PREQUAL_FORM_ID,
  PREQUAL_FORM_NAME,
  WATCH_MILESTONES,
  funnelFormFields,
  type CtaKey,
  type FunnelVariant,
  type VideoKey,
} from '@/lib/mca-funnel';

// The /daily-payments funnel. Structure follows the brief exactly:
// headline → 3 benefits → video → CTA → credibility → CTA. The video is
// supporting evidence, not a toll booth — the offer and the form are reachable
// without ever pressing play.

const EASE = [0.22, 1, 0.36, 1] as const;
const FORM_ANCHOR = 'qualify';

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// Held constant across every copy variant so the ?v= test measures the
// headline and nothing else.
const BENEFITS = [
  {
    label: 'One monthly payment',
    body: 'Replace daily and weekly withdrawals with a single payment a month, if you qualify.',
  },
  {
    label: 'Terms measured in years',
    body: 'Programs run up to 10 years instead of 6 to 12 months, so the payment fits the month.',
  },
  {
    label: 'An advisor reads your file',
    body: 'One person looks at your actual numbers and tells you whether this fits. Or whether it does not.',
  },
];

const STEPS = [
  {
    icon: CalendarDays,
    title: 'Answer a few questions',
    body: 'Revenue, time in business, and what you are paying now. Nothing you need to dig for.',
  },
  {
    icon: Phone,
    title: 'An advisor calls you',
    body: 'A real person, usually the same business day. They will ask about the advances you are carrying.',
  },
  {
    icon: UserRound,
    title: 'You see the real options',
    body: 'Or you hear an honest "not yet," and what would need to change. Either way you know where you stand.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is this a new loan, or does it pay off my advance?',
    a: 'Depending on what you qualify for, it can be either. Some options refinance the balance you are carrying, some consolidate several advances into one payment, and some add capital on top. Your advisor walks through which one your numbers support.',
  },
  {
    q: 'Will checking my options affect my credit?',
    a: 'No. Prequalifying with Credit Banc uses a soft review. If a lender needs a hard pull later, your advisor tells you before anything moves forward.',
  },
  {
    q: 'I have more than one MCA. Does that disqualify me?',
    a: 'Not automatically. Stacked advances are common, and they are often the reason people end up on this page. It does affect which programs are open to you, which is exactly what the call is for.',
  },
  {
    q: 'How fast does this move?',
    a: 'The form is short and an advisor typically reaches out the same business day. Timelines after that depend on the program and the documentation involved.',
  },
  {
    q: 'What does it cost to find out?',
    a: 'Nothing. There is no fee to prequalify and no fee to talk to an advisor. You are not committed to anything by asking.',
  },
];

interface McaFunnelProps {
  variant: FunnelVariant;
  videoKey: VideoKey;
  ctaKey: CtaKey;
  /** Everything the server read off the URL, forwarded to the form embed. */
  params: Record<string, string>;
}

export default function McaFunnel({
  variant,
  videoKey,
  ctaKey,
  params,
}: McaFunnelProps) {
  const ctaLabel = CTA_LABELS[ctaKey];
  const video = FUNNEL_VIDEOS[videoKey];
  const isPortrait = video.orientation === 'vertical';
  const engagement = useVideoEngagement({ variant, video });

  const videoBlock = (
    <VideoFacade
      youtubeId={video.youtubeId}
      title={video.title}
      duration={video.duration}
      orientation={video.orientation}
      autoplay
      milestones={WATCH_MILESTONES}
      onPlay={engagement.handlePlay}
      onProgress={engagement.handleProgress}
      className="w-full"
    />
  );

  return (
    // reducedMotion="user" makes every framer transition below honor the OS
    // setting without each component having to check for it.
    <MotionConfig reducedMotion="user">
      <FunnelHeader ctaLabel={ctaLabel} />

      <main className="bg-surface">
        {/* ------------------------------------------------------------------
            HERO — headline, 3 benefits, video, CTA.
            The layout follows the cut's shape: a portrait frame takes the right
            column on desktop (a 9:16 video stacked in-flow would push the CTA
            off the first screen), while a 16:9 frame sits full width inside a
            centred column, which is where a wide composition reads best.
        ------------------------------------------------------------------ */}
        <section className="relative overflow-clip px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-primary-container/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          />

          {/* Portrait uses explicit grid placement rather than source order:
              on desktop the video holds the right column across both rows while
              the copy and CTA stack down the left. On mobile the grid collapses
              to one column and DOM order becomes the reading order the brief
              asks for — headline, benefits, video, CTA. Landscape is that same
              order in a single centred column throughout. */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className={`relative mx-auto ${
              isPortrait
                ? 'grid max-w-6xl gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-14'
                : 'max-w-3xl text-center'
            }`}
          >
            <div
              className={
                isPortrait
                  ? 'text-center lg:col-start-1 lg:row-start-1 lg:text-left'
                  : ''
              }
            >
              {/* Headline leads the page. leading-[1.12] rather than a
                  tighter figure because the accent's marker bar is a full
                  line-box tall: under 1.0 the bar collides with the
                  descenders on the line above it. */}
              <motion.h1
                variants={fadeUp}
                className="font-headline text-[2.5rem] font-extrabold leading-[1.12] tracking-tighter text-on-secondary-fixed sm:text-5xl xl:text-6xl"
              >
                {variant.headline}{' '}
                {/* Marker sweep. `isolation: isolate` gives the bar its own
                    stacking context — a bare `-z-10` sends it behind the
                    page background instead of behind the text, which reads
                    as white-on-cream (i.e. invisible). */}
                <span
                  className="relative inline-block px-2 text-white"
                  style={{ isolation: 'isolate' }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 right-0 rounded-sm bg-primary-container"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, delay: 0.65, ease: EASE }}
                    style={{ originX: 0, zIndex: 0 }}
                  />
                  <span className="relative" style={{ zIndex: 1 }}>
                    {variant.headlineAccent}
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className={`mt-5 text-lg leading-relaxed text-on-surface-variant sm:text-xl ${
                  isPortrait ? 'max-w-2xl' : 'mx-auto max-w-2xl'
                }`}
              >
                {variant.subheadline}
              </motion.p>

              {/* 3 benefits — the offer, stated before anyone presses play. */}
              <motion.ul
                variants={stagger}
                className={`mt-9 grid gap-4 text-left ${
                  isPortrait ? '' : 'sm:grid-cols-3'
                }`}
              >
                {BENEFITS.map((benefit) => (
                  <motion.li
                    key={benefit.label}
                    variants={fadeUp}
                    className="flex gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-[0_16px_40px_-30px_rgba(32,37,54,0.6)]"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container"
                    >
                      <Check
                        className="h-3.5 w-3.5 text-on-primary-container"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-headline text-base font-extrabold leading-snug text-on-secondary-fixed">
                        {benefit.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-on-surface-variant">
                        {benefit.body}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Video. Supporting evidence, not a toll booth — everything
                needed to convert is already above and below it. */}
            <motion.div
              variants={fadeUp}
              className={
                isPortrait
                  ? 'mx-auto w-full max-w-[290px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:max-w-none'
                  : 'mt-10'
              }
            >
              {videoBlock}
            </motion.div>

            <div
              className={
                isPortrait
                  ? 'text-center lg:col-start-1 lg:row-start-2 lg:text-left'
                  : ''
              }
            >
              <motion.div
                variants={fadeUp}
                className={`flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center ${
                  isPortrait ? 'lg:justify-start' : 'mt-9'
                }`}
              >
                <PrimaryCta label={ctaLabel} />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className={`mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-on-surface-variant ${
                  isPortrait ? 'lg:justify-start' : ''
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                  No impact to your credit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" aria-hidden />
                  No obligation
                </span>
              </motion.p>
            </div>
          </motion.div>
        </section>

        <PaymentRhythm ctaLabel={ctaLabel} />


        {/* ------------------------------------------------------------------
            FORM — the prequalification flow, with the process beside it so
            nobody has to guess what submitting sets in motion.
        ------------------------------------------------------------------ */}
        <section
          id={FORM_ANCHOR}
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="lg:sticky lg:top-24"
            >
              <motion.h2
                variants={fadeUp}
                className="font-headline text-3xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-4xl"
              >
                What happens after you submit
              </motion.h2>
              <motion.ol variants={stagger} className="mt-8 space-y-6">
                {STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.li
                      key={step.title}
                      variants={fadeUp}
                      className="flex gap-4"
                    >
                      <span
                        aria-hidden
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container"
                      >
                        <StepIcon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                          Step {i + 1}
                        </span>
                        <span className="mt-1 block font-headline text-lg font-extrabold leading-snug text-on-secondary-fixed">
                          {step.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-on-surface-variant">
                          {step.body}
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ol>

              <motion.p
                variants={fadeUp}
                className="mt-8 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5 text-sm leading-relaxed text-on-surface-variant"
              >
                Credit Banc is a financing advisory, not a lender. Programs,
                terms, and availability depend on lender approval and on your
                business&rsquo;s revenue, time in business, and existing
                obligations. Nothing here is an offer of credit.
              </motion.p>
            </motion.div>

            <div>
              <div className="mb-5">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  Prequalification
                </p>
                <h3 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-3xl">
                  Start here. It&rsquo;s short.
                </h3>
              </div>
              <PrequalForm
                params={params}
                fields={funnelFormFields({ variant, videoKey, ctaKey })}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------- FAQ ---------------------------- */}
        <section className="bg-surface-container-low px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-headline text-3xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-4xl"
            >
              The questions everyone asks
            </motion.h2>
            <div className="mt-8 divide-y divide-outline-variant/50 border-y border-outline-variant/50">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------- CLOSING CTA ------------------------- */}
        <section
          className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
          style={{
            background:
              'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 78%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 78%)',
            }}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl font-extrabold tracking-tighter text-white sm:text-5xl"
            >
              Find out where you stand.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85"
            >
              No fee to check, no hard credit pull, no obligation to move
              forward. Worst case, you learn exactly where your business stands.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9">
              <PrimaryCta label={ctaLabel} tone="light" />
            </motion.div>
          </motion.div>
        </section>
      </main>

      <StickyCta label={ctaLabel} />

      {/* GHL's resize bridge for the embedded form. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </MotionConfig>
  );
}

// ---------------------------------------------------------------------------
// Video engagement → GHL.
//
// Watch depth is only useful if it can be attached to a person, and the only
// moment an anonymous viewer becomes one is form submit. The GHL form iframe
// broadcasts the contact to the parent page at exactly that moment, so we hold
// the watch numbers here and pair them with that broadcast when it arrives.
//
// Everything lives in refs: the player samples once a second, and none of it
// should re-render the page.
// ---------------------------------------------------------------------------
function useVideoEngagement({
  variant,
  video,
}: {
  variant: FunnelVariant;
  video: (typeof FUNNEL_VIDEOS)[VideoKey];
}) {
  const maxPctRef = useRef(0);
  const playedRef = useRef(false);
  const sentRef = useRef(false);

  const handlePlay = useCallback(() => {
    playedRef.current = true;
    pushDataLayer({ event: 'video_play', video_id: video.youtubeId });
  }, [video.youtubeId]);

  const handleProgress = useCallback(
    (pct: number) => {
      maxPctRef.current = Math.max(maxPctRef.current, pct);
      pushDataLayer({
        event: 'video_progress',
        video_id: video.youtubeId,
        percent: pct,
      });
    },
    [video.youtubeId]
  );

  useEffect(() => {
    return onStickyContact((contact) => {
      // The broadcast can repeat (GHL re-emits on some widget versions) and a
      // second POST would double-tag the contact.
      if (sentRef.current) return;
      sentRef.current = true;

      const body = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        played: playedRef.current,
        watchedPct: Math.round(maxPctRef.current),
        videoId: video.youtubeId,
        videoTitle: video.title,
        pageVariant: variant.name,
      };

      pushDataLayer({
        event: 'form_submit',
        page_variant: variant.name,
        video_id: video.youtubeId,
        percent: body.watchedPct,
      });

      // GHL creates the contact from the form at this same instant. A short
      // delay lets that land first, so this upsert matches an existing record
      // instead of racing it.
      window.setTimeout(() => {
        // keepalive so the request survives the redirect GHL performs after
        // a submit — a normal fetch would be cancelled with the page.
        fetch('/api/video-engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true,
        }).catch(() => {
          // Best-effort telemetry. The lead itself was already captured by the
          // form, so a failure here costs a data point, not a customer.
        });
      }, 1500);
    });
  }, [variant.name, video.youtubeId, video.title]);

  return { handlePlay, handleProgress };
}

// Mirrors the dataLayer convention already used in CashFlowGapCalculator.tsx.
// NOTE: no GTM container is loaded sitewide today, so these currently queue in
// an array and go nowhere — they start reporting the day one is added.
function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

// ---------------------------------------------------------------------------
// Header — logo and phone only. Every nav link on a paid-traffic funnel is a
// leak, so there are none.
// ---------------------------------------------------------------------------
function FunnelHeader({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 glass-nav">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5 sm:px-8 md:justify-between">
        <Image
          src="/dark%20logo.svg"
          alt="Credit Banc"
          width={400}
          height={100}
          priority
          unoptimized
          className="h-7 w-auto sm:h-8"
        />
        <a
          href={`#${FORM_ANCHOR}`}
          className="hidden rounded-lg bg-on-secondary-fixed px-5 py-2.5 font-headline text-sm font-bold text-primary-fixed transition-transform hover:scale-[1.03] md:inline-block"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}

function PrimaryCta({
  label,
  tone = 'dark',
}: {
  label: string;
  tone?: 'dark' | 'light';
}) {
  const skin =
    tone === 'light'
      ? 'bg-white text-on-secondary-fixed shadow-[0_22px_44px_-16px_rgba(0,0,0,0.45)]'
      : 'bg-on-secondary-fixed text-primary-fixed shadow-[0_22px_44px_-18px_rgba(32,37,54,0.75)]';
  return (
    <motion.a
      href={`#${FORM_ANCHOR}`}
      className={`inline-flex items-center justify-center rounded-lg px-7 py-4 text-center font-headline text-base font-bold sm:text-lg ${skin}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {label}
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// The signature section. An MCA's problem is not only the cost, it is the
// cadence — 22 withdrawals a month against one deposit cycle. Drawing both
// months as strips of the same 22 slots makes that comparison in about a
// second, which no paragraph on this page can match.
// ---------------------------------------------------------------------------
const BUSINESS_DAYS = 22;

function PaymentRhythm({ ctaLabel }: { ctaLabel: string }) {
  const barStagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.025, delayChildren: 0.1 } },
  };
  const bar: Variants = {
    hidden: { opacity: 0, scaleY: 0.35 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.32, ease: EASE },
    },
  };

  return (
    <section className="px-5 pb-16 sm:px-8 sm:pb-24">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-4xl rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-[0_40px_90px_-50px_rgba(32,37,54,0.5)] sm:p-10"
      >
        <motion.p
          variants={fadeUp}
          className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary"
        >
          The part nobody warns you about
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 font-headline text-2xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-4xl"
        >
          It isn&rsquo;t only the amount. It&rsquo;s the frequency.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg"
        >
          An advance doesn&rsquo;t ask once a month. It asks every business day,
          whether or not the money came in that day.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10">
          <RhythmRow
            eyebrow="A typical MCA month"
            count="22"
            unit="withdrawals"
            variants={barStagger}
          >
            {Array.from({ length: BUSINESS_DAYS }).map((_, i) => (
              <motion.span
                key={i}
                variants={bar}
                style={{ originY: 1 }}
                className="h-10 flex-1 rounded-[3px] bg-on-secondary-fixed/75 sm:h-14"
              />
            ))}
          </RhythmRow>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="my-7 flex items-center gap-4"
          aria-hidden
        >
          <span className="h-px flex-1 bg-outline-variant/50" />
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            What we try to get you to
          </span>
          <span className="h-px flex-1 bg-outline-variant/50" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <RhythmRow
            eyebrow="One restructured payment"
            count="1"
            unit="payment"
            highlight
            variants={barStagger}
          >
            {Array.from({ length: BUSINESS_DAYS }).map((_, i) => (
              <motion.span
                key={i}
                variants={bar}
                style={{ originY: 1 }}
                className={`h-10 flex-1 rounded-[3px] sm:h-14 ${
                  i === 0
                    ? 'bg-primary shadow-[0_10px_24px_-10px_rgba(85,207,158,0.9)]'
                    : 'border border-dashed border-outline-variant/60 bg-transparent'
                }`}
              />
            ))}
          </RhythmRow>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg"
        >
          Same obligation, different schedule. Whether that restructure is
          available to you depends on your revenue, your time in business, and
          what you&rsquo;re already carrying. Finding out costs you a few
          questions. Not finding out costs you every week you wait.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8">
          <PrimaryCta label={ctaLabel} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function RhythmRow({
  eyebrow,
  count,
  unit,
  highlight = false,
  variants,
  children,
}: {
  eyebrow: string;
  count: string;
  unit: string;
  highlight?: boolean;
  variants: Variants;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <p className="font-headline text-sm font-extrabold uppercase tracking-wider text-on-surface-variant sm:text-base">
          {eyebrow}
        </p>
        <p className="shrink-0 whitespace-nowrap font-headline text-sm font-extrabold text-on-secondary-fixed sm:text-base">
          <span
            className={`text-2xl tabular-nums sm:text-3xl ${
              highlight ? 'text-primary' : ''
            }`}
          >
            {count}
          </span>{' '}
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
            {unit}
          </span>
        </p>
      </div>
      <motion.div
        variants={variants}
        className="flex items-end gap-[3px] sm:gap-1.5"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ. Native <details> — accessible, keyboard-operable, and open by the time
// the JS bundle arrives.
// ---------------------------------------------------------------------------
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-headline text-lg font-extrabold text-on-secondary-fixed marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown
          className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p className="pb-6 pr-9 text-base leading-relaxed text-on-surface-variant">
        {a}
      </p>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Mobile sticky CTA. Appears once the hero has scrolled away and steps aside
// when the form is on screen, so it never covers the thing it points at.
// ---------------------------------------------------------------------------
function StickyCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById(FORM_ANCHOR);
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.75;
      const formOnScreen = form
        ? (() => {
            const r = form.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          })()
        : false;
      setVisible(pastHero && !formOnScreen);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/50 bg-surface-container-lowest/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <a
          href={`#${FORM_ANCHOR}`}
          tabIndex={visible ? 0 : -1}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-on-secondary-fixed px-4 font-headline text-[15px] font-bold text-primary-fixed"
        >
          {label}
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The GHL prequalification embed.
// ---------------------------------------------------------------------------
function PrequalForm({
  params,
  fields,
}: {
  params: Record<string, string>;
  fields: Record<string, string>;
}) {
  // Attribution stashed when the visitor first landed (lib/attribution.ts).
  // sessionStorage doesn't exist during SSR, so it's read after mount and the
  // iframe waits for it — otherwise GHL would fetch the form twice with two
  // different srcs. The placeholder holds the same height to avoid a shift.
  const [attribution, setAttribution] = useState<Record<string, string> | null>(
    null
  );
  useEffect(() => setAttribution(readAttribution()), []);

  const src = buildFormSrc(params, fields, attribution ?? {});

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_28px_70px_-30px_rgba(32,37,54,0.4)]">
      {attribution === null ? (
        <div
          className="flex w-full items-center justify-center"
          style={{ height: PREQUAL_FORM_HEIGHT }}
        >
          <span className="text-sm text-on-surface-variant">
            Loading your form…
          </span>
        </div>
      ) : (
        <iframe
          src={src}
          id={`inline-${PREQUAL_FORM_ID}`}
          title={PREQUAL_FORM_NAME}
          data-layout="{'id':'INLINE'}"
          data-form-id={PREQUAL_FORM_ID}
          data-form-name={PREQUAL_FORM_NAME}
          data-height={PREQUAL_FORM_HEIGHT}
          data-layout-iframe-id={`inline-${PREQUAL_FORM_ID}`}
          data-trigger-type="alwaysShow"
          data-activation-type="alwaysActivated"
          data-deactivation-type="neverDeactivate"
          scrolling="no"
          style={{
            width: '100%',
            height: PREQUAL_FORM_HEIGHT,
            border: 'none',
          }}
        />
      )}
    </div>
  );
}

// Precedence, lowest to highest: page defaults → stored attribution → the URL
// on this page. A campaign link that names its own lead_source always wins.
function buildFormSrc(
  params: Record<string, string>,
  fields: Record<string, string>,
  attribution: Record<string, string>
) {
  const url = new URL(
    `https://api.leadconnectorhq.com/widget/form/${PREQUAL_FORM_ID}`
  );

  for (const [key, value] of Object.entries(fields)) {
    url.searchParams.set(key, value);
  }
  for (const [key, value] of Object.entries(attribution)) {
    url.searchParams.set(key, value);
  }

  // Contact prefill, so an SMS link that already knows who it texted doesn't
  // ask again. Incoming keys land in either case depending on who built the
  // link (GHL merge fields are snake_case, our own links are camelCase), and
  // GHL matches on each field's Query Key — so read both shapes on the way in
  // and write both the single full-name and split-name shapes on the way out.
  // Whichever the form actually uses gets filled; the rest are ignored.
  const firstName = params.firstName || params.first_name || '';
  const lastName = params.lastName || params.last_name || '';
  const businessName = params.businessName || params.business_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fullName) {
    url.searchParams.set('full_name', fullName);
    url.searchParams.set('name', fullName);
    url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
  }
  if (params.email) url.searchParams.set('email', params.email);
  if (params.phone) url.searchParams.set('phone', params.phone);
  if (businessName) {
    url.searchParams.set('company_name', businessName);
    url.searchParams.set('business_name', businessName);
  }

  // Any attribution param on this page's own URL, forwarded verbatim. The
  // three test-axis params stay out of the payload — the variant already
  // travels as the readable `page_variant` / `video_format` / `cta_variant`.
  for (const [key, value] of Object.entries(params)) {
    if (key === 'v' || key === 'vid' || key === 'cta') continue;
    if (key.startsWith('lead_source') || key === 'appointment_source') {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
