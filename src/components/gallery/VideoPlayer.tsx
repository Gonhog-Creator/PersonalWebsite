'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export function VideoPlayer({
  src,
  poster = '/img/placeholder.jpg',
  title = 'Video Player',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
  preload = 'none',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      if (autoPlay) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay was prevented, mute and try again
            video.muted = true;
            video.play().catch(console.error);
          });
        }
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [autoPlay]);

  return (
    <div className={`w-full aspect-video ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg"
        controls={controls}
        preload={preload}
        poster={poster}
        playsInline
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
