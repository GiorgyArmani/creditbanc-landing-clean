// =============================================================================
// About page content — Team roster + "In the Spotlight" press list.
//
// This is the ONE file to edit when people, bios, photos, socials, or press
// links change. The /about page reads everything from here.
//
// HOW TO ADD A PHOTO:
//   1. Drop the image in /public/team/ (e.g. /public/team/matt.jpg).
//      Square images crop cleanest (the card uses a square frame).
//   2. Set `photo: '/team/matt.jpg'` on that member below.
//      No photo? Leave it off — the card shows the person's initials instead.
//
// HOW TO ENABLE A BIO POPUP:
//   Add a `bio` array (one string per paragraph). As soon as a member has a
//   bio, their card becomes clickable and opens the popup. No bio = no popup.
//
// SOCIAL ICONS:
//   Only show under people who have a `socials` array (Matt, Lou, Advisors).
//   Supported `type`s: 'linkedin' | 'twitter' | 'instagram' | 'email' | 'web'.
// =============================================================================

export type SocialType =
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'email'
  | 'web';

export type Social = {
  type: SocialType;
  /** Full URL, or a plain email address for type 'email'. */
  href: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** Optional square photo in /public (e.g. '/team/matt.jpg'). */
  photo?: string;
  /** One string per paragraph. Presence of a bio makes the card open a popup. */
  bio?: string[];
  socials?: Social[];
  /**
   * URL-safe slug for this advisor's own booking page at /schedule/[slug]
   * (e.g. 'amit-imrit'). When set, their "Schedule a call" button points here
   * instead of the generic /schedule-a-call page.
   */
  slug?: string;
  /**
   * GHL booking-widget id — the part after `/widget/booking/` in the embed.
   * This is the per-advisor calendar. Falls back to the site-wide calendar when
   * omitted, so a slug page still works before the id is filled in.
   *
   * NOTE: this mirrors the calendar-id column to add on the vault `advisors`
   * table; keep the two in sync (or later generate this file from that table).
   */
  calendarId?: string;
  /**
   * Full external scheduling URL. Highest-priority override — skips both the
   * slug page and the generic page when set.
   */
  bookingUrl?: string;
  /** Direct line shown on the advisor's booking page; falls back to the site phone. */
  phone?: string;
  /** Direct email shown on the advisor's booking page; falls back to the site email. */
  email?: string;
  /** Formal full name for the booking page (cards keep the casual `name`). */
  fullName?: string;
  /**
   * GHL user id (the advisor's user in GoHighLevel). Not needed for the iframe
   * embed, but stored so we can later assign appointments / filter free slots
   * to this advisor via lib/ghl.ts. Sourced from the vault `advisors` table.
   */
  ghlUserId?: string;
};

/** Look up an advisor by their /schedule/[slug] slug. */
export function getAdvisorBySlug(slug: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.slug === slug);
}

/** Advisors/founders that have their own booking slug — drives static params. */
export function bookingSlugs(): string[] {
  return TEAM_MEMBERS.map((m) => m.slug).filter((s): s is string => !!s);
}

