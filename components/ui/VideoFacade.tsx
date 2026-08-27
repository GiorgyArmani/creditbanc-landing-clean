'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2 } from 'lucide-react';

export type VideoOrientation = 'horizontal' | 'vertical';

// Minimal shape of the bits of the YouTube IFrame Player API this file uses.
// The full @types/youtube package is a large dependency for four methods.
interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTApi {
  Player: new (
    el: HTMLElement | string,
    opts: {
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number; ENDED: number };
}
declare global {
  interface Window {
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// The API script is global and single-instance, so loading is memoised at
// module scope: any number of players on a page share one load, and a second
// mount resolves immediately instead of racing.
let apiPromise: Promise<YTApi> | null = null;
function loadYouTubeApi(): Promise<YTApi> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YTApi>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('no window'));
      return;
    }
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    // YouTube calls this global once the API is usable. Chain any existing one
    // rather than overwriting — another embed may already be waiting on it.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YT API loaded without Player'));
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('YT API failed to load'));
    document.head.appendChild(script);
  });
  return apiPromise;
}

// A YouTube embed that paints instantly and can start on its own.
//
// The poster frame is plain markup, so the hero has something to show before
// any player JS exists — a live <iframe> on first paint pulls roughly a
// megabyte and drags LCP with it, which is the wrong trade on a page whose
// whole job is a fast first impression off an SMS tap. The real iframe mounts
// a beat later (autoplay) or on click (without it).
//
// AUTOPLAY REALITY: every browser blocks autoplay with sound. Muted is the
// only kind that starts on its own, and a muted talking-head video is a person
// silently moving their mouth — worse than a still frame. So muted autoplay
// ships with a deliberately loud unmute control.
//
// youtube-nocookie.com is the privacy-preserving embed host; unlisted videos
// play from it exactly like public ones.

interface VideoFacadeProps {
  /** Empty renders the marked placeholder — see FUNNEL_VIDEOS in lib/mca-funnel.ts. */
  youtubeId: string;
  title: string;
  duration?: string;
  orientation: VideoOrientation;
  /**
   * Start muted playback once the frame scrolls into view. Ignored when the
   * visitor asks for reduced motion — an unrequested moving image is exactly
   * what that setting is about — which falls back to click-to-play.
   */
  autoplay?: boolean;
  /** Fired once per milestone crossed, with the running maximum percentage. */
  onProgress?: (pct: number) => void;
  /** Fired the first time playback actually starts, however it was triggered. */
  onPlay?: () => void;
  /** Milestones to report at, ascending. */
  milestones?: readonly number[];
  className?: string;
}

const ASPECT: Record<VideoOrientation, string> = {
  horizontal: '16 / 9',
  vertical: '9 / 16',
};

const EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

