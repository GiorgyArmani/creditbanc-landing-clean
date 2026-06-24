// Reuse the OpenGraph card for Twitter/X so both share surfaces stay in sync.
// Route-segment config (runtime) must be declared statically per file — it
// can't be re-exported — so we redeclare it and only reuse the render fn.
export const runtime = 'edge';
export const alt =
  'Credit Banc — SBA Loans, Real Estate Financing & Small Business Funding';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export { default } from './opengraph-image';
