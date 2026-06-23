'use client';

import { useState } from 'react';
import Script from 'next/script';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const FAQ_ITEMS: { q: string; a: string[] }[] = [
  {
    q: 'What does Credit Banc actually do?',
    a: [
      `Credit Banc helps small business owners and real estate investors find financing that fits the business, the goal, and the cash flow. (Wild concept, apparently.)`,
      `That may include working capital, SBA financing, business lines of credit, equipment financing, commercial real estate loans, project financing, or business debt consolidation. An Advisor helps you compare options, understand the tradeoffs, and move forward with a structure that makes sense.`,
      `Because surprises belong at birthday parties, not buried in your funding terms.`,
    ],
  },
  {
    q: 'What types of business financing does Credit Banc offer?',
    a: [
      `Credit Banc offers small business funding, SBA financing, business lines of credit, equipment financing, accounts receivable financing, commercial real estate financing, business acquisition financing, project financing, and debt consolidation options.`,
      `Some programs are built for speed. Others are built for better terms, larger deals, or cleaner monthly payments. Our job is not to bury you in choices. It is to help you find the one worth choosing.`,
    ],
  },
  {
    q: 'Can I check my funding options without hurting my credit?',
    a: [
      `Yes! Getting prequalified with Credit Banc has no impact on your credit score.`,
      `We start with a soft review to understand your business, goals, and possible funding options. If a lender requires a hard pull later, your Advisor will explain it before anything moves forward. Credit surprises are not our idea of customer service.`,
    ],
  },
  {
    q: 'How fast can I get funded?',
    a: [
      `Depending on the program, some businesses can receive funding in as little as 24 hours.`,
      `Working capital and small business funding options may move faster, while SBA financing, commercial real estate loans, business acquisition financing, and larger business debt consolidation structures usually take longer because they require more documentation and underwriting.`,
      `Fast matters. Getting the right program matters more.`,
    ],
  },
  {
    q: 'What are the loan terms and payment structures?',
    a: [
      `Credit Banc focuses on financing structures that support cash flow, including monthly payment options and extended terms.`,
      `Why? We prefer financing that gives your cash flow room to work. Daily and weekly payments just aren't our thing. (They look innocent enough until the withdrawals start running the calendar.)`,
      `That's why we help you compare loan terms, payment options, and funding structures, including SBA financing, term loans, business lines of credit, equipment financing, and real estate loans, so the repayment plan supports the business instead of crowding it.`,
    ],
  },
  {
    q: 'Do I need perfect credit to qualify?',
    a: [
      `Nope. You do not need perfect credit to start the conversation.`,
      `Some funding options focus more on revenue. Some look at cash flow. Others consider time in business or the purpose of the funding. Your credit score matters, but it is not the entire personality test.`,
      `And if your business credit needs work, we won't just shrug and hand you a rejection letter. We may point you toward our free Business Credit Builder Course so you can start improving the parts lenders actually look at.`,
    ],
  },
  {
    q: 'Will I work with a real person?',
    a: [
      `Yes. Every applicant works with a real (and handsome!) Credit Banc Advisor.`,
      `No chatbot handoffs. No "please select from the following options" energy. Your human Advisor helps explain your funding options, review documentation, compare business financing structures, and guide you through the process.`,
      `Very old-school. Very effective.`,
    ],
  },
  {
    q: 'Do I need collateral?',
    a: [
      `Not always.`,
      `Many small business funding options may not require collateral for qualifying businesses. SBA financing, commercial real estate loans, equipment financing, and business acquisition financing may involve collateral depending on the structure, deal size, and lender requirements.`,
      `Your Advisor will explain what each option requires before you move forward, because "wait, I need what" is not a fun surprise halfway through.`,
    ],
  },
  {
    q: 'Can Credit Banc help with business debt consolidation or MCA payments?',
    a: [
      `Yes. Credit Banc helps business owners explore options for business debt consolidation, MCA consolidation, and refinancing expensive short-term business debt, including merchant cash advances, daily payments, and weekly payments.`,
      `Stacked short-term debt happens fast. We get it. One advance solves an immediate problem, then the repayment schedule starts acting like it owns the place. The goal is to reduce pressure on cash flow and move toward a cleaner repayment structure.`,
    ],
  },
  {
    q: 'How do I get started?',
    a: [
      `Get started here by sharing a few details about your business.`,
      `Tell us what you're trying to accomplish, the amount you have in mind, and how the funding would support the business. Your Credit Banc Advisor will use that information to understand the situation and recommend possible funding options.`,
      `Like any good introduction, the goal is simple: understand what you need before anyone starts making recommendations.`,
    ],
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
      text: item.a.join('\n\n'),
    },
  })),
};

