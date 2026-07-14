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
