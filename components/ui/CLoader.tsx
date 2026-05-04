'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Asset {
  src: string;
  alt: string;
}

interface CLoaderProps {
  assets: Asset[];
  intervalMs?: number;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

export default function CLoader({
  assets,
  intervalMs = 6000,
  size,
  className = '',
  style,
}: CLoaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % assets.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [assets.length, intervalMs]);

  const stroke = Math.round(size * 0.028);
  const imgInset = Math.round(size * 0.06);
  const ringInset = imgInset - stroke - 4;
  const ringDiameter = size - ringInset * 2;
  const ringCenter = ringDiameter / 2;
  const pathRadius = ringCenter - stroke / 2;

  const fullArcLen = round(2 * Math.PI * pathRadius);
  const fullArcPath = `M ${round(ringCenter + pathRadius)} ${ringCenter} A ${pathRadius} ${pathRadius} 0 1 1 ${round(ringCenter - pathRadius)} ${ringCenter} A ${pathRadius} ${pathRadius} 0 1 1 ${round(ringCenter + pathRadius)} ${ringCenter}`;

  const imgInsetPct = (imgInset / size) * 100;
  const ringInsetPct = (ringInset / size) * 100;
  const ringDiameterPct = (ringDiameter / size) * 100;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        aspectRatio: '1 / 1',
        ...style,
      }}
    >
      <div
        className="rounded-full overflow-hidden bg-on-secondary-fixed shadow-2xl"
        style={{
          position: 'absolute',
          top: `${imgInsetPct}%`,
          left: `${imgInsetPct}%`,
          right: `${imgInsetPct}%`,
          bottom: `${imgInsetPct}%`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={assets[index].src}
              alt={assets[index].alt}
              fill
              className="object-cover"
              sizes={`(max-width: 1024px) 90vw, ${size}px`}
              priority={index === 0}
              unoptimized={assets[index].src.endsWith('.gif')}
            />
            <div className="absolute inset-0 bg-on-secondary-fixed/15 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      <svg
        viewBox={`0 0 ${ringDiameter} ${ringDiameter}`}
        style={{
          position: 'absolute',
          top: `${ringInsetPct}%`,
          left: `${ringInsetPct}%`,
          width: `${ringDiameterPct}%`,
          height: `${ringDiameterPct}%`,
          display: 'block',
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <circle
          cx={ringCenter}
          cy={ringCenter}
          r={pathRadius}
          stroke="rgba(85, 207, 158, 0.22)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.path
          key={`arc-${index}`}
          d={fullArcPath}
          stroke="#55cf9e"
          strokeWidth={stroke}
          strokeLinecap="butt"
          fill="none"
          strokeDasharray={fullArcLen}
          initial={{ strokeDashoffset: fullArcLen, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0] }}
          transition={{
            strokeDashoffset: { duration: intervalMs / 1000, ease: 'linear' },
            opacity: {
              duration: intervalMs / 1000,
              times: [0, 0.05, 0.92, 1],
              ease: 'linear',
            },
          }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(85, 207, 158, 0.55))' }}
        />
      </svg>
    </div>
  );
}
