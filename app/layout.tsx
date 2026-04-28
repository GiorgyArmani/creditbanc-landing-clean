import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import { ROUTES, SITE, SOCIAL } from '@/lib/site';

const TITLE = 'Credit Banc | SBA Loans, Real Estate Financing & Small Business Funding';
const DESCRIPTION =
  'Credit Banc helps business owners compare working capital, SBA, and real estate financing with monthly payment options and one-on-one guidance from a real Advisor — start to finish.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: TITLE,
    template: '%s | Credit Banc',
  },
  description: DESCRIPTION,
  applicationName: 'Credit Banc',
  keywords: [
    'SBA loans',
    'SBA financing',
    'small business loans',
    'small business funding',
    'working capital loans',
    'line of credit',
    'equipment financing',
    'business term loans',
    'commercial real estate financing',
    'fix and flip loans',
    'business acquisition loans',
    'business financing advisor',
    'Credit Banc',
  ],
  authors: [{ name: 'Credit Banc', url: SITE.baseUrl }],
  creator: 'Credit Banc',
  publisher: 'Credit Banc',
  category: 'finance',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.baseUrl,
    siteName: 'Credit Banc',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/header-logo.png',
        width: 1000,
        height: 200,
        alt: 'Credit Banc — Credit & capital to grow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/header-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/favicon.ico' }],
  },
};

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'FinancialService'],
  '@id': `${SITE.baseUrl}#organization`,
  name: 'Credit Banc',
  alternateName: ['Credit Banc Financial', 'Creditbanc'],
  legalName: 'Credit Banc',
  url: SITE.baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.baseUrl}/header-logo.png`,
    width: 1000,
    height: 200,
  },
  image: `${SITE.baseUrl}/header-logo.png`,
  description: DESCRIPTION,
  slogan: 'Credit & capital to grow',
  email: SITE.email,
  telephone: `+1-${SITE.phone}`,
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  serviceType: [
    'SBA financing',
    'Real estate financing',
    'Small business funding',
    'Working capital',
    'Equipment financing',
    'Lines of credit',
    'Term loans',
    'Commercial mortgages',
  ],
  knowsAbout: [
    'SBA 7(a) loans',
    'SBA 504 loans',
    'Working capital loans',
    'Equipment financing',
    'Lines of credit',
    'Commercial real estate financing',
    'Fix and flip financing',
    'Business acquisition financing',
    'Refinancing',
    'Startup financing',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: `+1-${SITE.phone}`,
      email: SITE.email,
      availableLanguage: ['English'],
      areaServed: 'US',
    },
  ],
  sameAs: [
    SOCIAL.facebook,
    SOCIAL.instagram,
    SOCIAL.linkedin,
    SOCIAL.youtube,
    SOCIAL.trustpilot,
  ],
};

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.baseUrl}#website`,
  url: SITE.baseUrl,
  name: 'Credit Banc',
  publisher: { '@id': `${SITE.baseUrl}#organization` },
  inLanguage: 'en-US',
};

const SERVICE_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'SBA Financing',
    serviceType: 'SBA loan',
    provider: { '@id': `${SITE.baseUrl}#organization` },
    areaServed: 'US',
    description:
      'Government-backed financing for working capital, acquisitions, real estate, refinancing, startup costs, and larger growth plans. Terms up to 25 years.',
    url: ROUTES.sba,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Real Estate Financing',
    serviceType: 'Commercial real estate loan',
    provider: { '@id': `${SITE.baseUrl}#organization` },
    areaServed: 'US',
    description:
      'Property financing options for investors and business owners, including rentals, flips, construction, commercial mortgages, and owner-occupied real estate.',
    url: ROUTES.realEstate,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Small Business Funding',
    serviceType: 'Small business loan',
    provider: { '@id': `${SITE.baseUrl}#organization` },
    areaServed: 'US',
    description:
      'Working capital, equipment financing, lines of credit, term loans, and other funding options for everyday business needs and growth. Up to $250K with instant decisions.',
    url: ROUTES.smallBusiness,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }}
        />
        <Script
          id="ld-services"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_LD) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
