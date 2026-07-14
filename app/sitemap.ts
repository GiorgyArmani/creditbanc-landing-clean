import type { MetadataRoute } from 'next';
import { ROUTES, SITE } from '@/lib/site';
import { getPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Individual blog posts, pulled from the same RSS feed the blog renders, so
  // every post is discoverable without a redeploy. A feed hiccup must not break
  // the sitemap, so failures degrade to just the static routes below.
  let posts: MetadataRoute.Sitemap = [];
  try {
    const all = await getPosts();
    posts = all.map((p) => ({
      url: `${SITE.baseUrl}/blog/${p.slug}`,
      lastModified: p.pubDate ? new Date(p.pubDate) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    posts = [];
  }

  return [
    {
      url: SITE.baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.sba}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.realEstate}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.smallBusiness}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE.baseUrl}/cash-flow-gap`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE.baseUrl}/apply-now`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.team}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.resources}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE.baseUrl}${ROUTES.blog}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE.baseUrl}/privacypolicy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...posts,
  ];
}
