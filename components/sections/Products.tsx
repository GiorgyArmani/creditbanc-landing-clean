'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';
import { ROUTES } from '@/lib/site';

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const hoverLift = {
  whileHover: {
    y: -6,
    boxShadow: '0 30px 60px -20px rgba(0, 3, 33, 0.18)',
  },
  transition: { type: 'spring' as const, stiffness: 320, damping: 24 },
};

export default function Products() {
  return (
    <section id="solutions" className="py-32 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-20 max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Solutions
          </p>
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-secondary-fixed mb-6">
            Financing Solutions Built Around Your Business
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Not every business needs the same kind of capital, and not every
            lender gives you real options. Credit Banc helps you sort through
            working capital, equipment financing, real estate lending, and SBA
            options to find a structure that makes sense for your business and
            your cash flow.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            id="small-business"
            custom={0}
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            {...hoverLift}
            className="md:col-span-8 bg-surface-container-lowest p-12 rounded-xl border border-outline-variant/15 hover:border-primary/30 transition-colors group"
          >
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <Icon
                  name="storefront"
                  className="text-4xl text-primary mb-6"
                />
                <h3 className="text-3xl font-bold mb-4 text-on-surface">
                  Small Business Funding
                </h3>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  Working capital, equipment financing, term loans, lines of
                  credit, factoring, and more.
                </p>
                <motion.a
                  href={ROUTES.smallBusiness}
                  className="text-primary font-bold border-b-2 border-primary pb-1 inline-flex items-center gap-2"
                  whileHover={{ gap: '1rem' }}
                >
                  Learn More <Icon name="arrow_forward" />
                </motion.a>
              </div>
              <div className="w-full md:w-1/2 aspect-video rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLHJ3M7hF-CdJznUP3qmGm9tA6XEmD6DYD21VBAbrXmERtYt4z88Tah4AJbgn98bHP-DJK-jmGR6otffcx7eLvWDs4E2tiZxqyOM69dKZ_vATg-LDx1eGJ_d9MIc4KaayZwvvhOKGOVTvWEncD8Jqq8Z0h7mKJnsboDVWERWy9unj63RH3koPq8I7C5coyLLQA0H84ckB7VsX6uvcMX2qziYn6YK3sS6nZ_tpJDIxGe_u-GY6766K8cI8pg7I7AsHx3h5NaL2E29s"
                  alt="Small business owner reviewing options"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            id="real-estate"
            custom={1}
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            {...hoverLift}
            className="md:col-span-4 bg-on-secondary-fixed p-12 rounded-xl text-white flex flex-col justify-between"
          >
            <div>
              <Icon
                name="domain"
                className="text-4xl text-primary-container mb-6"
              />
              <h3 className="text-3xl font-bold mb-4">Real Estate Loans</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Financing for rental properties, fix-and-flips, commercial
                mortgages, construction, and business real estate.
              </p>
            </div>
            <motion.a
              href={ROUTES.realEstate}
              className="signature-gradient text-white w-full py-4 rounded-lg font-bold text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          <motion.div
            id="sba"
            custom={2}
            variants={cardReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            {...hoverLift}
            className="md:col-span-12 bg-surface-container-highest p-12 rounded-xl border border-outline-variant/15"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative aspect-video">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtfPh2GVbAf1ZSwDsqv9GNZ96yUEklqMoJXkM6vhKzFiTSp2OurfAFaTIxvrzsFulKa3m4IGET6GeoFVZVbZblfwFz974x1Y8VFNex4QbN8zRgm1L7jzqlU6myl_Bb-d5gdJFaW5O4BNIkDCFCf8hVCcje408P8OVf4ZOtWcMsh-HHdAjblw6782plIxF1Xwp4kOuqevmMbCfy3S2s-gyURWIgIVf9UaZr8M55lnqinujSqQ4zwQX0ZtbQtJl759Jw264NOYNo7aU"
                  alt="Reviewing SBA financing options"
                  fill
                  className="rounded-xl shadow-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="order-1 md:order-2">
                <Icon
                  name="account_balance"
                  className="text-4xl text-primary mb-6"
                />
                <h3 className="text-3xl font-bold mb-4 text-on-surface">
                  SBA Financing
                </h3>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  Flexible options for acquisitions, commercial real estate,
                  startup costs, refinancing, and working capital.
                </p>
                <motion.a
                  href={ROUTES.sba}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-bold inline-block"
                  whileHover={{
                    scale: 1.04,
                    boxShadow: '0 18px 35px -12px rgba(0, 108, 76, 0.45)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                >
                  Learn More
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
