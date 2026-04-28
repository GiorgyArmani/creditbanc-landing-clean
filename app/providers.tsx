'use client';

import { ReactNode, useEffect } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const idle =
      typeof window !== 'undefined' &&
      'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 1);

    const handle = idle(async () => {
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      let frame = requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      const handleAnchorClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest(
          'a[href^="#"]'
        ) as HTMLAnchorElement | null;
        if (!link) return;
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -96, duration: 1.2 });
      };
      document.addEventListener('click', handleAnchorClick);

      cleanup = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener('click', handleAnchorClick);
        lenis.destroy();
      };
    });

    return () => {
      if (
        typeof window !== 'undefined' &&
        'cancelIdleCallback' in window &&
        typeof handle === 'number'
      ) {
        window.cancelIdleCallback(handle);
      }
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
