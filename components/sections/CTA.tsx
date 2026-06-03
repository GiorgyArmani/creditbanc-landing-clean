'use client';

import { motion, Variants } from 'framer-motion';
import { ROUTES, SITE } from '@/lib/site';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariant: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CTA() {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-6 sm:px-8 bg-primary relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-on-secondary-fixed/20 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="mx-auto text-center relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h2
          variants={titleVariant}
          className="font-headline text-4xl sm:text-5xl lg:whitespace-nowrap lg:text-[clamp(2.5rem,4vw,3.75rem)] font-extrabold text-white mb-6 sm:mb-8 tracking-tighter"
        >
          Not sure what kind of funding you need?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto"
        >
          Good. That means you probably haven&rsquo;t been sold the wrong thing
          yet.
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl md:text-2xl text-white mb-10 sm:mb-12 leading-relaxed max-w-3xl mx-auto"
        >
          Tell us what you need the money to do. Buy equipment? Cover cash flow?
          Refinance debt? Fund a project? Move on a property? Whatever it is,
          we&rsquo;ll help match the need to the right solution.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
        >
          <motion.a
            href={ROUTES.apply}
            className="bg-on-secondary-fixed text-primary-fixed px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-bold text-base sm:text-xl inline-block"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 25px 50px -15px rgba(0, 3, 33, 0.5)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            Get Pre-Qualified Today
          </motion.a>
          <motion.a
            href={SITE.phoneTel}
            className="text-white border-2 border-white/30 px-8 sm:px-12 py-4 sm:py-6 rounded-lg font-bold text-base sm:text-xl inline-block"
            whileHover={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.6)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            Talk to an Advisor: {SITE.phone}
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
