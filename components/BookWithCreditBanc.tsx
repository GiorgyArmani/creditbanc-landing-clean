'use client';

import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import { SITE } from '@/lib/site';
import { readStickyContact, type StickyContact } from '@/lib/sticky-contact';

// The GHL / LeadConnector calendar this funnel books into. Keep the iframe id
// exactly as GHL generated it so its resize script (form_embed.js) keeps
// matching this calendar.
const BOOKING_ID = '89A9rcz6364CmH0L4kty';
const BOOKING_BASE = `https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`;
const IFRAME_ID = 'k89CF4AvNra7oJmpI2vl_1780932488552';

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function BookWithCreditBanc() {
  const params = useSearchParams();

  // Contact stashed when the apply form was submitted (lib/sticky-contact.ts).
  // Read after mount — sessionStorage doesn't exist during SSR — and hold the
  // iframe until it's read so the calendar isn't fetched twice with different
  // srcs. Only used where the redirect URL didn't carry the field itself.
  const [stored, setStored] = useState<StickyContact | null>(null);
  useEffect(() => {
    setStored(readStickyContact());
  }, []);

  // The GHL Master Form redirect can hand us the contact either as split
  // fields or a single name. Read both shapes so prefill works no matter how
  // the redirect URL is configured in GHL.
  const rawFirst =
    params.get('firstName') ||
    params.get('first_name') ||
    stored?.firstName ||
    '';
  const rawLast =
    params.get('lastName') || params.get('last_name') || stored?.lastName || '';
  const rawFull = params.get('full_name') || params.get('name') || '';
  const email = params.get('email') || stored?.email || '';
  const phone = params.get('phone') || stored?.phone || '';

  // Normalize to first/last. If only a full name came through, split on the
  // first space; if only split fields came through, join them.
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

  // GHL calendar widgets prefill the booking contact form from these URL
  // params, so the client never re-types what the apply form already captured.
  const bookingSrc = (() => {
    const url = new URL(BOOKING_BASE);
    if (firstName) url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
    return url.toString();
  })();

  const greetingName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : '';

  return (
    <section className="relative overflow-hidden bg-surface px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24">
      {/* Soft drifting brand glow behind the headline. */}
      <motion.div
        aria-hidden
        className="absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl pointer-events-none"
        animate={{ x: [0, 30, -20, 0], y: [0, 20, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Qualified pill */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-on-primary-container"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            You&rsquo;re pre-qualified
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-secondary-fixed leading-[1.05]"
          >
            {greetingName ? (
              <>Nice work, {greetingName}.</>
            ) : (
              <>You&rsquo;re In.</>
            )}
            <br className="hidden sm:block" />{' '}
            <span className="text-primary">Let&rsquo;s grab a time.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            Pick a slot that works and you&rsquo;ll be on an Advisor&rsquo;s
            calendar in seconds. We&rsquo;ve already carried over your details{' '}
            <span className="italic">
              (because making you type them twice would be rude).
            </span>
          </motion.p>
        </motion.div>

        {/* Divider */}
        <div className="mt-12 mb-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="inline-flex items-center gap-2 font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <CalendarCheck className="h-4 w-4" />
            Pick your time
          </span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        {/* Calendar — full width across the container. Opacity-only fade (no
            transform) so the GHL iframe isn't resizing inside a moving,
            transformed container while it loads. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="w-full overflow-hidden rounded-2xl"
        >
          {stored === null ? (
            <div aria-hidden style={{ width: '100%', minHeight: '700px' }} />
          ) : (
            <iframe
              key={bookingSrc}
              src={bookingSrc}
              id={IFRAME_ID}
              title="Book with Credit Banc"
              scrolling="no"
              style={{
                width: '100%',
                minHeight: '700px',
                border: 'none',
                overflow: 'hidden',
              }}
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center text-sm text-on-surface-variant"
        >
          Calendar not loading? Call an Advisor at{' '}
          <a
            href={SITE.phoneTel}
            className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
          >
            {SITE.phone}
          </a>{' '}
          and we&rsquo;ll book you in by hand.
        </motion.p>
      </div>

      {/* GHL resize script — auto-fits the booking iframe height. Load it
          afterInteractive (not lazyOnload) so the resize listener is attached
          before the iframe posts its first height message. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
