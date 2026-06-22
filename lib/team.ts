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
};

// Order = display order in the grid. Leadership first, then Advisors.
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Matt',
    role: 'Founder & CEO',
    photo: '/cbteam/Matt.png',
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
    // bio: ['Add Lou’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/luigi-rosabianca/' },
    ],
  },
  {
    name: 'Grant',
    role: 'Business Advisor',
    photo: '/cbteam/Grant.png',
    // bio: ['Add this Advisor’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/t-grant-dearborn-90b40011/' },
    ],
  },
   {
    name: 'Manny',
    role: 'Business Advisor',
    photo: '/cbteam/Manny.png',
    // bio: ['Add this Advisor’s bio here.'],
    socials: [
      { type: 'linkedin', href: 'https://www.linkedin.com/in/manny-villalobos-8b8320a/' },
    ],
  },
  {
    name: 'Will',
    role: 'Business Advisor',
    photo: '/cbteam/Will.png',
    // bio: ['Add this Advisor’s bio here.'],
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
  {
    name: 'Blaine',
    role: 'Chief Results Officer',
    photo: '/cbteam/Blain.png',
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

// Newest first. Set `href` to '#' as a placeholder until the link is live.
export const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    outlet: 'Forbes',
    title: 'Add the headline of Matt’s Forbes article here',
    date: '2026',
    excerpt:
      'A one-line teaser for the piece — what it covers and why it matters.',
    href: '#',
  },
  {
    outlet: 'Press Release',
    title: 'Credit Banc announcement headline goes here',
    date: '2026',
    href: '#',
  },
  {
    outlet: 'Forbes',
    title: 'Another Forbes contribution or feature',
    date: '2025',
    href: '#',
  },
];
