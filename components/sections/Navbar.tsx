'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { ROUTES } from '@/lib/site';

const NAV_LINKS = [
  { label: 'SBA Financing', href: ROUTES.sba },
  { label: 'Real Estate Financing', href: ROUTES.realEstate },
  { label: 'Small Business Funding', href: ROUTES.smallBusiness },
  { label: 'Blog', href: ROUTES.blog },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active] = useState<string>('SBA Financing');
  const { scrollY } = useScroll();
  const paddingY = useTransform(scrollY, [0, 80], [20, 12]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0.04, 0.12]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0.7, 0.95]);

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 backdrop-blur-2xl"
      style={{
        backgroundColor: useTransform(
          bgOpacity,
          (v) => `rgba(255, 255, 255, ${v})`
        ),
        boxShadow: useTransform(
          shadowOpacity,
          (v) => `0 20px 50px -10px rgba(0, 3, 33, ${v})`
        ),
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex justify-between items-center max-w-screen-2xl mx-auto px-8"
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
      >
        <motion.a
          href="/"
          className="flex items-center"
          aria-label="Credit Banc home"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        >
          <Image
            src="/dark logo.png"
            alt="Credit Banc — Credit & capital to grow"
            width={940}
            height={280}
            priority
            className="h-12"
            style={{ width: 'auto' }}
          />
        </motion.a>
        <div
          className="hidden md:flex items-center gap-2"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.label;
            const isHovered = hovered === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                className="relative px-4 py-2 font-headline tracking-tight text-sm uppercase font-bold text-slate-700 transition-colors hover:text-primary"
              >
                {(isHovered || (!hovered && isActive)) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary-container/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </div>
        <div className="flex items-center gap-6">
          <motion.a
            href={ROUTES.team}
            className="hidden sm:block text-sm font-bold uppercase tracking-wider text-deep-navy hover:text-primary transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            Meet the Team
          </motion.a>
          <motion.a
            href={ROUTES.apply}
            className="signature-gradient text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 18px 35px -10px rgba(0, 108, 76, 0.45)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          >
            Apply Now
          </motion.a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
