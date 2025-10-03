'use client';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  start?: number;
}

export function YouTubePlayer({
  videoId,
  title = 'YouTube Video Player',
  className = '',
  autoPlay = true,
  loop = false,
  muted = false,
  controls = true,
  start = 0,
}: YouTubePlayerProps) {
  // Build the YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?` + new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    loop: loop ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    start: start.toString(),
    rel: '0', // Don't show related videos at the end
    modestbranding: '1', // Remove YouTube logo from controls
    playsinline: '1', // Play inline on mobile
    ...(loop && { playlist: videoId }), // Required for loop to work
  });

  return (
    <div className={`relative w-full aspect-video overflow-hidden rounded-lg shadow-lg ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
