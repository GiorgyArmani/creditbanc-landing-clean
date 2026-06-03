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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
