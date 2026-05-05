'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';

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
  index?: number;
  onIndexChange?: (i: number) => void;
}

const round = (n: number) => Math.round(n * 1000) / 1000;
const isVideo = (src: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src);

export default function CLoader({
  assets,
  intervalMs = 6000,
  size,
  className = '',
  style,
  index: controlledIndex,
  onIndexChange,
}: CLoaderProps) {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(0);
  const index = isControlled ? controlledIndex : internalIndex;
  const reactId = useId();
  const animName = `cloader-arc-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    if (isControlled) return;
    const id = setInterval(() => {
      setInternalIndex((i) => {
        const next = (i + 1) % assets.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [assets.length, intervalMs, isControlled, onIndexChange]);

  const stroke = Math.round(size * 0.028);
  const imgInset = Math.round(size * 0.06);
  const ringInset = imgInset - stroke - 4;
  const ringDiameter = size - ringInset * 2;
  const ringCenter = ringDiameter / 2;
  const pathRadius = ringCenter - stroke / 2;

  const fullArcLen = round(2 * Math.PI * pathRadius);

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
        {assets.map((asset, i) => (
          <motion.div
            key={asset.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'opacity' }}
          >
            {isVideo(asset.src) ? (
              <video
                src={asset.src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                className="object-cover"
                sizes={`(max-width: 1024px) 90vw, ${size}px`}
                priority={i === 0}
                unoptimized={asset.src.endsWith('.gif')}
              />
            )}
            <div className="absolute inset-0 bg-on-secondary-fixed/15 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes ${animName} {
          from { stroke-dashoffset: ${fullArcLen}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
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
          filter: 'drop-shadow(0 0 12px rgba(85, 207, 158, 0.45))',
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
        <circle
          key={`arc-${index}`}
          cx={ringCenter}
          cy={ringCenter}
          r={pathRadius}
          stroke="#55cf9e"
          strokeWidth={stroke}
          strokeLinecap="butt"
          fill="none"
          strokeDasharray={fullArcLen}
          transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
          style={{
            animation: `${animName} ${intervalMs / 1000}s linear forwards`,
          }}
        />
      </svg>
    </div>
  );
}