// Warm the connection on intent (hover / focus, or just before an autoplay
// mount) so the player isn't paying for DNS + TLS to new origins. Once a page.
let warmed = false;
function warmYouTube() {
  if (warmed || typeof document === 'undefined') return;
  warmed = true;
  for (const href of [
    EMBED_ORIGIN,
    'https://www.google.com',
    'https://i.ytimg.com',
  ]) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function VideoFacade({
  youtubeId,
  title,
  duration,
  orientation,
  autoplay = false,
  onProgress,
  onPlay,
  milestones = [25, 50, 75, 95],
  className = '',
}: VideoFacadeProps) {
  // `null` = poster only. Once set, the player is mounted and the value says
  // whether it started muted (i.e. whether an unmute prompt is owed).
  const [startedMuted, setStartedMuted] = useState<boolean | null>(null);
  const [muted, setMuted] = useState(false);
  // maxresdefault is the only thumbnail big enough not to look soft at hero
  // size, but YouTube doesn't generate it for every upload. Fall back to
  // hqdefault, which always exists.
  const [posterFallback, setPosterFallback] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // The API attaches to an existing iframe by element, but it needs a stable
  // DOM id to hand back in its own callbacks.
  const iframeId = `yt-${useId().replace(/:/g, '')}`;

  // Progress bookkeeping lives in refs, not state: this ticks every second and
  // must never re-render the page around it.
  const maxPctRef = useRef(0);
  const firedRef = useRef<Set<number>>(new Set());
  const playedRef = useRef(false);
  // Callbacks are read through refs so the player effect doesn't tear down and
  // rebuild every time the parent re-renders with new function identities.
  const onProgressRef = useRef(onProgress);
  const onPlayRef = useRef(onPlay);
  onProgressRef.current = onProgress;
  onPlayRef.current = onPlay;

  const playing = startedMuted !== null;

  // Click-to-play always starts with sound: the click IS the gesture browsers
  // require, so there is no reason to mute it.
  const playWithSound = useCallback(() => {
    if (!youtubeId) return;
    warmYouTube();
    setMuted(false);
    setStartedMuted(false);
  }, [youtubeId]);

  useEffect(() => {
    if (!autoplay || !youtubeId) return;
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const el = frameRef.current;
    if (!el) return;

    let idleHandle: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        warmYouTube();
        // Deferred to idle so the player's network and parse cost lands after
        // the hero has painted rather than competing with it.
        const idle =
          'requestIdleCallback' in window
            ? window.requestIdleCallback
            : (cb: () => void) => window.setTimeout(cb, 200);
        idleHandle = idle(() => {
          setMuted(true);
          setStartedMuted(true);
        }) as unknown as number;
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, [autoplay, youtubeId]);

  // Attaches the IFrame Player API to the iframe once it exists, then samples
  // position once a second while playing. Reports the running MAXIMUM, so
  // scrubbing backward can't lower what a viewer is recorded as having seen.
  //
  // Only runs after the player is mounted — before that there is nothing to
  // attach to, and the API script is a cost with no benefit.
  useEffect(() => {
    if (!playing || !youtubeId) return;
    let cancelled = false;
    let player: YTPlayer | undefined;
    let timer: number | undefined;

    const sample = () => {
      if (!player) return;
      const duration = player.getDuration();
      // Returns 0 until metadata lands; dividing by it would report Infinity.
      if (!duration || duration <= 0) return;
      const pct = Math.min(100, (player.getCurrentTime() / duration) * 100);
      if (pct <= maxPctRef.current) return;
      maxPctRef.current = pct;
      for (const milestone of milestones) {
        if (pct >= milestone && !firedRef.current.has(milestone)) {
          firedRef.current.add(milestone);
          onProgressRef.current?.(Math.round(maxPctRef.current));
        }
      }
    };

    loadYouTubeApi()
      .then((YT) => {
        const el = iframeRef.current;
        if (cancelled || !el) return;
        player = new YT.Player(el, {
          events: {
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                if (!playedRef.current) {
                  playedRef.current = true;
                  onPlayRef.current?.();
                }
                window.clearInterval(timer);
                timer = window.setInterval(sample, 1000);
              } else {
                window.clearInterval(timer);
                // Catch the tail of whatever just played before stopping —
                // otherwise ending at 97% records as the last 1s tick.
                if (event.data === YT.PlayerState.ENDED) sample();
              }
            },
          },
        });
      })
      .catch(() => {
        // Tracking is not worth breaking playback over. The video still plays;
        // this lead just arrives without a watch-depth tag.
      });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      try {
        player?.destroy();
      } catch {
        // Already torn down with the iframe — nothing to clean up.
      }
    };
  }, [playing, youtubeId, milestones]);

  // Unmutes an already-running player through the IFrame API's postMessage
  // protocol (`enablejsapi=1` below is what turns it on). Remounting the
  // iframe with mute=0 would also work, but it would restart the video from
  // zero and throw away whatever the viewer already watched.
  const unmute = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    for (const func of ['unMute', 'playVideo']) {
      win.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        EMBED_ORIGIN
      );
    }
    setMuted(false);
  }, []);

  const src = `${EMBED_ORIGIN}/embed/${youtubeId}?${new URLSearchParams({
    autoplay: '1',
    mute: startedMuted ? '1' : '0',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    // Leaves the player's own controls in place, which is what gives anyone
    // the ability to pause a video that started by itself.
    controls: '1',
    enablejsapi: '1',
    origin: typeof window === 'undefined' ? '' : window.location.origin,
  }).toString()}`;

  const poster = posterFallback
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden rounded-2xl bg-on-secondary-fixed ring-1 ring-on-secondary-fixed/15 shadow-[0_40px_80px_-32px_rgba(32,37,54,0.55)] ${className}`}
      style={{ aspectRatio: ASPECT[orientation] }}
    >
      {playing ? (
        <>
          <iframe
            ref={iframeRef}
            id={iframeId}
            className="absolute inset-0 h-full w-full"
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {/* Muted autoplay is only worth anything if turning the sound on is
              obvious. Pinned to the top so it never sits over the player's own
              controls, and it leaves as soon as it is used. */}
          {muted && (
            <motion.button
              type="button"
              onClick={unmute}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="absolute left-1/2 top-4 z-10 inline-flex min-h-[44px] -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-headline text-sm font-bold text-on-secondary-fixed shadow-[0_12px_28px_-8px_rgba(32,37,54,0.7)] ring-2 ring-white/40"
            >
              <Volume2 className="h-4 w-4" aria-hidden />
              Tap for sound
            </motion.button>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={playWithSound}
          onPointerEnter={warmYouTube}
          onFocus={warmYouTube}
          disabled={!youtubeId}
          aria-label={
            youtubeId
              ? `Play video: ${title}`
              : `${title} — video not yet published`
          }
          className="group absolute inset-0 h-full w-full cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/70 focus-visible:ring-offset-0"
        >
          {youtubeId ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={poster}
              alt=""
              width={1280}
              height={720}
              onError={() => setPosterFallback(true)}
              /* Sits in the hero, so it is a candidate for LCP — fetch it
                 with the document rather than after it. */
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <PlaceholderArt orientation={orientation} />
          )}

          {/* Scrim, weighted to the bottom where our own labels sit. Kept
              light up top on purpose: these thumbnails carry their own text
              hook in the upper third, and dimming it would waste the best
              part of the frame. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/80 via-on-secondary-fixed/5 to-on-secondary-fixed/10"
          />

          <span className="absolute inset-0 flex items-center justify-center">
            <motion.span
              aria-hidden
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary shadow-[0_18px_40px_-10px_rgba(85,207,158,0.8)] ring-4 ring-white/25 sm:h-20 sm:w-20"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              <Play
                className="h-7 w-7 translate-x-[2px] fill-on-secondary-fixed text-on-secondary-fixed sm:h-8 sm:w-8"
                strokeWidth={1.5}
              />
            </motion.span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-5">
            <span className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
              {youtubeId ? 'Watch first' : 'Video placeholder'}
            </span>
            {duration && (
              <span className="rounded-full bg-black/55 px-2.5 py-1 font-label text-[11px] font-bold tracking-wide text-white tabular-nums backdrop-blur-sm">
                {duration}
              </span>
            )}
          </span>
        </button>
      )}
    </div>
  );
}

// Stands in for the poster frame if a video ID is ever blank in FUNNEL_VIDEOS.
// Deliberately reads as a placeholder rather than as finished art, so shipping
// without a real ID is obvious at a glance.
function PlaceholderArt({ orientation }: { orientation: VideoOrientation }) {
  return (
    <span aria-hidden className="absolute inset-0">
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, #2c3348 0%, #202536 55%, #171b28 100%)',
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 78%)',
        }}
      />
      <span className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full border border-dashed border-primary/50 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {orientation === 'vertical' ? '9:16 vertical' : '16:9 horizontal'}
      </span>
    </span>
  );
}
