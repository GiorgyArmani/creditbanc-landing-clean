// JSON-LD builders for AI/search engines. Centralized so every page emits
// schema that references the same Organization @id defined in app/layout.tsx
// (that cross-linking is what lets Google / AI crawlers connect the graph).

import { SITE } from '@/lib/site';
import { FORBES_AUTHOR_URL, type TeamMember } from '@/lib/team';
import type { BlogPost } from '@/lib/blog';
import { type ProgramCategory, programsForCategory } from '@/lib/programs';

const base = SITE.baseUrl;
const ORG_ID = `${base}#organization`;

function nameSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Person schema for a team member / advisor. `worksFor` points at the
 * Organization node, and `sameAs` carries their public profiles — Matt also
 * gets his Forbes Finance Council author archive, a strong authority signal.
 */
export function personLd(member: TeamMember) {
  const name = member.fullName ?? member.name;

  const sameAs = (member.socials ?? [])
    .filter((s) => s.type !== 'email')
    .map((s) => s.href);
  if (/meehan/i.test(name)) sameAs.push(FORBES_AUTHOR_URL);

  const url = member.slug ? `${base}/schedule/${member.slug}` : `${base}/about`;
  const id = member.slug
    ? `${base}/schedule/${member.slug}#person`
    : `${base}/about#${nameSlug(name)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': id,
    name,
    jobTitle: member.role,
    worksFor: { '@id': ORG_ID },
    url,
    ...(member.photo ? { image: `${base}${member.photo}` } : {}),
    ...(member.phone ? { telephone: member.phone } : {}),
    ...(member.email ? { email: member.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** BlogPosting schema for a single /blog/[slug] post. */
export function blogPostingLd(post: BlogPost, slug: string) {
  const url = `${base}/blog/${slug}`;

  let iso: string | undefined;
  if (post.pubDate) {
    const d = new Date(post.pubDate);
    if (!Number.isNaN(d.getTime())) iso = d.toISOString();
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en-US',
    isPartOf: { '@id': `${base}#website` },
    ...(post.image ? { image: [post.image] } : {}),
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
    ...(post.categories?.length ? { articleSection: post.categories } : {}),
    author: { '@type': 'Organization', name: 'Credit Banc', '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Service + OfferCatalog schema for a funding category page. The catalog lists
 * each program as an Offer so engines understand the page covers, e.g., SBA
 * acquisition, refinance, startup, etc. — not just "SBA loans" generically.
 */
export function categoryServiceLd(category: ProgramCategory) {
  const url = `${base}/${category.slug}`;
  const programs = programsForCategory(category);

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: category.navLabel,
    serviceType: category.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: 'US',
    url,
    description: category.intro,
    isPartOf: { '@id': `${base}#website` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${category.navLabel} programs`,
      itemListElement: programs.map((p) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: p.title,
          description: p.body,
          url: `${url}#${p.id}`,
        },
      })),
    },
  };
}
