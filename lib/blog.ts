// lib/blog.ts
// Fetches and parses the Credit Banc GHL blog RSS feed, and cleans the
// GHL inline styling so posts render in the site's own design.
// Install dependencies: npm i fast-xml-parser sanitize-html
//                       npm i -D @types/sanitize-html

import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";

// loadContent=true returns the full post HTML inside <content:encoded>.
const FEED_URL =
  "https://rss-link.com/feed/BBjnDfnPIxgnyiQYNadE?blogId=0k0BjAL53eRAWMgv5gn4&limit=100&loadContent=true";

export interface BlogPost {
  title: string;
  slug: string;
  link: string; // canonical GHL post URL, e.g. https://creditbanc.io/post/...
  excerpt: string; // short summary from <description>
  content: string | null; // cleaned full HTML if the feed provides it, else null
  image: string | null;
  categories: string[];
  pubDate: string; // raw ISO string from the feed
  publishedLabel: string; // formatted for display
}

interface RawItem {
  title?: unknown;
  link?: unknown;
  guid?: unknown;
  description?: unknown;
  pubDate?: unknown;
  category?: unknown;
  "content:encoded"?: unknown;
  "media:content"?: unknown;
  enclosure?: { "@_url"?: string; "@_type"?: string };
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function text(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && v !== null && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"] ?? "");
  }
  return "";
}

function slugFromLink(link: string): string {
  try {
    const path = new URL(link).pathname; // -> /post/the-slug
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    return link.split("/").filter(Boolean).pop() ?? "";
  }
}

function imageFrom(item: RawItem): string | null {
  const media = text(item["media:content"]);
  if (media) return media;
  if (item.enclosure?.["@_url"]) return item.enclosure["@_url"]!;
  return null;
}

// GHL wraps everything in hardcoded inline styles (Arial, black, fixed font
// sizes) and fixed pixel width/height on images. We strip all of that so the
// site's own typography + the Tailwind `prose` classes take over, and so
// images scale on mobile. Content comes from your own blog, so this is about
// presentation, not untrusted-input defense.
function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "span", "strong", "em", "b", "i", "u", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"], // note: width/height/style dropped on purpose
    },
    // Drop every style attribute and any leftover font tags.
    disallowedTagsMode: "discard",
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank"
            ? { rel: "noopener noreferrer" }
            : {}),
        },
      }),
      // unwrap span entirely so its styling can't linger
      span: () => ({ tagName: "span", attribs: {} }),
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

// Fetch the RSS feed, retrying transient failures (429 rate-limits and 5xx)
// with exponential backoff. During `next build`, many blog pages prerender in
// parallel and GHL rate-limits the burst with a 429 — without this retry a
// single transient 429 aborts the whole build.
async function fetchFeed(): Promise<Response> {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(FEED_URL, {
      // ISR: Next refetches the feed at most once an hour. New GHL posts appear
      // automatically with no redeploy.
      next: { revalidate: 3600 },
    });
    if (res.ok) return res;
    lastStatus = res.status;
    // Only retry transient conditions; a 404/permanent error should fail fast.
    if (res.status !== 429 && res.status < 500) break;
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
  throw new Error(`RSS fetch failed: ${lastStatus}`);
}

export async function getPosts(): Promise<BlogPost[]> {
  const res = await fetchFeed();

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const items: RawItem[] = toArray(parsed?.rss?.channel?.item);

  return items.map((item) => {
    const link = text(item.link);
    const rawContent = text(item["content:encoded"]).trim();
    const pub = text(item.pubDate);

    return {
      title: text(item.title).trim(),
      slug: slugFromLink(link),
      link,
      excerpt: text(item.description).trim(),
      content: rawContent.length > 0 ? cleanContent(rawContent) : null,
      image: imageFrom(item),
      categories: toArray(item.category).map(text).filter(Boolean),
      pubDate: pub,
      publishedLabel: pub
        ? new Date(pub).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    };
  });
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
