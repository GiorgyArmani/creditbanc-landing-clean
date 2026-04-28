'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import Counter from '../ui/Counter';
import { ROUTES } from '@/lib/site';

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

export default function Hero() {
  return (
    <section className="relative min-h-[870px] flex items-center px-8 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          className="lg:col-span-7 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6"
          >
            Credit & Capital to Grow
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.9] mb-8"
          >
            Working Capital with{' '}
            <span className="text-primary">Monthly Payments</span> for Your
            Business.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed"
          >
            Access working capital for growth, payroll, inventory, equipment,
            or cash-flow gaps, with monthly payment options and guidance from
            advisors who help you find the right fit.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.a
              href={ROUTES.apply}
              className="bg-on-secondary-fixed text-primary-fixed px-10 py-5 rounded-lg font-bold text-lg inline-block"
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
        <div className="lg:col-span-5 relative">
          <motion.div
            className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative"
            initial={{ opacity: 0, x: 80, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx-1ZcsggNhD2ZhUYAZZUBg1AdIoYkmas-JjvqGCcQmbqBsF-UNSuORDgkTz176LBlfuHnxkFWAgUbXlIRbtCmGtvHw6jkpn1JFdH10rOvtZZBZr5c6ZCLJ72bNiXitYu1Vrutqya5AdD25s8ouQV4NnU5T98c1jtaTavquDk9a8z9ngplnrjwkoHu9ZIbR5PpwDU1AcznnHMGt5QrTY1g702q1cyDKLYtf1BeH7QRjEWmKzKx6Qk8mbuXs1tD2UdMQsh5EMxfyLY"
              alt="Business owner reviewing financing options with a Credit Banc advisor"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-on-secondary-fixed/10" />
          </motion.div>
          <motion.div
            className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-7 rounded-xl shadow-[0_40px_60px_-15px_rgba(0,3,33,0.1)] border border-outline-variant/15 w-72"
            initial={{ opacity: 0, y: 40, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: 0, y: -4 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <Icon name="bolt" className="text-on-primary-container" />
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  Funded in 24 hours
                </p>
                <p className="text-xs text-on-surface-variant font-semibold">
                  No collateral · qualifying businesses
                </p>
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <Counter
                stops={[10, 50, 150, 500]}
                prefix="$"
                suffix="K"
                duration={5}
                delay={1.2}
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
                  delay: 1.2,
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
              <motion.div
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '300%' }}
                transition={{
                  duration: 1.6,
                  delay: 6.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 2.5,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>$10K</span>
              <span>$500K</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 skew-x-12 transform translate-x-20" />
    </section>
  );
}
