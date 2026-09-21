'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { firePageView } from '@/lib/openai-pixel';

/**
 * Sends `page_viewed` on first load and on every client-side navigation.
 *
 * The pixel does not fire page views on its own, and the site is an App Router
 * SPA after the first load, so without this OpenAI would only ever see the
 * landing hit. Renders nothing.
 */
export default function OpenAIPageView() {
  const pathname = usePathname();
  useEffect(() => {
    firePageView();
  }, [pathname]);
  return null;
}
