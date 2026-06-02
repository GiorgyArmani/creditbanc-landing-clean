'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Stepper, { Step } from '../ui/Stepper';
import { ROUTES } from '@/lib/site';

// Per-step illustration. Index matches Stepper's currentStep - 1.
const STEP_IMAGES = [
  '/step%201.png',
  '/step%202.png',
  '/step%203.png',
  '/step%204.png',
];

const VALUES: { title: string; body: string[] }[] = [
  {
    title: 'First, tell us what the money needs to do.',
    body: [
      'Buy equipment. Cover cash flow. Refinance debt. Fund a project. Move on a property. Hire people. Clean up a mess. Jump on an opportunity before your bank finishes forming a committee.',
      'Whatever the move is, the money needs a job before it needs a product.',
    ],
  },
  {
    title: 'Next, we look at the structure.',
    body: [
      'Repayment, timing, cash flow, use of funds, existing debt, and whether the financing actually makes sense. You know…all the small details that become one giant "WTF happened?" if nobody pays attention.',
      'Getting approved is nice. Getting approved with the wrong structure is not exactly the victory lap people think it is.',
    ],
  },
  {
    title: 'Then, we sort through the options.',
    body: [
      'Term loans, SBA, lines of credit, equipment financing, real estate, factoring, consolidation — the list goes on. Plenty to choose from. Not all of them belong on your plate.',
      'Some funding solves the problem. Some funding creates more problems. Your Advisor’s job is to help you compare what fits, what doesn’t, what it may cost, and what kind of strings come attached.',
    ],
  },
  {
    title: 'Finally, we help get you funded.',
    body: [
      'Once the choice has been made, the paperwork gets its moment in the sun. Applications, lender questions, document requests, next steps, closing details… your Advisor helps manage all those thrilling little administrative obstacles. (You’re welcome.)',
      'And once the money hits the account, good luck getting rid of us that easily. We stick around for the next move, the next question, the next opportunity, and the next time the business decides it has plans.',
    ],
  },
];

function StepImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative block w-full h-full">
      {/* No mode="wait": both images overlap during the swap so the old one
          slowly dissolves into the new one (pure opacity cross-fade). */}
      <AnimatePresence>
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain object-bottom"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function ValueProp() {
  const [currentStep, setCurrentStep] = useState(1);
  const stepIndex = Math.min(Math.max(currentStep, 1), STEP_IMAGES.length) - 1;
  const imageSrc = STEP_IMAGES[stepIndex];

  return (
    <section
      id="process"
      className="relative overflow-hidden px-6 sm:px-8 pt-20 sm:pt-24 md:pt-28 pb-16 lg:pb-24"
      style={{
        background:
          'linear-gradient(135deg, #1f6b4e 0%, #2ea878 45%, #55cf9e 100%)',
      }}
    >
      <motion.div
        aria-hidden
        className="absolute top-12 right-4 w-72 h-72 bg-white rounded-full opacity-10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.7fr_1fr] lg:gap-10 lg:items-end">
          {/* Person image — grounded bottom-left, fills the section bottom.
              Hidden on mobile: stacked above the stepper it competes with the
              numbered steps; the stepper alone reads cleaner on small screens. */}
          <motion.div
            className="hidden lg:block relative w-full aspect-[763/658] lg:order-1 lg:scale-[1.12] origin-bottom"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepImage src={imageSrc} alt={VALUES[stepIndex].title} />
          </motion.div>

          {/* Title + stepper */}
          <motion.div
            className="lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-4">
              The Human Edge
            </p>
            <h2 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              Funding Works Better With a{' '}
              <span className="text-primary-fixed">Human in the Room</span>
            </h2>
            <p className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">
              Here&rsquo;s what that looks like.
            </p>
            <Stepper
              backButtonText="Back"
              nextButtonText="Next Step"
              completeButtonText="Get Prequalified"
              onStepChange={setCurrentStep}
              onFinalStepCompleted={() => {
                window.location.href = ROUTES.apply;
              }}
            >
              {VALUES.map((value) => (
                <Step key={value.title}>
                  <h4 className="font-headline text-xl md:text-2xl font-extrabold tracking-tight text-on-secondary-fixed mb-3 leading-snug">
                    {value.title}
                  </h4>
                  <div className="text-on-surface-variant leading-relaxed space-y-3">
                    {value.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </Step>
              ))}
            </Stepper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