// Order = display order in the grid. Leadership first, then Advisors.
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Matt',
    role: 'Founder & CEO',
    photo: '/cbteam/Matt.png',
    slug: 'matthew-meehan',
    calendarId: 'zGKSE1WcbBMaMosaorSB',
    fullName: 'Matthew R. Meehan',
    phone: '+1 (407) 487-2201',
    email: 'matt@mrmcapitalgroup.com',
    ghlUserId: 'aMGVOAN3dV4NQRQbxM6j',
    // bio: [
    //   'Add Matt’s bio here. First paragraph.',
    //   'Second paragraph — background, focus, what he’s known for.',
    // ],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/matthew-r-meehan-cepa/' },
      // { type: 'twitter', href: 'https://x.com/...' },
    ],
  },
  {
    name: 'Lou',
    role: 'Co-Founder & COO',
    photo: '/cbteam/Lou.png',
    slug: 'luigi-rosabianca',
    calendarId: 'EmxnhSGwilS1s0MXYOIQ',
    fullName: 'Luigi Rosabianca',
    phone: '+1 (917) 341-5543',
    email: 'lou@shieldadvisorsllc.com',
    ghlUserId: 'pEHjvTKBO0whGZapg5ri',
    // bio: ['Add Lou’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/luigi-rosabianca/' },
    ],
  },
  {
    name: 'Grant',
    role: 'Business Advisor',
    photo: '/cbteam/Grant.png',
    slug: 'grant-dearborn',
    calendarId: 'm6S3TZYMLvwPO3o1gDcI',
    fullName: 'T. Grant Dearborn',
    phone: '+1 (978) 853-5006',
    email: 'grant@creditbanc.io',
    ghlUserId: 'vZc8STCnLDISYl2W5jap',
    // bio: ['Add this Advisor’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/t-grant-dearborn-90b40011/' },
    ],
  },
   {
    name: 'Manny',
    role: 'Business Advisor',
    photo: '/cbteam/Manny.png',
    slug: 'manny-villalobos',
    calendarId: '5wnm8tdsCtP8k3xJEkoV',
    fullName: 'Manny Villalobos',
    phone: '+1 (818) 305-4870',
    email: 'manny@creditbanc.io',
    ghlUserId: 'BEjlNTQcnaawcHrRRsPi',
    // bio: ['Add this Advisor’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/manny-villalobos-8b8320a/' },
    ],
  },
  {
    name: 'Will',
    role: 'Business Advisor',
    photo: '/cbteam/Will.png',
    slug: 'will',
    calendarId: 'e6sndsbJfGjHw0OcewrF',
    // bio: ['Add this Advisor’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
  {
    name: 'Amit',
    role: 'Business Advisor',
    photo: '/cbteam/Amit.png',
    slug: 'amit-imrit',
    calendarId: 'dmjEd6wYrXssp73tBn30',
    fullName: 'Amit Imrit',
    phone: '+1 (929) 733-5397',
    email: 'amit@creditbanc.io',
    ghlUserId: 'Nt3pxVNwbhP1oKELRyDq',
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
  {
    name: 'Gisselle',
    role: 'Underwriting Specialist',
    photo: '/cbteam/Gisselle.png',
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
  {
    name: 'Yai',
    role: 'Underwriting Specialist',
    photo: '/cbteam/Yai.png',
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
   {
     name: 'Blaine',
     role: 'Chief Results Officer',
    photo: '/cbteam/Blain.png',
     socials: [
       { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
     ],
   },
    {
     name: 'Jenny',
     role: 'Marketing Director',
    photo: '/cbteam/Jenny.png',
     socials: [
       { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
     ],
   },
  {
    name: 'Jorge',
    role: 'Lead Software Engineer',
    photo: '/cbteam/Jorge.png',
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
  {
    name: 'Jesus',
    role: 'Tech & CRM Specialist',
    photo: '/cbteam/Jesus.png',
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/company/credit-banc' },
    ],
  },
  
];

export type SpotlightItem = {
  /** Where it ran — "Forbes", "Press Release", "Podcast", etc. */
  outlet: string;
  title: string;
  /** Short human date, e.g. "May 2026". Optional. */
  date?: string;
  /** One-line teaser. Optional. */
  excerpt?: string;
  href: string;
};

/** Matt’s full author archive on Forbes — linked at the end of the list. */
export const FORBES_AUTHOR_URL =
  'https://www.forbes.com/councils/forbesfinancecouncil/people/matthewmeehan/';

// Newest first. Set `href` to '#' as a placeholder until the link is live.
export const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    outlet: 'Forbes',
    title: '6 New Rules of Small-Business Lending',
    date: 'May 2026',
    excerpt:
      'The first “yes” is not always the best one. Matt breaks down why smart borrowing is about cash flow, timing, repayment structure, and knowing what the money will feel like after it lands.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2026/05/22/6-new-rules-of-small-business-lending/',
  },
  {
    outlet: 'Forbes',
    title: 'Think Like The Wealthy: Advanced Tax Moves You Can Use Today',
    date: 'Oct 2025',
    excerpt:
      'When the tax bill gets big, the basics start looking a little underdressed. Matt breaks down advanced strategies business owners can use to manage taxable income, preserve cash, and plan before the bill shows up swinging.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/10/02/think-like-the-wealthy-advanced-tax-moves-you-can-use-today/',
  },
  {
    outlet: 'Forbes',
    title: 'How The Tax Relief Act May Impact Small Businesses',
    date: 'Aug 2025',
    excerpt:
      'The new tax bill could mean bigger deductions, extended breaks, and fresh planning opportunities for small-business owners. Matt explains what matters now, what is still fuzzy, and why your CPA should probably be hearing from you.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/08/11/how-the-tax-relief-act-may-impact-small-businesses/',
  },
  {
    outlet: 'Forbes',
    title:
      'How To Use SBA Loans For A Liquidity Event — And What To Do To Become Eligible',
    date: 'May 2025',
    excerpt:
      'Matt breaks down how business owners can use SBA 7(a) loans for succession planning, partner transitions, and strategic liquidity. Translation: get your financial house in order before a buyer starts opening closets.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/05/30/how-to-use-sba-loans-for-a-liquidity-event-and-what-to-do-to-become-eligible/',
  },
  {
    outlet: 'Forbes',
    title: 'Why You Should Think About Selling Your Business Before You Have To',
    date: 'Apr 2025',
    excerpt:
      'Waiting until you need to exit is a bold strategy, mostly because it is terrible. Matt breaks down why business owners should plan early, protect value, and stop treating their exit like a retirement-day surprise.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/04/18/why-you-should-think-about-selling-your-business-before-you-have-to/',
  },
  {
    outlet: 'Forbes',
    title:
      '10 Reasons Business Credit Should Be A Priority For Small And Medium-Sized Businesses In 2025',
    date: 'Mar 2025',
    excerpt:
      'Better financing, stronger vendor terms, cleaner loan applications, and a more attractive business when buyers come sniffing around. Matt breaks down why business credit deserves more attention before it becomes urgent.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/03/21/10-reasons-business-credit-should-be-a-priority-for-small-and-medium-sized-businesses-in-2025/',
  },
  {
    outlet: 'Forbes',
    title: 'Game-Changing SBA Updates Every Business Owner Should Know',
    date: 'Jan 2025',
    excerpt:
      'The rules around SBA lending have shifted, creating new opportunities for business owners who are ready. Matt breaks down what changed, how it could help, and why getting your financial house in order is still non-negotiable.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2025/01/17/game-changing-sba-updates-every-business-owner-should-know/',
  },
  {
    outlet: 'Forbes',
    title: 'How You Can Save Big With Research And Development Tax Credits',
    date: 'May 2023',
    excerpt:
      'Many business owners miss R&D tax credits because they assume they do not qualify. Matt breaks down who may be eligible, what counts as innovation, and why “we’ve always done it this way” is not a tax strategy.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2023/05/17/how-you-can-save-big-with-research-and-development-tax-credits/',
  },
  {
    outlet: 'Forbes',
    title: 'How A Cost Segregation Study Can Reduce Taxes And Increase Cash Flow',
    date: 'Jan 2023',
    excerpt:
      'A building is not just a building, at least not when the tax code gets involved. Matt explains how cost segregation separates property components to unlock faster depreciation, better deductions, and improved cash flow.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2023/01/24/how-a-cost-segregation-study-can-reduce-taxes-and-increase-cash-flow/',
  },
  {
    outlet: 'Forbes',
    title: 'Five Tips To Handle Hiring During Inflation',
    date: 'Sep 2022',
    excerpt:
      'Rising costs, cautious customers, and hard-to-fill roles can squeeze small businesses fast. Matt explains why capital, culture, retention, and smarter hiring strategies matter when inflation starts picking fights with your margins.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2022/09/26/five-tips-to-handle-hiring-during-inflation/',
  },
  {
    outlet: 'Forbes',
    title: 'Three Ways To Combat Inflation',
    date: 'Jun 2022',
    excerpt:
      'When prices climb, small businesses feel it from every direction. Matt explains how owners can respond with smarter budgeting, better cash management, and a plan that does more than stare angrily at supplier invoices.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2022/06/24/three-ways-to-combat-inflation/',
  },
  {
    outlet: 'Forbes',
    title: 'Three Red Flags To Consider Before Making An Investment',
    date: 'May 2022',
    excerpt:
      'A soaring stock, a smooth sales pitch, and a little FOMO can make bad ideas look expensive and impressive. Matt breaks down what investors should watch before handing over their hard-earned dollars.',
    href: 'https://www.forbes.com/councils/forbesfinancecouncil/2022/05/24/three-red-flags-to-consider-before-making-an-investment/',
  },
  {
    outlet: 'Press Release',
    title:
      "Credit Banc Partners with Kevin O'Leary's Tax Hive to Provide Business Owners with Comprehensive Tax Solutions",
    date: 'Oct 2024',
    excerpt:
      'Credit Banc and Tax Hive joined forces to help business owners pair smarter funding with smarter tax planning. Because making money is nice, but keeping more of it is where things get interesting.',
    href: 'https://www.prnewswire.com/news-releases/credit-banc-partners-with-kevin-olearys-tax-hive-to-provide-business-owners-with-comprehensive-tax-solutions-302275972.html',
  },
  {
    outlet: 'Press Release',
    title:
      'Credit Banc by Shield Advisory Group: Redefining Business Financing with Flexibility, Speed, and Results',
    date: 'Oct 2024',
    excerpt:
      'Credit Banc entered the market with a clear goal: make business funding faster, smarter, and less painful than the usual paperwork obstacle course.',
    href: 'https://www.prnewswire.com/news-releases/credit-banc-by-shield-advisory-group-redefining-business-financing-with-flexibility-speed-and-results-302269440.html',
  },
];
