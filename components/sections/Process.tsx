'use client';

import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/site';

const STEPS = [
  {
    number: '01',
    title: 'Start with the basics',
    body: 'Tell us about your business and what you need funding for. It only takes a few minutes.',
  },
  {
    number: '02',
    title: 'Connect with an Advisor',
    body: "You'll work one-on-one with a Credit Banc Advisor who helps you understand your options.",
  },
  {
    number: '03',
    title: 'Review the next steps',
    body: 'Your Advisor will walk you through what is needed, what the process looks like, and how to prepare.',
  },
  {
    number: '04',
    title: 'Get funded',
    body: "If there's a good fit, we'll help guide you through the process from application to closing.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="py-32 px-8 bg-on-secondary-fixed text-white overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-container mb-4">
            How It Works
          </p>
          <h2 className="font-headline text-5xl font-extrabold tracking-tight mb-6">
            Getting Started is Simple
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            At Credit Banc, you work directly with an Advisor who helps you
            through the process from start to finish.
          </p>
        </motion.div>
        <div className="relative">
          <motion.div
            aria-hidden
            className="hidden md:block absolute top-10 left-0 h-[2px] bg-gradient-to-r from-primary-container/0 via-primary-container/40 to-primary-container/0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="p-8 border-l-2 border-primary-container/30 bg-white/5 backdrop-blur-sm rounded-r-lg"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  borderColor: 'rgb(133 224 191)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  y: -4,
                }}
              >
                <p className="text-sm font-black text-primary-container mb-6">
                  {step.number}
                </p>
                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href={ROUTES.apply}
            className="bg-primary-container text-on-secondary-fixed px-12 py-5 rounded-lg font-bold text-lg inline-block"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 22px 40px -12px rgba(85, 207, 158, 0.5)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            Apply Now
          </motion.a>
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary-container/10" />
    </section>
  );
}
