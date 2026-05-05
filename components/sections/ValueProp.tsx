'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Stepper, { Step } from '../ui/Stepper';
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

function LazyValueVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="block w-full h-full object-cover aspect-[4/5] bg-on-secondary-fixed"
    >
      {shouldLoad && (
        <video
          src="/happy%20owner.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="block w-full h-full object-cover aspect-[4/5]"
        />
      )}
    </div>
  );
}

export default function ValueProp() {
  return (
    <section className="py-20 sm:py-28 md:py-32 px-6 sm:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
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
            <h2 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-on-secondary-fixed mb-6">
              Funding Is Better With a{' '}
              <span className="text-primary">Human Involved</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Business financing should not feel like a second full-time job. At
              Credit Banc, you work directly with an Advisor who helps you
              understand your options, prepare what is needed, and keep the
              process moving.
            </p>
            <Stepper
              backButtonText="Back"
              nextButtonText="Next Step"
              completeButtonText="Got It"
            >
              {VALUES.map((value) => (
                <Step key={value.title}>
                  <h4 className="font-headline text-xl md:text-2xl font-extrabold tracking-tight text-on-secondary-fixed mb-2 leading-snug">
                    {value.title}
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    {value.body}
                  </p>
                </Step>
              ))}
            </Stepper>
          </motion.div>
          <motion.div
            className="flex-1 bg-surface-container-high p-4 rounded-2xl relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative rounded-xl shadow-xl overflow-hidden bg-on-secondary-fixed"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              <LazyValueVideo />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-on-secondary-fixed/90 via-on-secondary-fixed/50 to-transparent pointer-events-none"
              />
              <motion.div
                className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 bg-surface-container-lowest/95 backdrop-blur-sm rounded-xl shadow-2xl p-5 sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-headline text-lg sm:text-xl font-bold tracking-tight text-on-secondary-fixed mb-4 leading-snug">
                  Less guessing. Fewer surprises. Better funding decisions.{' '}
                  <em className="text-primary">Revolutionary stuff.</em>
                </p>
                <motion.a
                  href={ROUTES.apply}
                  className="signature-gradient text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg inline-block"
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
