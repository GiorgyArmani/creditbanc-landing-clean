'use client';

import { useEffect } from 'react';
import { firePendingRegistration } from '@/lib/openai-pixel';

/**
 * Sends the course signup handed off by the opt-in form page, when there is
 * one (see the handoff notes in lib/openai-pixel.ts). Renders nothing.
 */
export default function OpenAIPendingRegistration() {
  useEffect(() => {
    firePendingRegistration();
  }, []);
  return null;
}
