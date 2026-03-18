"use client"

import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { Heart, Share2, Download } from 'lucide-react';
import { Heart as HeartFilled } from 'lucide-react';
import type { Sound } from '@/lib/types/sound';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { apiClient } from '@/lib/api/client';
import ShareModal from '@/components/share/share-modal';
import { getSoundDetailPath } from '@/lib/utils/slug';
import { getDisplaySoundName } from '@/lib/utils';

interface CompactSoundButtonProps {
  sound: Sound;
  isAboveTheFold?: boolean;
  customSize?: number;
  hideLabel?: boolean;
  hideActions?: boolean;
  isMobileDevice?: boolean;
  /** Override detail page path (e.g. /sound-effects/slug/id) */
  detailPath?: string;
}

// Global audio context
let audioContext: AudioContext | null = null;
let audioContextUnlocked = false;

/** Unlock AudioContext on first user gesture (desktop autoplay policy). Call from capture phase so it runs before button handlers. */
function unlockAudioContextOnce() {
  if (audioContextUnlocked || typeof window === 'undefined') return;
  audioContextUnlocked = true;
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
  } catch (e) {}
  document.removeEventListener('click', unlockAudioContextOnce, true);
  document.removeEventListener('touchstart', unlockAudioContextOnce, true);
  document.removeEventListener('keydown', unlockAudioContextOnce, true);
}

// Detect mobile for stricter audio handling (fewer concurrent elements, avoid reusing busy elements)
const getIsMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android|webOS|Mobile/i.test(navigator.userAgent) ||
    (typeof window !== 'undefined' && 'ontouchstart' in window && window.innerWidth < 1024);
};

// Global audio cache for instant playback - keyed by audio URL
const audioCache = new Map<string, HTMLAudioElement>();
const CACHE_ACCESS_TIMES = new Map<string, number>(); // Track last access for LRU
const MAX_CACHE_SIZE_DESKTOP = 50;
const MAX_CACHE_SIZE_MOBILE = 5;

// Resolved S3 playback URLs (avoid 302 round-trip). Key: sound id, value: { url, expires }
const RESOLVED_URL_TTL_MS = 10 * 60 * 1000; // 10 min (presigned is 1h)
const resolvedUrlCache = new Map<number, { url: string; expires: number }>();

const getResolvedPlaybackUrl = (soundId: number): string | null => {
  const entry = resolvedUrlCache.get(soundId);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.url;
};

const setResolvedPlaybackUrl = (soundId: number, url: string) => {
  resolvedUrlCache.set(soundId, { url, expires: Date.now() + RESOLVED_URL_TTL_MS });
};

const getMaxCacheSize = () => (getIsMobile() ? MAX_CACHE_SIZE_MOBILE : MAX_CACHE_SIZE_DESKTOP);

const cleanupAudioCache = (maxSize?: number) => {
  const limit = maxSize ?? getMaxCacheSize();
  if (audioCache.size <= limit) return;
  const entries = Array.from(CACHE_ACCESS_TIMES.entries()).sort((a, b) => a[1] - b[1]);
  const toRemove = Math.max(1, Math.floor(limit * 0.4));
  for (let i = 0; i < toRemove && i < entries.length; i++) {
    const [url] = entries[i];
    const audio = audioCache.get(url);
    if (audio) {
      try {
        audio.pause();
        audio.src = '';
        audio.onended = null;
        audio.onpause = null;
        audio.onerror = null;
      } catch (e) { }
    }
    audioCache.delete(url);
    CACHE_ACCESS_TIMES.delete(url);
  }
};

const normalizeAudioUrl = (sound: Sound): string | null => {
  const sf = (sound as any).sound_file;
  // Prefer sound.sound_file when it's a full URL or blob (for TTS preview)
  if (sf && typeof sf === 'string' && (sf.startsWith('http') || sf.startsWith('blob:') || sf.startsWith('data:'))) return sf;
  if (sound.id && typeof sound.id === 'number') {
    // Prefer cached S3 URL so audio loads directly from S3 (no 302)
    const resolved = getResolvedPlaybackUrl(sound.id);
    if (resolved) return resolved;
    return apiClient.getSoundAudioUrl(sound.id) as string;
  }
  console.error('Sound missing ID, cannot create audio URL:', sound);
  return null;
};

