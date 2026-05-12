'use client';

import { motion } from 'framer-motion';
import { ROUTES, SITE } from '@/lib/site';

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
        className="max-w-4xl mx-auto text-center relative"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 sm:mb-8 tracking-tighter">
          Not sure what kind of funding you need?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold mb-4 sm:mb-6 leading-relaxed">
          Good. That means you probably haven&rsquo;t been sold the wrong thing
          yet.
        </p>
        <p className="text-base sm:text-lg text-primary-fixed mb-10 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
          Tell us what you need the money to do. Buy equipment? Cover cash flow?
          Refinance debt? Fund a project? Move on a property? Whatever it is,
          we&rsquo;ll help match the need to the right solution.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <motion.a
            href={ROUTES.apply}
            target="_blank"
            rel="noopener noreferrer"
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
        </div>
      </motion.div>
    </section>
  );
}
