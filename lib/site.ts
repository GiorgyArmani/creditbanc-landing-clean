export const SITE = {
  baseUrl: 'https://creditbanc.io',
  vaultUrl: 'https://vault.creditbanc.io',
  loginUrl: 'https://vault.creditbanc.io/auth/login',
  email: 'support@creditbanc.io',
  phone: '321-334-5099',
  phoneTel: 'tel:+13213345099',
} as const;

// All in-app routes (the GHL apex marketing pages have been replaced by native
// Next pages). Relative paths — prefix SITE.baseUrl when an absolute URL is
// needed (sitemap, JSON-LD).
export const ROUTES = {
  home: '/',
  sba: '/sba-loans',
  realEstate: '/real-estate-financing',
  smallBusiness: '/small-business-funding',
  apply: '/apply-now',
  blog: '/blog',
  resources: '/resources',
  team: '/about',
  privacy: '/privacypolicy',
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/creditbanc',
  instagram: 'https://www.instagram.com/credit_banc/',
  linkedin: 'https://www.linkedin.com/company/credit-banc',
  youtube: 'https://www.youtube.com/@Credit_Banc',
  trustpilot: 'https://www.trustpilot.com/review/creditbanc.io',
} as const;