const createAudio = (audioUrl: string): HTMLAudioElement => {
  const isMobile = getIsMobile();
  const maxCache = getMaxCacheSize();

  if (audioCache.has(audioUrl)) {
    const cached = audioCache.get(audioUrl)!;
    // On mobile: don't reuse element that's still loading or in use (avoids iOS "some sounds don't play")
    if (isMobile && (cached.readyState < 2 || !cached.paused)) {
      try {
        cached.pause();
        cached.src = '';
        cached.onended = null;
        cached.onpause = null;
        cached.onerror = null;
      } catch (e) { }
      audioCache.delete(audioUrl);
      CACHE_ACCESS_TIMES.delete(audioUrl);
    } else {
      CACHE_ACCESS_TIMES.set(audioUrl, Date.now());
      cached.loop = false;
      if (cached.currentTime > 0) cached.currentTime = 0;
      if (!cached.paused) {
        cached.pause();
        cached.currentTime = 0;
      }
      return cached;
    }
  }

  cleanupAudioCache(maxCache);
  const audio = new Audio(audioUrl);
  audio.loop = false;
  audio.preload = 'auto';
  audio.crossOrigin = 'anonymous';
  audio.setAttribute('playsinline', 'true');
  audio.setAttribute('webkit-playsinline', 'true');

  audio.onerror = (e) => {
    console.error('Audio playback error:', {
      url: audioUrl,
      error: e,
      code: (audio as any).error?.code,
      message: (audio as any).error?.message
    });
    const cachedAudio = audioCache.get(audioUrl);
    if (cachedAudio) {
      try {
        cachedAudio.pause();
        cachedAudio.src = '';
      } catch (err) { }
    }
    audioCache.delete(audioUrl);
    CACHE_ACCESS_TIMES.delete(audioUrl);
  };

  audio.addEventListener('error', (e) => {
    console.error('Audio load error:', {
      url: audioUrl,
      error: e,
      code: (audio as any).error?.code,
      message: (audio as any).error?.message
    });
  }, { once: true });

  audio.load();
  return audio;
};

