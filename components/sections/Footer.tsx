'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Star, Youtube } from 'lucide-react';
import Icon from '../ui/Icon';
import { ROUTES, SITE, SOCIAL } from '@/lib/site';

const PROGRAMS = [
  { label: 'SBA Loans', href: ROUTES.sba },
  { label: 'Real Estate Loans', href: ROUTES.realEstate },
  { label: 'Small Business Funding', href: ROUTES.smallBusiness },
];

const COMPANY = [
  { label: 'Our Team', href: ROUTES.team },
  { label: `Call Us — ${SITE.phone}`, href: SITE.phoneTel },
  { label: 'Press Releases', href: `${SITE.baseUrl}/press` },
];

const RESOURCES = [
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Apply for Funding', href: ROUTES.apply },
  { label: 'Privacy Policy', href: ROUTES.privacy },
];

const SOCIALS = [
  { label: 'Facebook', href: SOCIAL.facebook, Icon: Facebook },
  { label: 'Instagram', href: SOCIAL.instagram, Icon: Instagram },
  { label: 'LinkedIn', href: SOCIAL.linkedin, Icon: Linkedin },
  { label: 'YouTube', href: SOCIAL.youtube, Icon: Youtube },
  { label: 'Trustpilot', href: SOCIAL.trustpilot, Icon: Star },
];

const colReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Footer() {
  return (
    <footer className="bg-deep-navy text-slate-400 py-20 px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <motion.div
          className="md:col-span-1"
          custom={0}
          variants={colReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image
            src="/CBLOGOWHITE.png"
            alt="Credit Banc"
            width={200}
            height={40}
            className="h-8 mb-6"
            style={{ width: 'auto' }}
          />
          <p className="text-sm leading-relaxed mb-6">
            Credit Banc helps business owners compare financing options across
            working capital, SBA, and real estate, with Advisors who guide the
            process from start to finish.
          </p>
          <h5 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">
            Follow Us
          </h5>
          <div className="flex gap-3">
            {SOCIALS.map(({ label, href, Icon: SocialIcon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-primary text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <SocialIcon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        <FooterColumn heading="Programs" links={PROGRAMS} index={1} />
        <FooterColumn heading="Company" links={COMPANY} index={2} />
        <FooterColumn heading="Resources" links={RESOURCES} index={3}>
          <li className="flex items-center gap-3 pt-2">
            <Icon name="mail" className="text-primary text-lg" />
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-primary-container transition-colors"
            >
              {SITE.email}
            </a>
          </li>
        </FooterColumn>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs tracking-wide text-center md:text-left">
          Need to contact us? Please email the team at{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="text-white hover:text-primary-container transition-colors"
          >
            {SITE.email}
          </a>
          .
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs tracking-wide">
          <a
            href={ROUTES.privacy}
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href={ROUTES.apply}
            className="hover:text-white transition-colors"
          >
            Apply for Funding
          </a>
          <span>
            Copyright {new Date().getFullYear()}. Credit Banc. All Rights
            Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  heading: string;
  links: { label: string; href: string }[];
  index: number;
  children?: React.ReactNode;
}

function FooterColumn({ heading, links, index, children }: FooterColumnProps) {
  return (
    <motion.div
      custom={index}
      variants={colReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
        {heading}
      </h5>
      <ul className="space-y-4 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="hover:text-primary-container transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
        {children}
      </ul>
    </motion.div>
  );
}
