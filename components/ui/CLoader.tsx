'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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

  // Keep refs to every <video> so we can manually drive playback. Letting
  // all six autoplay simultaneously triggers concurrent decoding and a
  // visible flicker each time a backgrounded video catches up; this
  // effect keeps only the active video playing and pauses the rest.
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        // Restart the active video so transitions always begin at frame 0.
        try {
          video.currentTime = 0;
        } catch {
          /* some browsers throw if metadata isn't ready yet */
        }
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, assets]);

  // Index advancement is driven by the arc animation's onComplete (below) —
  // no setInterval. This keeps the loader sweep, image cross-fade, and any
  // sibling animations (e.g. floating cards) on a single, drift-free clock.

  const stroke = Math.round(size * 0.028);
  const imgInset = Math.round(size * 0.06);
  const ringInset = imgInset - stroke - 4;
  const ringDiameter = size - ringInset * 2;
  const ringCenter = ringDiameter / 2;
  const pathRadius = ringCenter - stroke / 2;

  const fullArcLen = round(2 * Math.PI * pathRadius);
  // Full 360° loader — the green ring closes the circle. Rotating by +30°
  // anchors the animation's starting point to 4 o'clock so the fill
  // visibly sweeps clockwise from the lower-right.
  const arcLen = fullArcLen;
  const arcRotation = 30;

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
          // Force a dedicated compositing layer so the circular clip is
          // applied on the GPU and child <video> repaints never escape
          // the border-radius boundary.
          transform: 'translateZ(0)',
          isolation: 'isolate',
          WebkitMaskImage:
            '-webkit-radial-gradient(circle, white 100%, black 100%)',
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
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={asset.src}
                loop
                muted
                playsInline
                // Suppress every browser-injected control surface. Without
                // these, Chromium overlays a Picture-in-Picture button and
                // the OS media-session shows "previous/next track" chips on
                // hover — both visible in the hero loop unless explicitly
                // disabled here.
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                // First clip preloads aggressively so the hero never starts
                // on a black frame; the rest load on demand to keep mobile
                // payload reasonable.
                preload={i === 0 ? 'auto' : 'metadata'}
                className="absolute inset-0 w-full h-full object-cover bg-on-secondary-fixed pointer-events-none"
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
          strokeLinecap="butt"
          fill="none"
          transform={`rotate(${arcRotation} ${ringCenter} ${ringCenter})`}
        />
        <motion.circle
          key={`arc-${index}`}
          cx={ringCenter}
          cy={ringCenter}
          r={pathRadius}
          stroke="#55cf9e"
          strokeWidth={stroke}
          strokeLinecap="butt"
          fill="none"
          strokeDasharray={arcLen}
          transform={`rotate(${arcRotation} ${ringCenter} ${ringCenter})`}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: intervalMs / 1000,
            ease: [0, 0, 1, 1],
            type: 'tween',
          }}
          onAnimationComplete={() => {
            const current = index ?? 0;
            const next = (current + 1) % assets.length;
            if (!isControlled) setInternalIndex(next);
            onIndexChange?.(next);
          }}
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </svg>
    </div>
  );
}
