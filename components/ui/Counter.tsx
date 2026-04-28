'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

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

export default function Counter({
  to,
  stops,
  from = 0,
  duration = 1.8,
  delay = 0,
  times,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const sequence =
    stops && stops.length > 0 ? stops : to !== undefined ? [to] : [0];

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(from, sequence, {
      duration,
      delay,
      times,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(value) {
        node.textContent = `${prefix}${formatNumber(value, decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, from, sequence, duration, delay, times, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${formatNumber(from, decimals)}${suffix}`}
    </span>
  );
}
