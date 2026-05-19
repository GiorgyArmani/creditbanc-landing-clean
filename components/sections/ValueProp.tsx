'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Stepper, { Step } from '../ui/Stepper';
import { ROUTES } from '@/lib/site';

// Per-step background video. Index matches Stepper's currentStep - 1.
// Swap these to real assets per step when the final cuts land — only 3
// distinct videos exist today, so step 3 reuses the step-1 clip.
const STEP_VIDEOS = [
  '/happy%20owner.mp4',
  '/happy%20owner%202.mp4',
  '/happy%20owner.mp4',
  '/moneythrow.mp4',
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

function StepVideo({ src }: { src: string }) {
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
      className="relative block w-full h-full aspect-[4/5] bg-on-secondary-fixed overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {shouldLoad && (
          <motion.video
            key={src}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 block w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ValueProp() {
  const [currentStep, setCurrentStep] = useState(1);
  const videoSrc =
    STEP_VIDEOS[Math.min(Math.max(currentStep, 1), STEP_VIDEOS.length) - 1];

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
              Funding Works Better With a{' '}
              <span className="text-primary">Human in the Room</span>
            </h2>
            <div className="text-on-surface-variant text-lg leading-relaxed mb-10 space-y-4">
              <p>
                There are a lot of ways to fund a business. (Like, a lot a
                lot.) Some are smart. Some are expensive. Some should come
                with a warning label and a stiff drink.
              </p>
              <p>
                That&rsquo;s why we don&rsquo;t start by tossing your
                information into a robot blender and hoping the algorithm has
                a good day. We start with the need, then work through the
                options like adults.
              </p>
              <p className="font-semibold text-on-secondary-fixed">
                Here&rsquo;s what that looks like.
              </p>
            </div>
            <Stepper
              backButtonText="Back"
              nextButtonText="Next Step"
              completeButtonText="Get Prequalified"
              onStepChange={setCurrentStep}
              onFinalStepCompleted={() => {
                window.open(ROUTES.apply, '_blank', 'noopener,noreferrer');
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
              <StepVideo src={videoSrc} />
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Credit Banc &middot; Just now
                  </p>
                </div>
                <p className="font-headline text-lg sm:text-xl font-bold tracking-tight text-on-secondary-fixed leading-snug">
                  Your loan has been{' '}
                  <em className="text-primary not-italic">approved.</em> Funds
                  on the way.
                </p>
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
