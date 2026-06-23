'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { CalendarCheck, Phone, Mail, Check } from 'lucide-react';
import { SITE } from '@/lib/site';

// Default GHL / LeadConnector calendar (the generic /schedule-a-call funnel).
// Per-advisor pages override this with the advisor's own booking-widget id.
// form_embed.js resizes by matching the iframe's window, so the id only needs
// to be unique/stable on the page.
const DEFAULT_BOOKING_ID = '89A9rcz6364CmH0L4kty';
const DEFAULT_IFRAME_ID = 'k89CF4AvNra7oJmpI2vl_1781724840351';

export type ScheduleAdvisor = {
  /** Display name woven into the page copy, e.g. "Amit Imrit". */
  name: string;
  /** GHL booking-widget id for this advisor; falls back to the default. */
  calendarId?: string;
  /** Optional direct line; falls back to the site phone. */
  phone?: string;
  /** Optional direct email; falls back to the site email. */
  email?: string;
  /** Square headshot in /public (e.g. '/cbteam/Manny.png'); initials if absent. */
  photo?: string;
  /** Title shown under the name, e.g. "Business Advisor". */
  role?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// On-brand emerald gradient behind the advisor headshot / initials.
const AVATAR_ACCENT =
  'linear-gradient(135deg, #1f6b4e 0%, #2ea878 55%, #55cf9e 100%)';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function ScheduleACall({
  advisor,
}: {
  advisor?: ScheduleAdvisor;
}) {
  const params = useSearchParams();

  const bookingId = advisor?.calendarId || DEFAULT_BOOKING_ID;
  const bookingBase = `https://api.leadconnectorhq.com/widget/booking/${bookingId}`;
  // Stable, unique id per calendar (default page keeps its original GHL id).
  const iframeId = advisor ? `cb_booking_${bookingId}` : DEFAULT_IFRAME_ID;
  const callPhone = advisor?.phone || SITE.phone;
  const callPhoneTel = advisor?.phone
    ? `tel:${advisor.phone.replace(/[^\d+]/g, '')}`
    : SITE.phoneTel;
  const callEmail = advisor?.email || SITE.email;

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
    const url = new URL(bookingBase);
    if (firstName) url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
    return url.toString();
  })();

  return (
    <div className="bg-surface">
      {advisor ? (
        /* ---------- Dark hero (advisor / calendar pages) ---------- */
        <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20">
          <motion.div
            aria-hidden
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />

          <header className="relative max-w-5xl mx-auto flex items-center justify-center sm:justify-start py-2 sm:py-3">
            <a href="/" aria-label="Credit Banc home" className="inline-flex">
              <Image
                src="/cb%20logo%20white.svg"
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

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative max-w-4xl mx-auto text-center pt-10 sm:pt-14"
          >
            <motion.p
              variants={fadeUp}
              className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4"
            >
              Credit Banc · 15-Minute Strategy Call
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95]"
            >
              Get the <span className="text-primary">capital</span> you need.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 font-headline text-lg sm:text-xl font-bold text-white"
            >
              Work one-on-one with {advisor.name}, your Credit Banc Business
              Advisor.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-2 text-base sm:text-lg text-white/80"
            >
              Fast approvals, monthly payments, up to $500k, and zero collateral.
            </motion.p>
          </motion.div>
        </section>
      ) : (
        /* ---------- Light hero (generic /schedule-a-call) ---------- */
        <section className="relative overflow-hidden px-4 sm:px-6">
          <motion.div
            aria-hidden
            className="absolute -top-24 left-0 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-3xl pointer-events-none"
            animate={{ x: [0, 30, -20, 0], y: [0, 20, 10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
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
        </section>
      )}

      {/* Body copy (left) beside a wider calendar (right). */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-14 items-start">
        {/* Left column — supporting copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-xl lg:pt-4"
        >
          {advisor && (
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden ring-1 ring-on-secondary-fixed/5 shadow-[0_12px_30px_-18px_rgba(32,37,54,0.4)]"
                style={{ background: AVATAR_ACCENT }}
              >
                {advisor.photo ? (
                  <Image
                    src={advisor.photo}
                    alt={advisor.name}
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-headline text-2xl font-black text-white/90 tracking-tight select-none">
                      {initials(advisor.name)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight text-on-secondary-fixed">
                  {advisor.name}
                </p>
                <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mt-1">
                  {advisor.role || 'Credit Banc Advisor'}
                </p>
              </div>
            </motion.div>
          )}

          {advisor && (
            <motion.div
              variants={fadeUp}
              className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <a
                href={callPhoneTel}
                className="inline-flex items-center gap-2 text-sm font-semibold text-on-secondary-fixed hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                {callPhone}
              </a>
              <a
                href={`mailto:${callEmail}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-on-secondary-fixed hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                {callEmail}
              </a>
            </motion.div>
          )}

          {advisor ? (
            <>
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg leading-relaxed text-on-surface-variant"
              >
                <strong className="text-on-secondary-fixed">
                  Our goal at Credit Banc is simple:
                </strong>{' '}
                help you secure the funding your business needs, without the
                stress.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-4 text-base sm:text-lg leading-relaxed text-on-surface-variant"
              >
                I work one-on-one with business owners to get funding that
                actually works for your situation. Whether you need cash to cover
                payroll, restock inventory, replace busted equipment, or finally
                expand, I&rsquo;ll walk you through it, start to finish.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6">
                <p className="font-headline text-base font-bold text-on-secondary-fixed">
                  You&rsquo;ll get:
                </p>
                <ul className="mt-3 space-y-2.5">
                  {[
                    <>
                      Access to{' '}
                      <strong className="text-on-secondary-fixed">
                        100+ lenders
                      </strong>{' '}
                      competing for your business
                    </>,
                    <>Fast approvals (sometimes in 24 hours)</>,
                    <>Monthly payment programs up to 10 years</>,
                    <>
                      Funding up to{' '}
                      <strong className="text-on-secondary-fixed">$500k</strong>,
                      more for qualified deals
                    </>,
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-base text-on-surface-variant leading-relaxed"
                    >
                      <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-6 font-headline text-lg sm:text-xl font-bold text-on-secondary-fixed"
              >
                Don&rsquo;t wait for a bank to call you back next month.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-3 text-base sm:text-lg leading-relaxed text-on-surface-variant italic"
              >
                Grab 15 minutes with me, and let&rsquo;s talk about what your
                business really needs&hellip;and how fast we can make it happen.
              </motion.p>
            </>
          ) : (
            <>
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg leading-relaxed text-on-surface-variant"
              >
                Give us{' '}
                <strong className="text-on-secondary-fixed">15 minutes</strong> and
                we&rsquo;ll help you get clear, get strategic, and build a funding
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
                  href={callPhoneTel}
                  className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
                >
                  {callPhone}
                </a>
                .
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Right column — calendar (takes the wider track). Opacity-only fade
            (no transform) so the GHL iframe isn't resizing inside a moving,
            transformed container while it loads — that's what made it jump. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)]"
        >
          <iframe
            key={bookingSrc}
            src={bookingSrc}
            id={iframeId}
            title={
              advisor
                ? `Schedule a call with ${advisor.name}`
                : 'Schedule a call with Credit Banc'
            }
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

      </section>

      {/* GHL resize script — auto-fits the booking iframe height. Load it
          afterInteractive (not lazyOnload) so the resize listener is attached
          before the iframe posts its first height message; otherwise that
          message is missed and the calendar stays clipped, then jumps. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
