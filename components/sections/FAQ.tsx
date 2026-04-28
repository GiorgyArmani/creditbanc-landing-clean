'use client';

import { useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ROUTES, SITE } from '@/lib/site';

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'What does Credit Banc do?',
    a: `Credit Banc helps small business owners and real estate investors compare financing options across working capital, SBA, and real estate. Every applicant works one-on-one with an Advisor who guides them from first conversation to closing.`,
  },
  {
    q: 'What types of financing does Credit Banc offer?',
    a: `Credit Banc offers SBA financing (working capital, acquisitions, real estate, refinancing, startup costs), real estate financing (rentals, flips, construction, commercial mortgages, owner-occupied real estate), and small business funding (working capital, equipment financing, lines of credit, and term loans).`,
  },
  {
    q: 'How fast can I get funded?',
    a: `Qualifying small business applicants can receive up to $500K in as little as 24 hours. SBA and real estate timelines vary based on the structure and documentation required, and your Advisor will walk you through realistic expectations up front.`,
  },
  {
    q: 'Is there a credit check or obligation to apply?',
    a: `No. Telling Credit Banc what you're looking for has no obligation and no impact on your credit. A soft review with your Advisor helps identify the right structures before any lender pulls credit.`,
  },
  {
    q: 'What are the loan terms and payment structure?',
    a: `Credit Banc focuses on financing with monthly payments — not the daily or weekly debit structure common to merchant cash advances. SBA financing offers terms up to 25 years, and term loans, lines of credit, and equipment financing each carry their own structure that your Advisor will compare for you.`,
  },
  {
    q: 'Do I need collateral to qualify?',
    a: `Many small business funding options through Credit Banc require no collateral for qualifying businesses. Real estate and larger SBA structures may use the financed asset as collateral. Your Advisor will explain exactly what each lender requires before you commit.`,
  },
  {
    q: 'Who works with me through the process?',
    a: `Every applicant is paired with a Credit Banc Advisor — a real person, not an algorithm. Your Advisor explains your options, prepares your documentation, and stays with you from application to closing.`,
  },
  {
    q: 'How do I get started?',
    a: `Apply at ${ROUTES.apply}, call ${SITE.phone}, or email ${SITE.email}. The first conversation is free, takes a few minutes, and carries no obligation.`,
  },
];

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-32 px-8 bg-surface"
    >
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className="font-headline text-5xl font-extrabold tracking-tight text-on-secondary-fixed"
          >
            What business owners ask Credit Banc
          </h2>
        </motion.div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-surface-container-low"
                >
                  <span className="font-headline text-lg font-bold tracking-tight text-on-secondary-fixed">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="shrink-0 text-primary"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-on-surface-variant leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
