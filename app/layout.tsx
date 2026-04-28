import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://creditbanc.io'),
  title: 'Credit Banc | Working Capital for Your Business',
  description:
    'Access capital quickly without the stress of daily or weekly repayments. SBA loans, lines of credit, and small business funding from Credit Banc.',
  keywords: [
    'SBA loans',
    'business funding',
    'working capital',
    'line of credit',
    'small business loans',
    'Credit Banc',
  ],
  openGraph: {
    title: 'Credit Banc | Working Capital for Your Business',
    description:
      'Access capital quickly without the stress of daily or weekly repayments.',
    type: 'website',
    url: 'https://creditbanc.io',
    siteName: 'Credit Banc',
  },
};

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
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
