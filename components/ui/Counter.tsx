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
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const propsRef = useRef({
    from,
    to,
    stops,
    duration,
    delay,
    times,
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
    times,
    prefix,
    suffix,
    decimals,
  };

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const p = propsRef.current;
    const sequence =
      p.stops && p.stops.length > 0
        ? p.stops
        : p.to !== undefined
          ? [p.to]
          : [0];
    const controls = animate(p.from, sequence, {
      duration: p.duration,
      delay: p.delay,
      times: p.times,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(value) {
        node.textContent = `${p.prefix}${formatNumber(value, p.decimals)}${p.suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${formatNumber(from, decimals)}${suffix}`}
    </span>
  );
}
