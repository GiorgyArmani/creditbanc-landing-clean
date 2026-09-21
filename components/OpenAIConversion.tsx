'use client';

import { useEffect } from 'react';
import { fireConversion, type PixelEvent } from '@/lib/openai-pixel';

interface Props {
  /** Standard event name, or `custom` paired with `customEventName`. */
  event: PixelEvent | 'custom';
  customEventName?: string;
  /**
   * Repeat guard key. Anywhere the same real-world conversion could fire from
   * must pass the same key, so a refresh or a back-button return to a funnel
   * page never counts twice.
   */
  onceKey: string;
}

/**
 * Drop into a funnel page to fire its conversion on mount. Renders nothing, so
 * it can sit anywhere in the page tree.
 */
export default function OpenAIConversion({
  event,
  customEventName,
  onceKey,
}: Props) {
  useEffect(() => {
    void fireConversion(event, { customEventName, onceKey });
  }, [event, customEventName, onceKey]);
  return null;
}
