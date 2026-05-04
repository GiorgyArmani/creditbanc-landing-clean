'use client';

import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { ROUTES } from '@/lib/site';

const VALUES = [
  {
    icon: 'psychology',
    title: 'We start with the problem.',
    body: 'Not the product. Not the shiny offer. The actual reason you need capital in the first place.',
  },
  {
    icon: 'compare_arrows',
    title: 'We look at the structure.',
    body: 'We focus on repayment, timing, cash flow, and whether the financing actually makes sense.',
  },
  {
    icon: 'forum',
    title: 'We stay in the room.',
    body: 'Questions, documents, lender requests, next steps. We walk you through the process from first review to final decision, without leaving you to chase answers on your own.',
  },
];

export default function ValueProp() {
  return (
    <section className="py-32 px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
              The Human Edge
            </p>
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-secondary-fixed mb-6">
              Funding Is Better With a{' '}
              <span className="text-primary">Human Involved</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Business financing should not feel like a second full-time job. At
              Credit Banc, you work directly with an Advisor who helps you
              understand your options, prepare what is needed, and keep the
              process moving.
            </p>
            <div className="space-y-8 mb-10">
              {VALUES.map((value, i) => (
                <motion.div
                  key={value.title}
                  className="flex gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                    <Icon
                      name={value.icon}
                      className="text-on-secondary-container"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-on-surface mb-2">
                      {value.title}
                    </h4>
                    <p className="text-on-surface-variant">{value.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="font-headline text-2xl font-bold tracking-tight text-on-secondary-fixed mb-10 leading-snug"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              To sum it up: Less guessing. Fewer surprises. Better funding
              decisions. <em className="text-primary">Revolutionary stuff.</em>
            </motion.p>
            <motion.a
              href={ROUTES.apply}
              className="signature-gradient text-white px-10 py-5 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg inline-block"
              whileHover={{
                scale: 1.04,
                boxShadow: '0 18px 35px -10px rgba(0, 108, 76, 0.45)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            >
              Start Today!
            </motion.a>
          </motion.div>
          <motion.div
            className="flex-1 bg-surface-container-high p-4 rounded-2xl relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="bg-white p-10 rounded-xl shadow-xl"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
                <Icon name="lock_open" className="text-primary text-3xl" />
              </div>
              <p className="font-headline text-2xl font-bold tracking-tight text-on-secondary-fixed mb-4">
                No obligation. No credit impact.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Tell us what you&rsquo;re looking for. There&rsquo;s no
                obligation and no impact on your credit to get started.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  Compare working capital, SBA, and real estate
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  Direct access to a real Advisor
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-on-surface">
                  <Icon name="check_circle" className="text-primary text-lg" />
                  Up to $500K in 24 hours
                </div>
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 signature-gradient rounded-full opacity-20 blur-2xl"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