const CompactSoundButton: React.FC<CompactSoundButtonProps> = ({ sound, isAboveTheFold = false, customSize, hideLabel = false, hideActions = false, isMobileDevice = false, detailPath: detailPathProp }) => {
  const router = useRouter();
  const { token } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(!!(sound as { is_liked?: boolean }).is_liked);
  const [likesCount, setLikesCount] = useState(sound.likes_count ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const lastTouchAtRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Prefetch direct S3 URL when button is visible so first tap skips 302 round-trip
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (getResolvedPlaybackUrl(sound.id)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        const id = sound.id;
        if (getResolvedPlaybackUrl(id)) return;
        apiClient.getSoundAudioPlaybackUrl(id).then((url) => setResolvedPlaybackUrl(id, url)).catch(() => {});
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sound.id]);

  // Unlock AudioContext on first user gesture (desktop) so Auto Play works
  useEffect(() => {
    if (typeof document === 'undefined' || audioContextUnlocked) return;
    document.addEventListener('click', unlockAudioContextOnce, true);
    document.addEventListener('touchstart', unlockAudioContextOnce, true);
    document.addEventListener('keydown', unlockAudioContextOnce, true);
    return () => {
      document.removeEventListener('click', unlockAudioContextOnce, true);
      document.removeEventListener('touchstart', unlockAudioContextOnce, true);
      document.removeEventListener('keydown', unlockAudioContextOnce, true);
    };
  }, []);

  useEffect(() => {
    if (token) {
      setIsFavorite(!!(sound as { is_favorited?: boolean }).is_favorited);
    } else {
      setIsFavorite(false);
    }
  }, [sound.id, (sound as { is_favorited?: boolean }).is_favorited, token]);

  const detailUrl = React.useMemo(
    () => detailPathProp ?? getSoundDetailPath(sound.name ?? '', sound.id),
    [detailPathProp, sound.name, sound.id]
  );

  const handlePlay = useCallback(async () => {
    if (typeof window !== 'undefined') {
      if (!audioContext) {
        try { audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch (e) { }
      }
      // Desktop: await resume so Auto Play is not blocked by suspended AudioContext
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume().catch(() => { });
      }
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    window.dispatchEvent(new CustomEvent('pause-all-sounds', { detail: { exceptId: sound.id } }));

    // Prefer cached S3 URL (from prefetch) so audio loads directly from S3; else API URL (302 redirect)
    let audioUrl = normalizeAudioUrl(sound);
    if (!audioUrl) {
      console.error('Failed to generate audio URL for sound:', sound);
      setIsLoading(false);
      return;
    }
    // If we used API URL (redirect), cache S3 URL in background so next tap is instant
    if (audioUrl.includes('/audio') && !audioUrl.includes('amazonaws')) {
      apiClient.getSoundAudioPlaybackUrl(sound.id).then((url) => setResolvedPlaybackUrl(sound.id, url)).catch(() => {});
    }

    // Clear old audio if URL changed (especially if switching from S3 to API)
    if (audioUrlRef.current && audioUrlRef.current !== audioUrl) {
      // URL changed - clear old audio reference
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        } catch (e) {}
        audioRef.current = null;
      }
      // Remove old S3 URLs from cache if they exist
      if (audioUrlRef.current.includes('s3.us-east-2.amazonaws.com')) {
        audioCache.delete(audioUrlRef.current);
        CACHE_ACCESS_TIMES.delete(audioUrlRef.current);
      }
    }

    audioUrlRef.current = audioUrl;

    let audio = audioRef.current;

    // Normalize URL
    const normalizeUrl = (url: string) => {
      try { return new URL(url, window.location.href).href; } catch { return url; }
    };
    const normalizedAudioUrl = normalizeUrl(audioUrl);
    const isNewAudio = !audio || !audio.src || normalizeUrl(audio.src) !== normalizedAudioUrl;

    if (isNewAudio) {
      audio = createAudio(audioUrl);
      audioRef.current = audio;
      if (!audioCache.has(audioUrl)) audioCache.set(audioUrl, audio);

      const audioElement = audio;
      if (!audioElement.onended) {
        audioElement.onended = () => {
          setIsPlaying(false);
          setIsLoading(false);
          setIsPressed(false);
          (audioElement as any)._isPlayingAttempt = false;
          audioElement.currentTime = 0;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          window.dispatchEvent(new CustomEvent('sound-ended', { detail: { soundId: sound.id } }));
        };
        audioElement.onpause = () => {
          const isPlayingAttempt = (audioElement as any)._isPlayingAttempt || false;
          if (audioElement.ended) {
            setIsPressed(false);
            setIsPlaying(false);
            setIsLoading(false);
            (audioElement as any)._isPlayingAttempt = false;
            return;
          }
          if (isPlayingAttempt && !audioElement.ended) {
            setTimeout(() => {
              if (audioElement.paused && !audioElement.ended && (audioElement as any)._isPlayingAttempt) {
                audioElement.play().catch(() => { });
              }
            }, 50);
            return;
          }
          if (audioElement.paused && audioElement.currentTime === 0 && !audioElement.ended && !isPlayingAttempt) {
            setIsPlaying(false);
            setIsLoading(false);
            setIsPressed(false);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          }
        };
        audioElement.oncanplay = () => setIsLoading(false);
        audioElement.oncanplaythrough = () => setIsLoading(false);
        audioElement.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          const cachedAudio = audioCache.get(audioUrl!);
          if (cachedAudio) {
            try { cachedAudio.pause(); cachedAudio.src = ''; } catch (err) { }
          }
          audioCache.delete(audioUrl!);
          CACHE_ACCESS_TIMES.delete(audioUrl!);
        };
      }
    }

    if (!audio) { setIsLoading(false); return; }

    audio.currentTime = 0;
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPressed(true);
    setIsLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

    loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 3000);

    // CRITICAL for mobile: play() must be called synchronously within the user gesture
    // (no await before play). Do not wait for canplay/ready first.
    let playPromise: Promise<void>;
    try {
      if (audio.readyState < 2) audio.load();
      (audio as any)._isPlayingAttempt = true;
      playPromise = audio.play();
    } catch (syncErr) {
      (audio as any)._isPlayingAttempt = false;
      setIsLoading(false);
      setIsPlaying(false);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      return;
    }

    const audioElement = audio as any;
    const finishPlay = async () => {
      try {
        await playPromise;
        const isActuallyPlaying = !audio.paused && !audio.ended;
        if (isActuallyPlaying) {
          setIsPlaying(true);
          setIsLoading(false);
          setIsPressed(false);
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          if (token) apiClient.recordPlay(sound.id, token).catch(() => {});
          const monitorStartTime = Date.now();
          const MONITOR_RESUME_MS = 800;
          const monitorInterval = setInterval(() => {
            if (audio.ended) {
              setIsPressed(false);
              setIsPlaying(false);
              setIsLoading(false);
              audioElement._isPlayingAttempt = false;
              clearInterval(monitorInterval);
              return;
            }
            const elapsed = Date.now() - monitorStartTime;
            if (elapsed > MONITOR_RESUME_MS) return;
            if (audioElement._isPlayingAttempt && audio.paused && !audio.ended) {
              audio.play().catch(() => { });
            }
          }, 100);
          setTimeout(() => {
            clearInterval(monitorInterval);
            audioElement._isPlayingAttempt = false;
            if (audio.ended || (audio.paused && audio.currentTime === 0)) setIsPressed(false);
          }, 1000);
        } else {
          audioElement._isPlayingAttempt = false;
          setIsPlaying(false);
          setIsLoading(false);
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        }
      } catch (playError: unknown) {
        const err = playError as { name?: string };
        console.error('Audio play error:', {
          error: playError,
          name: err?.name,
          url: audioUrl,
          code: (audio as any).error?.code,
          message: (audio as any).error?.message,
          readyState: audio.readyState,
          networkState: audio.networkState
        });
        audioElement._isPlayingAttempt = false;
        if (err?.name !== 'AbortError' && err?.name !== 'NotAllowedError') {
          if (audioContext && audioContext.state === 'suspended') {
            try {
              await audioContext.resume();
            } catch (ctxError) {
              console.error('AudioContext resume error:', ctxError);
            }
          }
          const waitForReady = (): Promise<void> => {
            return new Promise((resolve) => {
              if (audio.readyState >= 3) {
                resolve();
                return;
              }
              const timeout = setTimeout(resolve, 2000);
              const onReady = () => {
                clearTimeout(timeout);
                audio.removeEventListener('canplay', onReady);
                audio.removeEventListener('canplaythrough', onReady);
                audio.removeEventListener('loadeddata', onReady);
                resolve();
              };
              audio.addEventListener('canplay', onReady, { once: true });
              audio.addEventListener('canplaythrough', onReady, { once: true });
              audio.addEventListener('loadeddata', onReady, { once: true });
            });
          };
          audio.load();
          await new Promise((r) => setTimeout(r, 500));
          await waitForReady();
          try {
            await audio.play();
            setIsPlaying(true);
            setIsLoading(false);
            if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          } catch (retryError) {
            console.error('Retry play error:', retryError);
            setIsPlaying(false);
            setIsLoading(false);
          }
        } else {
          setIsPlaying(false);
          setIsLoading(false);
        }
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      }
    };

    finishPlay().catch(() => {
      setIsPlaying(false);
      setIsLoading(false);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    });
  }, [isPlaying, sound.id]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(detailUrl);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(detailUrl)}`);
      return;
    }
    const key = 'sb_favorites';
    try {
      if (isFavorite) {
        await apiClient.unfavoriteSound(token, sound.id);
        if (isLiked) {
          await apiClient.unlikeSound(token, sound.id).catch(() => {});
          setIsLiked(false);
          setLikesCount((c) => Math.max(0, c - 1));
        }
      } else {
        await apiClient.favoriteSound(token, sound.id);
        if (!isLiked) {
          await apiClient.likeSound(token, sound.id).catch(() => {});
          setIsLiked(true);
          setLikesCount((c) => c + 1);
        }
      }
      let favs: number[] = JSON.parse(localStorage.getItem(key) || "[]");
      if (isFavorite) {
        setIsFavorite(false);
        favs = favs.filter((id) => id !== sound.id);
        localStorage.setItem(key, JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { action: 'remove', soundId: sound.id } }));
      } else {
        setIsFavorite(true);
        favs.push(sound.id);
        localStorage.setItem(key, JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { action: 'add', soundId: sound.id } }));
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  useEffect(() => {
    const handlePauseAll = (e: Event) => {
      const customEvent = e as CustomEvent<{ exceptId: number | null }>;
      if (customEvent.detail?.exceptId !== sound.id && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsLoading(false);
      }
    };
    const handleAutoPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ soundId: number }>;
      if (customEvent.detail?.soundId === sound.id) {
        setIsPressed(true); // Visual feedback
        setTimeout(() => setIsPressed(false), 150);
        handlePlay();
      }
    };
    window.addEventListener('pause-all-sounds', handlePauseAll as EventListener);
    window.addEventListener('play-sound-auto', handleAutoPlay as EventListener);
    return () => {
      window.removeEventListener('pause-all-sounds', handlePauseAll as EventListener);
      window.removeEventListener('play-sound-auto', handleAutoPlay as EventListener);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [sound.id, handlePlay]);

  // Button colors - bright, friendly (no darks)
  const getInnerHexColor = () => {
    const colorPalette = [
      '#E74C3C', // Red
      '#27AE60', // Green
      '#3498DB', // Blue
      '#9B59B6', // Purple
      '#F1C40F', // Yellow
      '#1abc9c', // Teal (replaces black)
    ];

    const colorIndex = sound.id % colorPalette.length;
    return colorPalette[colorIndex];
  };

  const innerHex = getInnerHexColor();

  // Calculate dimensions - same as my-instants (90 for both mobile/desktop)
  const baseSize = customSize ?? 90;
  const size = Math.floor(baseSize * 0.92);
  const buttonSize = Math.floor(size * 1.15);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 107, g: 114, b: 128 };
  };

  const rgb = hexToRgb(innerHex);
  const buttonId = `button-${sound.id}`;
  const svgSize = buttonSize;

  // Helper to convert RGB object to hex string (sbmain)
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  // For detail page, use fixed dimensions
  const isDetailPage = customSize && customSize >= 200;

  return (
    <div ref={containerRef} className="flex flex-col items-center" style={{
      width: isDetailPage ? `${customSize}px` : '100%',
      height: isDetailPage ? `${customSize}px` : 'auto',
      minHeight: isDetailPage ? `${customSize}px` : 'auto',
      maxHeight: isDetailPage ? `${customSize}px` : 'none',
      minWidth: isDetailPage ? `${customSize}px` : 0,
      maxWidth: isDetailPage ? `${customSize}px` : '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box',
      overflow: 'visible',
      gap: '0',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Sound Button - 3D SVG Button */}
      <div className="relative w-full aspect-square mx-auto" style={{
        overflow: 'visible',
        flexShrink: 0,
        boxShadow: 'none',
        width: isDetailPage ? `${customSize}px` : '100%',
        height: isDetailPage ? `${customSize}px` : 'auto',
        minWidth: isDetailPage ? `${customSize}px` : 'auto',
        minHeight: isDetailPage ? `${customSize}px` : 'auto',
        maxWidth: isDetailPage ? `${customSize}px` : '100%',
        maxHeight: isDetailPage ? `${customSize}px` : 'none',
        aspectRatio: isDetailPage ? '1 / 1' : '1 / 1'
      }}>
        <div
          className={`sound-button-container w-full h-full ${isPressed ? 'pressed' : ''}`}
          role="button"
          aria-label={`Play ${getDisplaySoundName(sound.name ?? "")}`}
          onClick={(e) => {
            e.preventDefault();
            // Ignore click that follows a touch (mobile fires click ~300ms after touch)
            if (Date.now() - lastTouchAtRef.current < 400) return;
            handlePlay();
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => {
            setIsPressed(true);
            lastTouchAtRef.current = Date.now();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            // Mobile: play in same user gesture as touch (no async delay before play())
            handlePlay();
            setIsPressed(false);
          }}
          style={{
            cursor: 'pointer',
            position: 'relative',
            overflow: 'visible',
            margin: '0 auto',
            width: isDetailPage ? `${customSize}px` : '100%',
            height: isDetailPage ? `${customSize}px` : '100%',
            minWidth: isDetailPage ? `${customSize}px` : 'auto',
            minHeight: isDetailPage ? `${customSize}px` : 'auto',
            maxWidth: isDetailPage ? `${customSize}px` : '100%',
            maxHeight: isDetailPage ? `${customSize}px` : '100%',
            flexShrink: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 508.88 499.32"
            className="w-full h-auto"
            aria-label="Sound button"
            style={{
              display: 'block',
              overflow: 'visible',
              width: isDetailPage ? `${customSize}px` : '100%',
              height: isDetailPage ? `${customSize}px` : 'auto',
              minWidth: isDetailPage ? `${customSize}px` : 'auto',
              minHeight: isDetailPage ? `${customSize}px` : 'auto',
              maxWidth: isDetailPage ? `${customSize}px` : '100%',
              maxHeight: isDetailPage ? `${customSize}px` : 'none',
              flexShrink: 0
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <style>{`
                .cls-1-${buttonId} { fill: ${rgbToHex(Math.max(0, rgb.r - 30), Math.max(0, rgb.g - 30), Math.max(0, rgb.b - 30))}; }
                .cls-2-${buttonId} { fill: #b0aaab; }
                .cls-3-${buttonId} { fill: url(#linear-gradient-2-${buttonId}); }
                .cls-4-${buttonId} { fill: #1f1f1f; }
                .cls-5-${buttonId} { fill: ${rgbToHex(Math.max(0, rgb.r - 20), Math.max(0, rgb.g - 20), Math.max(0, rgb.b - 20))}; }
                .cls-6-${buttonId} { fill: ${innerHex}; }
                .cls-7-${buttonId} { fill: #404140; }
                .cls-8-${buttonId} { fill: url(#linear-gradient-${buttonId}); }
                .button-top-${buttonId} {
                  transition: transform 0.15s ease-out;
                  transform-origin: center;
                }
              `}</style>
              <linearGradient id={`linear-gradient-${buttonId}`} x1={isPressed ? "890.69" : "883.46"} y1={isPressed ? "-358.27" : "-341.94"} x2={isPressed ? "1031.73" : "1037.44"} y2={isPressed ? "-113.99" : "-75.24"} gradientTransform="translate(1217.61 -59.25) rotate(-180)" gradientUnits="userSpaceOnUse">
                <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
                <stop offset=".05" stopColor="#fff" stopOpacity=".79"/>
                <stop offset=".09" stopColor="#fff" stopOpacity=".46"/>
                <stop offset=".11" stopColor="#fff" stopOpacity=".33"/>
                <stop offset=".2" stopColor="#fff" stopOpacity=".12"/>
                <stop offset=".25" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id={`linear-gradient-2-${buttonId}`} x1="254.44" y1={isPressed ? "300.24" : "293.77"} x2="254.44" y2={isPressed ? "79.26" : "23.06"} gradientUnits="userSpaceOnUse">
                <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
                <stop offset=".15" stopColor="#fff" stopOpacity=".61"/>
                <stop offset=".26" stopColor="#fff" stopOpacity=".43"/>
                <stop offset=".36" stopColor="#fff" stopOpacity=".27"/>
                <stop offset=".46" stopColor="#fff" stopOpacity=".15"/>
                <stop offset=".55" stopColor="#fff" stopOpacity=".07"/>
                <stop offset=".65" stopColor="#fff" stopOpacity=".02"/>
                <stop offset=".73" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Base layer - sbmain */}
            <g className="button-base">
              <g>
                <path className={`cls-4-${buttonId}`} d="M482.41,213.7H26.47c-10.23,18.8-15.83,39.21-15.83,60.54v50.43c0,7.1.71,14.08,2.22,20.92,16.02,75.81,118.07,134.27,241.58,134.27s225.56-58.46,241.58-134.27c1.47-6.84,2.22-13.82,2.22-20.92v-50.43l-15.83-60.54Z"/>
                <path className={`cls-7-${buttonId}`} d="M498.24,274.24c0,94.1-109.15,170.4-243.8,170.4S10.63,368.34,10.63,274.24c0-21.33,5.6-41.73,15.83-60.54,34.94-64.22,123.82-109.86,227.97-109.86s193.03,45.64,227.97,109.86c10.23,18.8,15.83,39.21,15.83,60.54Z"/>
                <ellipse className={`cls-2-${buttonId}`} cx="255.32" cy="270.96" rx="235.23" ry="160.56"/>
              </g>
            </g>
            {/* Top button layer - sbmain, moves down when pressed */}
            <g className={`button-top button-top-${buttonId}`} transform={isPressed ? 'translate(0, 8)' : 'translate(0, 0)'}>
              {!isPressed ? (
                <>
                  <g>
                    <path className={`cls-1-${buttonId}`} d="M462.66,154.7v94c0,6-.63,11.94-1.9,17.73-13.68,64.23-100.85,113.74-206.32,113.74s-192.63-49.51-206.32-113.74c-1.27-5.79-1.9-11.72-1.9-17.73v-94h416.43Z"/>
                    <ellipse className={`cls-5-${buttonId}`} cx="254.44" cy="154.7" rx="208.22" ry="139.17"/>
                    <ellipse className={`cls-6-${buttonId}`} cx="254.53" cy="152.02" rx="197.7" ry="131.14"/>
                  </g>
                  <path className={`cls-8-${buttonId}`} d="M257.8,283.16c-51.32,0-102.69-12.82-141.89-38.46-38.78-25.35-60.16-59.32-60.2-95.66-.05-36.1,21.01-69.85,59.28-95.03,77.9-51.29,205.05-51.3,283.44-.02,38.77,25.35,60.15,59.32,60.2,95.65.05,36.1-21.02,69.86-59.31,95.05-38.94,25.64-90.2,38.47-141.52,38.47ZM256.54,23.66c-50.01,0-99.95,12.49-137.89,37.48-35.93,23.64-55.7,54.85-55.66,87.88.04,33.27,20.13,64.71,56.56,88.53h0c76.37,49.96,200.23,49.97,276.1,0,35.95-23.65,55.72-54.87,55.68-87.9-.04-33.27-20.13-64.7-56.56-88.52-38.18-24.98-88.24-37.47-138.24-37.47Z"/>
                  <ellipse className={`cls-3-${buttonId}`} cx="254.44" cy="150.44" rx="187.39" ry="116.99"/>
                </>
              ) : (
                <>
                  <g>
                    <path className={`cls-1-${buttonId}`} d="M458.43,173.78v69.35c0,5.06-.62,10.08-1.86,14.96-13.41,54.21-98.81,95.99-202.14,95.99s-188.72-41.78-202.13-95.99c-1.24-4.89-1.86-9.9-1.86-14.96v-69.35l3.47-10h401.06c.91,2.83,1.66,5.71,2.22,8.61.42.46.83.92,1.24,1.39Z"/>
                    <path className={`cls-5-${buttonId}`} d="M458.45,185.49c0,.51-.01,1.01-.02,1.52-.1,4.86-.72,9.65-1.82,14.35-13.46,57.37-98.84,101.6-202.16,101.6s-188.69-44.22-202.15-101.6c-1.22-5.19-1.85-10.49-1.85-15.87v-.15c.01-4.4.43-8.73,1.27-13,.55-2.89,1.29-5.74,2.2-8.57,17.7-54.5,100.75-95.74,200.52-95.74s182.84,41.25,200.53,95.74c.91,2.83,1.66,5.71,2.22,8.61.68,3.51,1.09,7.07,1.22,10.67.01.3.02.61.02.91.01.51.02,1.01.02,1.52Z"/>
                    <ellipse className={`cls-6-${buttonId}`} cx="254.53" cy="183.24" rx="193.69" ry="110.69"/>
                  </g>
                  <path className={`cls-8-${buttonId}`} d="M257.02,293.61c-49.82,0-99.69-11.18-137.74-33.55-37.64-22.11-58.4-51.74-58.44-83.44-.04-31.48,20.39-60.92,57.55-82.89,75.62-44.74,199.05-44.75,275.15-.02,37.64,22.11,58.4,51.74,58.44,83.44.05,31.49-20.4,60.94-57.57,82.91-37.8,22.37-87.57,33.55-137.38,33.55ZM255.8,67.26c-48.54,0-97.03,10.9-133.86,32.69-34.88,20.62-54.07,47.85-54.03,76.65.04,29.02,19.54,56.44,54.91,77.22h0c74.14,43.58,194.38,43.58,268.03,0,34.9-20.63,54.1-47.86,54.05-76.67-.04-29.02-19.54-56.44-54.9-77.21-37.07-21.79-85.66-32.68-134.2-32.68Z"/>
                  <ellipse className={`cls-3-${buttonId}`} cx="254.44" cy="183.24" rx="183.59" ry="95.5"/>
                </>
              )}
            </g>
          </svg>

          {/* Loading spinner ring around buttons */}
          {isLoading && (
            <div
              className="loading-ring"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${svgSize + 20}px`,
                height: `${svgSize + 20}px`,
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              <svg
                width={svgSize + 20}
                height={svgSize + 20}
                style={{ display: 'block' }}
              >
                <circle
                  cx={(svgSize + 20) / 2}
                  cy={(svgSize + 20) / 2}
                  r={(svgSize + 20) / 2 - 3}
                  fill="none"
                  stroke={innerHex}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.PI * (svgSize + 20)}`}
                  strokeDashoffset={`${Math.PI * (svgSize + 20) * 0.75}`}
                  opacity="0.6"
                  className="loading-spinner"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .sound-button-container {
          position: relative;
          width: ${svgSize}px;
          height: ${svgSize}px;
          overflow: visible !important;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          box-shadow: none !important;
        }

        .sound-button-container * {
          box-shadow: none !important;
        }

        .sound-button-container svg {
          display: block;
          box-shadow: none !important;
          transform: none !important;
          transition: none !important;
        }

        .sound-button-container svg * {
          box-shadow: none !important;
        }

        /* Base stays completely static - no transforms, no animations, no transitions */
        .button-base {
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }

        /* Ensure all base elements stay static */
        .button-base * {
          transform: none !important;
          transition: none !important;
        }

        /* Top button layer - can be transformed */
        .button-top {
          transform-origin: center;
          transition: transform 0.15s ease-out;
        }

        /* SVG container - no transitions needed as we handle it in the group */
        .sound-button-container svg {
          transition: none !important;
        }

        /* Loading spinner animation */
        .loading-ring {
          animation: fadeIn 0.2s ease-in;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          transform-origin: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <style dangerouslySetInnerHTML={{ __html: `
        .sound-title-2line {
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
      `}} />

      {/* Sound Name - max 2 lines */}
      {!hideLabel && (
        <Link
          href={detailUrl}
          prefetch={isAboveTheFold}
          className="text-center block w-full max-w-[90px] sm:max-w-[95px] md:max-w-[100px] lg:max-w-[104px]"
          style={{
            boxSizing: 'border-box',
            overflow: 'hidden',
            minHeight: '2.5rem',
            height: '2.5rem',
            marginTop: '0.25rem',
            marginBottom: '0',
            display: 'block',
            flexShrink: 0
          }}
          aria-label={`${getDisplaySoundName(sound.name ?? "")} - view details`}
        >
          <span
            className="sound-title-2line text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer leading-tight text-center px-0.5 block w-full"
            style={{ lineHeight: 1.25 }}
          >
            {getDisplaySoundName(sound.name ?? "")}
          </span>
        </Link>
      )}

      {/* Action Icons - same as my-instants */}
      {!hideActions && (
        <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-1" style={{ flexShrink: 0 }}>
          <button
            onClick={handleFavorite}
            className={cn(
              "p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md",
              isFavorite ? 'bg-gradient-to-br from-pink-400 to-red-500' : 'bg-gradient-to-br from-pink-300 to-rose-400'
            )}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{
              background: isFavorite
                ? 'linear-gradient(135deg, #f472b6 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, #f9a8d4 0%, #fb7185 100%)'
            }}
          >
            <HeartFilled className="w-4 h-4 text-white drop-shadow-sm" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            title="Share"
            style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'; }}
          >
            <Share2 className="w-4 h-4 text-white drop-shadow-sm" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            title="Download / Details"
            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'; }}
          >
            <Download className="w-4 h-4 text-white drop-shadow-sm" />
          </button>
        </div>
      )}

      <ShareModal
        soundName={sound.name || ''}
        soundId={sound.id}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={typeof window !== 'undefined' ? `${window.location.origin}${detailPathProp ?? getSoundDetailPath(sound.name ?? '', sound.id)}` : undefined}
      />
    </div>
  );
};

// Global cleanup
if (typeof window !== 'undefined') {
  (window as any).cleanupAudioCache = cleanupAudioCache;
  if (!(window as any).__audioCacheCleanupInterval) {
    (window as any).__audioCacheCleanupInterval = setInterval(cleanupAudioCache, 5 * 60 * 1000);
  }
}

export default memo(CompactSoundButton);
