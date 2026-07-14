// Resource hub data, shared between the page (JSON-LD) and the client grid.
// Image paths are URL-encoded because the files in /public/resources have
// spaces. `image2` is the alternate art for the testing toggle; the Blog has no
// v2, so it falls back to `image`.

export type Resource = {
  title: string;
  description: string;
  href: string;
  image: string;
  image2?: string;
  // External links open in a new tab; internal ones use next/link + same tab.
  external?: boolean;
};

export const RESOURCES: Resource[] = [
  {
    title: "Business Credit Builder Course",
    description:
      "Learn how to set up, build, and fix your business credit in four short videos, because this really did not need to be as complicated as everyone made it.",
    href: "/business-credit-builder",
    image: "/resources/Credit%20Builder.png",
    image2: "/resources/credit%20builder2.png",
  },
  {
    title: "The Weekly Newsletter",
    description:
      "A steady stream of business news, funding know-how, useful ideas, bad jokes, and strategically deployed GIFs for owners already getting plenty of boring email elsewhere.",
    href: "https://theweeklyfromshieldadvisory.substack.com/",
    image: "/resources/Newsletter.png",
    image2: "/resources/newsletter2.png",
    external: true,
  },
  {
    title: "The Liquid Lunch Project Podcast",
    description:
      "Unscripted conversations with founders, operators, and big thinkers about building companies, making money, fixing problems, and getting stuff done.",
    href: "https://theliquidlunchproject.com/",
    image: "/resources/Podcast.png",
    image2: "/resources/podcast2.png",
    external: true,
  },
  {
    title: "The Cash Flow Gap Calculator",
    description:
      "Run the numbers and see whether the problem is a funding gap, a timing issue, or receivables moving at the speed of government paperwork.",
    href: "/cash-flow-gap",
    image: "/resources/Calculator.png",
    image2: "/resources/calculator2.png",
  },
  {
    title: "Buying the American Dream",
    description:
      "Our Amazon bestselling playbook for finding, buying, and growing a business. Consider it the instruction manual for buying a business without making it up as you go.",
    href: "https://www.amazon.com/Buying-American-Dream-strategic-businesses/dp/1665736461/",
    image: "/resources/Book.png",
    image2: "/resources/book2.png",
    external: true,
  },
  {
    title: "The Blog",
    description:
      "We're no Hemingway, but we do churn out useful reads on hiring, strategy, operations, growth, money, and whatever else business ownership decides to throw at you.",
    href: "/blog",
    image: "/resources/Blog.png",
  },
  {
    title: "The Credit Banc YouTube Channel",
    description:
      "Funding breakdowns, money lessons, and growth advice. Someone had to explain this stuff like a normal person.",
    href: "https://www.youtube.com/@Credit_Banc",
    image: "/resources/YouTube.png",
    image2: "/resources/youtube2.png",
    external: true,
  },
  {
    title: "Shield Advisory Group",
    description:
      "Wall Street-level strategy, tools, and advisory support for Main Street business owners who somehow ended up doing seven jobs at once.",
    href: "https://www.shieldadvisorygroup.com",
    image: "/resources/SAG.png",
    image2: "/resources/SAG2.png",
    external: true,
  },
];
