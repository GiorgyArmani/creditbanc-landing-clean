/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old marketing links (cb-blog, linkedin, substack, youtube, ghl, …)
      // point at /start-here. Send them to the apply funnel — Next.js keeps
      // the query string (lead_source / appointment_source) intact since the
      // destination doesn't define its own.
      {
        source: '/start-here',
        destination: '/apply-now',
        permanent: true,
      },
      // The GHL booking calendar's "thank you page" has been configured with
      // both of these paths over time. Alias the short one onto the real
      // confirmation page so either calendar setting lands the client on the
      // confirmation instead of falling through to the catch-all (which sends
      // unknown paths to the home page). Temporary so the mapping stays
      // changeable if GHL's redirect URL is edited again.
      {
        source: '/appointment-confirmation',
        destination: '/appointment-confirmation-received',
        permanent: false,
      },
    ];
  },
  images: {
    // Serve AVIF first (smallest), then WebP, then fall back to the source
    // format. next/image negotiates per-request from the browser's Accept
    // header, so each browser gets the best format it supports.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