export default function FAQ({
  variant = 'surface',
}: {
  /** 'surface' = cream landing section; 'green' = emerald gradient (calendar pages). */
  variant?: 'surface' | 'green';
} = {}) {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const green = variant === 'green';

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={`py-20 sm:py-28 md:py-32 px-6 sm:px-8 ${
        green ? 'text-white' : 'bg-surface'
      }`}
      style={
        green
          ? {
              background:
                'linear-gradient(135deg, #1f6b4e 0%, #2ea878 50%, #34b07d 100%)',
            }
          : undefined
      }
    >
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={`font-label text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
              green ? 'text-white/80' : 'text-primary'
            }`}
          >
            Frequently Asked Questions
          </p>
          <h2
            id="faq-heading"
            className={`font-headline text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter mb-4 leading-[1.02] ${
              green ? 'text-white' : 'text-on-secondary-fixed'
            }`}
          >
            <span className="md:whitespace-nowrap">Questions Worth Asking</span>{' '}
            <span
              className={`block md:inline mt-1 md:mt-0 ${
                green
                  ? 'text-primary-fixed md:text-white'
                  : 'text-primary md:text-on-secondary-fixed'
              }`}
            >
              Before You Borrow
            </span>
          </h2>
          <p
            className={`leading-relaxed max-w-2xl mx-auto ${
              green ? 'text-white/85' : 'text-on-surface-variant'
            }`}
          >
            Call us old-fashioned, but you should know who you're getting into bed with before the fine print takes its pants off.
          </p>
        </motion.div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() => setSectionOpen((v) => !v)}
            aria-expanded={sectionOpen}
            aria-controls="faq-list"
            className={`inline-flex items-center gap-3 px-7 py-3 rounded-full border shadow-sm font-bold text-sm uppercase tracking-widest transition-all ${
              green
                ? 'bg-white/10 border-white/25 text-white hover:bg-white/15 hover:border-white/45'
                : 'bg-surface-container-lowest border-outline-variant/30 text-on-secondary-fixed hover:border-primary/60 hover:shadow-md'
            }`}
          >
            {sectionOpen ? 'Hide Questions' : 'Show All Questions'}
            <motion.span
              animate={{ rotate: sectionOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={green ? 'text-white' : 'text-primary'}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {sectionOpen && (
            <motion.div
              id="faq-list"
              key="faq-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {FAQ_ITEMS.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div
                      key={item.q}
                      className={`rounded-xl border overflow-hidden ${
                        green
                          ? 'border-white/15 bg-white/5'
                          : 'border-outline-variant/20 bg-surface-container-lowest'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        className={`w-full flex items-center justify-between gap-6 px-6 py-5 text-left transition-colors ${
                          green ? 'hover:bg-white/10' : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <span
                          className={`font-headline text-lg font-bold tracking-tight ${
                            green ? 'text-white' : 'text-on-secondary-fixed'
                          }`}
                        >
                          {item.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className={`shrink-0 ${green ? 'text-white' : 'text-primary'}`}
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
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div
                              className={`px-6 pb-5 leading-relaxed space-y-3 ${
                                green ? 'text-white/85' : 'text-on-surface-variant'
                              }`}
                            >
                              {item.a.map((p, j) => (
                                <p key={j}>{p}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
