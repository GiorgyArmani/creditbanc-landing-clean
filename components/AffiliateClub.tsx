'use client';

import Image, { getImageProps } from 'next/image';
import { motion, type Variants } from 'framer-motion';
import {
  Share2,
  Handshake,
  Gift,
  ArrowRight,
  UserPlus,
  Rocket,
} from 'lucide-react';
import { SITE } from '@/lib/site';

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const STEPS = [
  {
    icon: UserPlus,
    title: 'Join the Affiliate Program',
    body: 'Sign up for the “I Know Someone” Club. It’s free, simple, and you don’t need to know anything about business funding. You just need to know people who own businesses. Convenient.',
  },
  {
    icon: Share2,
    title: 'Share Your Personal Link',
    body: 'We’ll give you a unique affiliate link to share with business owners you know. Text it. Email it. Post it on social media. Drop it into the group chat where your cousin keeps promoting his landscaping company.',
  },
  {
    icon: Handshake,
    title: 'We Handle the Rest',
    body: 'When someone uses your link, the Credit Banc team will talk with them, learn what they need, and see whether we can help them find funding. You make the connection. We sort through the money stuff.',
  },
  {
    icon: Gift,
    title: 'You Get Rewarded',
    body: 'If we can help them get the money they need through Credit Banc, you’ll get a $500 gift card of your choice. You made the connection. We’ll send the thank-you.',
  },
];



/* The 18 cards in /public/giftcards, split into two marquee rows that travel
   in opposite directions. Files are numbered, so the brand name lives here. */
const GIFT_CARD_ROWS = [
  [
    { src: '/giftcards/2.jpg', brand: 'Amazon' },
    { src: '/giftcards/5.jpg', brand: 'Target' },
    { src: '/giftcards/18.jpg', brand: 'Starbucks' },
    { src: '/giftcards/11.jpg', brand: 'Airbnb' },
    { src: '/giftcards/15.jpg', brand: 'DoorDash' },
    { src: '/giftcards/9.jpg', brand: 'Apple' },
    { src: '/giftcards/3.jpg', brand: 'Walmart' },
    { src: '/giftcards/14.jpg', brand: 'Netflix' },
    { src: '/giftcards/8.jpg', brand: 'Uber' },
  ],
  [
    { src: '/giftcards/17.jpg', brand: 'Visa Reward' },
    { src: '/giftcards/12.jpg', brand: 'Disney' },
    { src: '/giftcards/16.jpg', brand: 'Sephora' },
    { src: '/giftcards/4.jpg', brand: 'Grubhub' },
    { src: '/giftcards/10.jpg', brand: 'IKEA' },
    { src: '/giftcards/7.jpg', brand: "Macy's" },
    { src: '/giftcards/13.jpg', brand: 'CVS Pharmacy' },
    { src: '/giftcards/6.jpg', brand: 'Hotels.com' },
    { src: '/giftcards/1.jpg', brand: 'Google Play' },
  ],
] as const;

/* Rewards are fulfilled on Giftronaut's platform. Set to null to fall back to
   the Rocket + type lockup if the artwork is ever pulled. The wordmark is dark
   glyphs on transparency, so it needs the light badge behind it. */
const GIFTRONAUT_LOGO: string | null = '/giftcards/giftronaut-logo.webp';

