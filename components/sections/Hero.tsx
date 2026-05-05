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

const HERO_ASSETS_BASE = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx-1ZcsggNhD2ZhUYAZZUBg1AdIoYkmas-JjvqGCcQmbqBsF-UNSuORDgkTz176LBlfuHnxkFWAgUbXlIRbtCmGtvHw6jkpn1JFdH10rOvtZZBZr5c6ZCLJ72bNiXitYu1Vrutqya5AdD25s8ouQV4NnU5T98c1jtaTavquDk9a8z9ngplnrjwkoHu9ZIbR5PpwDU1AcznnHMGt5QrTY1g702q1cyDKLYtf1BeH7QRjEWmKzKx6Qk8mbuXs1tD2UdMQsh5EMxfyLY',
    alt: 'Business owner reviewing financing options',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtfPh2GVbAf1ZSwDsqv9GNZ96yUEklqMoJXkM6vhKzFiTSp2OurfAFaTIxvrzsFulKa3m4IGET6GeoFVZVbZblfwFz974x1Y8VFNex4QbN8zRgm1L7jzqlU6myl_Bb-d5gdJFaW5O4BNIkDCFCf8hVCcje408P8OVf4ZOtWcMsh-HHdAjblw6782plIxF1Xwp4kOuqevmMbCfy3S2s-gyURWIgIVf9UaZr8M55lnqinujSqQ4zwQX0ZtbQtJl759Jw264NOYNo7aU',
    alt: 'Capital and SBA financing illustrated by a stack of coins',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLHJ3M7hF-CdJznUP3qmGm9tA6XEmD6DYD21VBAbrXmERtYt4z88Tah4AJbgn98bHP-DJK-jmGR6otffcx7eLvWDs4E2tiZxqyOM69dKZ_vATg-LDx1eGJ_d9MIc4KaayZwvvhOKGOVTvWEncD8Jqq8Z0h7mKJnsboDVWERWy9unj63RH3koPq8I7C5coyLLQA0H84ckB7VsX6uvcMX2qziYn6YK3sS6nZ_tpJDIxGe_u-GY6766K8cI8pg7I7AsHx3h5NaL2E29s',
    alt: 'Small business owner reviewing capital options',
  },
];

const HERO_ASSETS_DESKTOP = [
  ...HERO_ASSETS_BASE,
  {
    src: '/moneythrow.mp4',
    alt: 'Capital deployed for business growth',
  },
];

const HERO_INTERVAL_MS = 9000;

const CARD_POSITIONS = [
  { top: '58%', left: '-14%' },
  { top: '36%', left: '-18%' },
  { top: '14%', left: '-10%' },
  { top: '44%', left: '-4%' },
];

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
            note="No collateral · qualifying businesses"
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
            icon="verified"
            title="SBA Programs"
            note="Government-backed financing"
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-4xl font-black text-on-surface tracking-tight tabular-nums">
              $5M
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Up to
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant mb-3">
            Terms up to 25 years. Lower down payments than conventional
            commercial loans.
          </p>
          <div className="flex flex-wrap gap-2">
            {['7(a)', '504', 'Express'].map((chip) => (
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
            icon="groups"
            title="Advisor + Whole Team"
            note="Not just one person on your side"
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-3xl font-black text-on-surface tracking-tight">
              No solo.
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Promise
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-variant mb-4">
            A real Advisor leads — and a full team of underwriters, lender
            contacts, and process pros has your back. <em>(Yes, all yours.)</em>
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-on-surface">
            <Icon name="check_circle" className="text-primary text-base" />
            Team backed. Advisor led.
          </div>
        </>
      );
    case 3:
    default:
      return (
        <>
          <CardEyebrow
            icon="rocket_launch"
            title="Capital Deployed"
            note="Trusted by operators"
          />
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-4xl font-black text-on-surface tracking-tight tabular-nums">
              $2B+
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              To Date
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="text-lg font-black text-on-surface tabular-nums">
                15k+
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Businesses Funded
              </p>
            </div>
            <div>
              <p className="text-lg font-black text-on-surface tabular-nums">
                94%
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Lives Changed
              </p>
            </div>
          </div>
        </>
      );
  }
}

export default function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);
  // xl: 1280px+
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  // Skip the heavy 2.4 MB GIF on mobile — only cycle the 3 lighter images.
  const heroAssets = isDesktop ? HERO_ASSETS_DESKTOP : HERO_ASSETS_BASE;

  useEffect(() => {
    setHeroIndex(0);
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroAssets.length);
    }, HERO_INTERVAL_MS);
    return () => clearInterval(id);
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
            className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95] mb-6"
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
            className="font-headline text-xl md:text-2xl xl:text-3xl font-bold tracking-tight text-on-secondary-fixed mb-6 min-h-[2.5rem]"
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
            className="text-base md:text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed"
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
        {!isDesktop && (
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
              />
            </div>
          </div>
        )}
      </div>

      {isDesktop && (
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
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              style={{
                top: CARD_POSITIONS[heroIndex].top,
                left: CARD_POSITIONS[heroIndex].left,
              }}
              initial={{ opacity: 0, y: 32, rotate: -8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
              exit={{ opacity: 0, y: -16, rotate: 2, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotate: 0, y: -4 }}
              className="absolute z-20 w-72 bg-surface-container-lowest p-7 rounded-xl shadow-[0_40px_60px_-15px_rgba(0,3,33,0.18)] border border-outline-variant/15"
            >
              {renderHeroCard(heroIndex)}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      <div
        aria-hidden
        className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl -z-10"
      />
    </section>
  );
}
