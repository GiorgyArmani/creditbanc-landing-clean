'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { CalendarCheck } from 'lucide-react';
import { SITE } from '@/lib/site';

// Same GHL / LeadConnector calendar the booking funnel uses. Keep the iframe id
// exactly as GHL generated it so its resize script (form_embed.js) keeps
// matching this calendar.
const BOOKING_ID = '89A9rcz6364CmH0L4kty';
const BOOKING_BASE = `https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`;
const IFRAME_ID = 'k89CF4AvNra7oJmpI2vl_1781724840351';

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function ScheduleACall() {
  const params = useSearchParams();

  // This page is usually reached cold (nav / direct link), but if a campaign
  // link carries contact details we still prefill the GHL booking form so the
  // visitor never re-types what we already know. Read both name shapes.
  const rawFirst = params.get('firstName') || params.get('first_name') || '';
  const rawLast = params.get('lastName') || params.get('last_name') || '';
  const rawFull = params.get('full_name') || params.get('name') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';

  const fullName =
    rawFull.trim() ||
    [rawFirst, rawLast]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ');
  const firstSpace = fullName.indexOf(' ');
  const firstName = (
    rawFirst.trim() ||
    (firstSpace === -1 ? fullName : fullName.slice(0, firstSpace))
  ).trim();
  const lastName = (
    rawLast.trim() || (firstSpace === -1 ? '' : fullName.slice(firstSpace + 1))
  ).trim();

  // GHL calendar widgets prefill the booking contact form from these URL params.
  const bookingSrc = (() => {
    const url = new URL(BOOKING_BASE);
    if (firstName) url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
    return url.toString();
  })();

  return (
    <section className="relative min-h-screen overflow-hidden bg-surface px-4 sm:px-6 pb-16 sm:pb-24">
      {/* Soft drifting brand glow behind the headline. */}
      <motion.div
        aria-hidden
        className="absolute -top-24 left-0 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-3xl pointer-events-none"
        animate={{ x: [0, 30, -20, 0], y: [0, 20, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Minimal branded header — logo only. No nav menu: this is a paid-traffic
          opt-in page, so we don't give leads a way to wander off the funnel. */}
      <header className="relative max-w-6xl mx-auto flex items-center justify-center sm:justify-start py-6 sm:py-8">
        <a href="/" aria-label="Credit Banc home" className="inline-flex">
          <Image
            src="/dark%20logo.svg"
            alt="Credit Banc — Credit & capital to grow"
            width={400}
            height={100}
            priority
            unoptimized
            className="h-10 sm:h-12"
            style={{ width: 'auto' }}
          />
        </a>
      </header>

      {/* Hero — centered headline + pill, in the apply-now page style. */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative max-w-3xl mx-auto text-center pt-4 sm:pt-8 pb-10 sm:pb-14"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-on-primary-container"
        >
          <CalendarCheck className="h-4 w-4 text-primary" />
          15-minute strategy call
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-6 font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95]"
        >
          Not sure what you need?{' '}
          <span className="text-primary">
            Let&rsquo;s figure it out together.
          </span>
        </motion.h1>
      </motion.div>

      {/* Body copy (left) beside a wider calendar (right). */}
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-14 items-start">
        {/* Left column — supporting copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-xl lg:pt-4"
        >
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            Give us <strong className="text-on-secondary-fixed">15 minutes</strong>{' '}
            and we&rsquo;ll help you get clear, get strategic, and build a funding
            plan that actually fits your business,{' '}
            <span className="italic">not the bank&rsquo;s checklist.</span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            Whether you&rsquo;re scaling, cleaning up a mess, or just sick of
            getting shut down by suits, we&rsquo;ve got better options.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-headline text-lg sm:text-xl font-bold text-on-secondary-fixed"
          >
            Let&rsquo;s see what your business can really do.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-sm text-on-surface-variant"
          >
            Prefer to talk now? Call an Advisor at{' '}
            <a
              href={SITE.phoneTel}
              className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
            >
              {SITE.phone}
            </a>
            .
          </motion.p>
        </motion.div>

        {/* Right column — calendar (takes the wider track) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)]"
        >
          <iframe
            key={bookingSrc}
            src={bookingSrc}
            id={IFRAME_ID}
            title="Schedule a call with Credit Banc"
            scrolling="no"
            style={{
              width: '100%',
              minHeight: '700px',
              border: 'none',
              overflow: 'hidden',
            }}
          />
        </motion.div>
      </div>

      {/* GHL resize script — auto-fits the booking iframe height. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
