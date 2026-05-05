'use client';

import { useEffect, useRef } from 'react';

interface CounterProps {
  to?: number;
  stops?: number[];
  from?: number;
  duration?: number;
  delay?: number;
  times?: number[];
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const formatNumber = (value: number, decimals: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

// easeOutCubic — slows down toward the end, feels like a real counter settling
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Counter({
  to,
  stops,
  from = 0,
  duration = 1.8,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Snapshot props in a ref so the animation effect can read latest values
  // without tearing down on every render.
  const propsRef = useRef({
    from,
    to,
    stops,
    duration,
    delay,
    prefix,
    suffix,
    decimals,
  });
  propsRef.current = {
    from,
    to,
    stops,
    duration,
    delay,
    prefix,
    suffix,
    decimals,
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let rafId: number | null = null;
    let startMs: number | null = null;
    let timeoutId: number | null = null;
    let started = false;

    const writeValue = (value: number) => {
      const p = propsRef.current;
      node.textContent = `${p.prefix}${formatNumber(value, p.decimals)}${p.suffix}`;
    };

    const start = () => {
      if (started) return;
      started = true;

      const p = propsRef.current;
      const fromVal = p.from;
      const target =
        p.stops && p.stops.length > 0
          ? p.stops[p.stops.length - 1]
          : p.to !== undefined
            ? p.to
            : 0;

      writeValue(fromVal);

      const tick = (now: number) => {
        if (startMs == null) startMs = now;
        const elapsed = (now - startMs) / 1000;
        if (elapsed >= p.duration) {
          writeValue(target);
          rafId = null;
          return;
        }
        const t = ease(elapsed / p.duration);
        writeValue(fromVal + (target - fromVal) * t);
        rafId = requestAnimationFrame(tick);
      };

      timeoutId = window.setTimeout(() => {
        rafId = requestAnimationFrame(tick);
      }, Math.max(0, p.delay * 1000));
    };

    const rect = node.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight && rect.bottom > 0;

    let observer: IntersectionObserver | null = null;
    if (alreadyVisible) {
      start();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              start();
              observer?.disconnect();
              observer = null;
              break;
            }
          }
        },
        { threshold: 0 }
      );
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      if (timeoutId != null) clearTimeout(timeoutId);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${formatNumber(from, decimals)}${suffix}`}
    </span>
  );
}