function GiftCardMarquee({
  row,
  duration,
  delay = '0s',
  reverse = false,
}: {
  row: readonly { src: string; brand: string }[];
  duration: string;
  /* Negative delay starts the row mid-loop, so the two rows don't line their
     card edges up like a grid. */
  delay?: string;
  reverse?: boolean;
}) {
  return (
    <div className="gift-marquee relative w-full">
      <ul
        className="gift-marquee-track flex w-max items-center"
        style={
          {
            '--gift-marquee-duration': duration,
            '--gift-marquee-delay': delay,
            '--gift-marquee-direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) =>
          row.map((card) => (
            <li
              key={`${copy}-${card.src}`}
              /* Spacing is margin, not gap. See the note in globals.css. */
              className="gift-card mr-5 shrink-0 sm:mr-6"
              aria-hidden={copy === 1 || undefined}
            >
              <div className="relative w-[184px] overflow-hidden rounded-2xl shadow-[0_18px_36px_-20px_rgba(32,37,54,0.55),0_2px_6px_-2px_rgba(32,37,54,0.18)] ring-1 ring-on-secondary-fixed/10 sm:w-[216px] lg:w-[248px]">
                <Image
                  src={card.src}
                  alt={copy === 1 ? '' : `${card.brand} gift card`}
                  /* Sized to the widest rendered card (248px) rather than the
                     source's 640x400, so next/image emits a short 1x/2x srcset
                     instead of the full breakpoint ladder for all 36 tiles. */
                  width={248}
                  height={155}
                  className="block h-auto w-full object-cover"
                />
                {/* Glass sheen: sells the tiles as physical cards instead of
                    flat logo crops sitting on the cream. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 via-transparent to-on-secondary-fixed/10"
                />
              </div>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

/* Art-directed hero portrait: a near-square crop from lg up, a tighter
   landscape crop below it. Built with getImageProps + <picture> so the
   browser downloads exactly one of the two files. */
function getHeroPortraitProps() {
  const common = {
    alt: 'Credit Banc member holding a $500 “I Know Someone” Club gift card',
    priority: true,
  } as const;

  const desktopSizes = '(min-width: 1536px) 40rem, (min-width: 1280px) 32rem, 25rem';
  const mobileSizes = '(min-width: 640px) 560px, 92vw';

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: '/hero-affiliate-desktop.png',
    width: 1650,
    height: 1600,
    sizes: desktopSizes,
  });

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: '/hero-affiliate-mobile.png',
    width: 800,
    height: 600,
    sizes: mobileSizes,
  });

  return {
    desktop: { srcSet: desktopSrcSet, sizes: desktopSizes },
    mobile: { srcSet: mobileSrcSet, sizes: mobileSizes },
    imgProps: rest,
  };
}

export default function AffiliateClub() {
  const { desktop, mobile, imgProps } = getHeroPortraitProps();

  return (
    <div className="bg-surface">
      {/* ---------- Hero — full-bleed yellow, owns the first screen -------- */}
      {/* 84px is Navbar's NAV_HEIGHT, the height of the spacer it renders under
          its fixed bar. Subtracting it makes the orange run from the bar's
          bottom edge to the fold with no cream showing through. `svh` not `vh`
          so the mobile URL bar collapsing does not overshoot. */}
      <section
        className="relative flex min-h-[calc(100svh-84px)] items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #ffc257 0%, #ffaf26 48%, #f79f12 100%)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(32,37,54,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(32,37,54,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse at center, black 35%, transparent 85%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 35%, transparent 85%)',
          }}
        />
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-white/25 blur-3xl pointer-events-none"
        />

        <div className="relative w-full max-w-[100rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            /* The section centers this block, so the old top padding is gone --
               it would now push the composition off-centre rather than clear
               the navbar. */
            className="flex flex-col gap-8 py-10 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-8 lg:items-start lg:py-12"
          >
            <motion.h1
              variants={fadeUp}
              className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 text-center lg:text-left font-headline text-[2.75rem] sm:text-6xl lg:text-[3.25rem] xl:text-[4.25rem] 2xl:text-[5rem] font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95]"
            >
              {/* Keep the opening sentence unbroken from lg up; it wraps
                  naturally on narrow screens. */}
              <span className="block lg:whitespace-nowrap">
                You Know Someone.
              </span>
              <span className="block text-white">
                Probably Several Someones.
              </span>
            </motion.h1>

            {/* Member card photo. On mobile it sits between the headline and
                the copy card (order-2); from lg it moves to its own column,
                spanning both rows and flush on the bottom edge of the band. */}
            <motion.div
              variants={fadeUp}
              className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 relative z-10 flex justify-center lg:justify-end self-center lg:self-end min-w-0 lg:-mr-12"
            >
              <div
                aria-hidden
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-72 sm:h-96 sm:w-96 lg:h-[34rem] lg:w-[34rem] rounded-full bg-white/30 blur-3xl pointer-events-none"
              />
              <picture className="relative block w-full lg:w-auto">
                <source
                  media="(min-width: 1024px)"
                  srcSet={desktop.srcSet}
                  sizes={desktop.sizes}
                />
                <source
                  media="(max-width: 1023px)"
                  srcSet={mobile.srcSet}
                  sizes={mobile.sizes}
                />
                {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from imgProps */}
                <img
                  {...imgProps}
                  fetchPriority="high"
                  className="relative block h-auto w-full max-w-[460px] aspect-[800/600] sm:max-w-[560px] lg:aspect-[1650/1600] lg:w-[25rem] lg:max-w-none lg:-mt-16 xl:w-[32rem] xl:-mt-20 2xl:w-[40rem] 2xl:-mt-28 object-contain object-bottom drop-shadow-[0_25px_35px_rgba(32,37,54,0.28)]"
                />
              </picture>
            </motion.div>

            {/* Below lg the copy card sits in front of the photo (z-20) and
                cancels the flex gap plus 4px (-mt-9 vs gap-8), so the figure —
                whose crop runs flush to the image's bottom edge — reads as
                rising out of the card instead of ending above it. */}
            <motion.div
              variants={fadeUp}
              className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start relative z-20 lg:z-auto -mt-9 lg:mt-0 mb-8 lg:mb-0 max-w-2xl rounded-2xl border-l-4 border-on-secondary-fixed bg-white/85 backdrop-blur-sm p-5 sm:p-6 pt-7 sm:pt-8 lg:pt-6 shadow-[0_14px_34px_-18px_rgba(32,37,54,0.55)]"
            >
                <p className="text-base sm:text-lg leading-relaxed text-on-secondary-fixed/80">
                  A friend. A cousin. A neighbor. The guy who fixed your roof.
                  Your kid&rsquo;s martial arts instructor. The woman who runs
                  your favorite coffee shop. Your dentist. And chances are, one
                  of them could use a little more money to run, fix, or grow
                  their business.
                </p>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-on-secondary-fixed">
                  Join the &ldquo;I Know Someone&rdquo; Club and turn the
                  business owners in your contact list into rewards.
                </p>

                <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-headline text-lg sm:text-xl font-bold tracking-tight text-on-secondary-fixed">
                    Finally, knowing everybody pays off.
                  </p>

                  <a
                    href={SITE.affiliateUrl}
                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-on-secondary-fixed px-7 py-3.5 font-headline text-base font-bold text-white shadow-[0_16px_34px_-14px_rgba(32,37,54,0.8)] transition-transform hover:scale-[1.03]"
                  >
                    Join the Club
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>
          </motion.div>
        </div>
      </section>

      
      {/* ---------- The reward — gift-card marquee, same cream band as
           "How It Works" below so the two read as one section ---------- */}
      <section
        id="rewards"
        className="relative overflow-hidden bg-surface pt-16 pb-12 sm:pt-24 sm:pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto mb-9 max-w-3xl px-6 text-center sm:px-8"
        >
          <span className="font-headline text-xs font-black tracking-[0.2em] text-on-primary-fixed-variant">
            THE REWARD
          </span>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-4xl xl:text-5xl">
            $500. Your Card. Your Call.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-on-secondary-fixed/75 sm:text-lg">
            Amazon. Target. Starbucks. Airbnb. Or a Visa reward card you can
            spend anywhere, because nobody tells you how to enjoy your own
            money. Make one introduction that turns into funding, then pick
            whichever card you want.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="text-sm text-on-secondary-fixed/60">
              Rewards powered by
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_10px_24px_-16px_rgba(32,37,54,0.6)] ring-1 ring-on-secondary-fixed/10">
              {GIFTRONAUT_LOGO ? (
                <Image
                  src={GIFTRONAUT_LOGO}
                  alt="Giftronaut"
                  width={3132}
                  height={332}
                  /* `unoptimized` on purpose. The wordmark is dark glyphs on
                     transparency, and next/image's JPEG fallback (served to any
                     client that does not advertise webp/avif) flattens that alpha
                     to BLACK -- a black slab on the white badge. The source is a
                     13KB webp, smaller than the optimizer's own output, so there
                     is nothing to gain by routing it through /_next/image. */
                  unoptimized
                  className="h-5 w-auto"
                />
              ) : (
                <>
                  <Rocket className="h-5 w-5 text-on-primary-fixed-variant" />
                  <span className="font-headline text-base font-extrabold tracking-tight text-on-secondary-fixed">
                    Giftronaut
                  </span>
                </>
              )}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative"
          role="region"
          aria-label="Gift cards you can choose from"
        >
          {/* Stage: a soft light shelf under the rows so the cards read as one
              carousel band instead of two loose strips floating on the cream. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[118%] -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_50%,rgba(255,255,255,0.9),rgba(255,255,255,0)_72%)]"
          />
          <div className="relative flex flex-col py-2">
            <GiftCardMarquee row={GIFT_CARD_ROWS[0]} duration="52s" />
            <GiftCardMarquee
              row={GIFT_CARD_ROWS[1]}
              duration="64s"
              delay="-19s"
              reverse
            />
          </div>

          {/* Edge fades. Painted, not masked: a mask-image on the track did not
              survive the CSS pipeline, so the cards were sliced flat at the
              viewport edge. Tied to `surface` (#faf9f6), the band behind them. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface via-surface/85 to-transparent sm:w-28 lg:w-40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface via-surface/85 to-transparent sm:w-28 lg:w-40"
          />
        </motion.div>
      </section>

      {/* ---------- How it works — light band, emerald cards ---------- */}
      <section className="relative overflow-hidden bg-surface px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(32,37,54,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(32,37,54,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
        <div className="relative max-w-[100rem] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-on-secondary-fixed"
          >
            Here&rsquo;s How It Works
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  className="relative rounded-2xl ring-1 ring-white/15 shadow-[0_24px_45px_-25px_rgba(16,64,44,0.75)] p-6 xl:p-7"
                  style={{
                    background:
                      'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-secondary-fixed">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-headline text-sm font-black tracking-wider text-primary">
                      STEP {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-headline text-lg xl:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] xl:text-base leading-relaxed text-white/85">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---------- Why we created it + CTA — one emerald band ---------- */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
        }}
      >
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Why — full-width split: photo panel left, copy right */}
        <div className="relative grid lg:grid-cols-2 items-stretch">
          <div className="relative overflow-hidden bg-[#ffaf26] lg:min-h-[34rem]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(32,37,54,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(32,37,54,0.6) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
            {/* In flow on mobile so the panel takes the photo's height; pinned
                on lg so the photo fills whatever the copy column dictates. */}
            <div className="relative flex items-end justify-center pt-12 lg:absolute lg:inset-0 lg:pt-0">
              <Image
                src="/Why%20section.png"
                alt="Two customers talking with a small business owner"
                width={1000}
                height={1000}
                sizes="(max-width: 1024px) 85vw, 50vw"
                className="w-[85%] max-w-[440px] h-auto lg:h-full lg:w-auto lg:max-w-[92%] object-contain object-bottom drop-shadow-[0_25px_35px_rgba(32,37,54,0.25)]"
              />
            </div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-16 sm:py-20 lg:py-24"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white ring-1 ring-white/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Why We Created the Club
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mt-6 font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.05]"
            >
              Small Business Owners Deserve Better.{' '}
              <span className="text-primary">So We Built a Shortcut.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg leading-relaxed text-white/85"
            >
              Why did we create a whole program around knowing a business owner?
              Fair question. Simple answer.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg leading-relaxed text-white/85"
            >
              American small business owners create jobs, support families, and
              keep Main Street moving. Then, when they need some financial help,
              they&rsquo;re handed confusing options, bad advice, and deals that
              seem to work out beautifully for everyone except them.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary"
            >
              Not on our watch, dammit.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg leading-relaxed text-white/85"
            >
              The &ldquo;I Know Someone&rdquo; Club helps us reach more of them
              through the people already in their corner. People like you.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg leading-relaxed text-white/85"
            >
              And no, you don&rsquo;t need to understand business funding
              (it&rsquo;s a boring industry anyway), inspect anyone&rsquo;s bank
              account (as if they&rsquo;d let you), or interrogate your dentist
              while their hands are in your mouth (enough said).
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg leading-relaxed text-white"
            >
              You make the intro. We make some calls. One more small business
              owner gets help without getting worked over. We&rsquo;ll drink to
              that.
            </motion.p>
          </motion.div>
        </div>

      </section>



      {/* ---------- Closing CTA — ramps cream into white ---------- */}
      {/* Starts on `surface`, the exact cream the reward band above ends on, so
          the seam between the two sections is invisible; it reaches white by
          mid-section. Replaces the flat `bg-white`, which read as one more
          horizontal stripe in a page that already has too many. */}
      <section className="relative bg-gradient-to-b from-surface via-white to-white px-6 sm:px-8 lg:px-12 py-28 sm:py-36 lg:py-44">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative max-w-[100rem] mx-auto text-center"
        >
          {/* Sized per breakpoint to hold the headline on one line from lg up;
              it wraps naturally below that, where one line won't fit. */}
          <motion.h2
            variants={fadeUp}
            className="font-headline text-[2.25rem] sm:text-5xl lg:text-5xl lg:whitespace-nowrap xl:text-[3.75rem] 2xl:text-[5rem] font-extrabold tracking-tighter leading-[1.1] text-on-surface"
          >
            Your contact list finally has a job.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-3xl text-xl sm:text-2xl xl:text-3xl leading-relaxed text-on-surface"
          >
            Grab your personal link, share it with the business owners you know,
            and let us handle the money side.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-11">
            <a
              href={SITE.affiliateUrl}
              className="inline-flex items-center gap-2 rounded-full bg-on-secondary-fixed px-10 py-5 font-headline text-lg font-bold text-white shadow-[0_18px_40px_-14px_rgba(32,37,54,0.8)] transition-transform hover:scale-[1.03]"
            >
              Join the Club
              <ArrowRight className="h-6 w-6" />
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
