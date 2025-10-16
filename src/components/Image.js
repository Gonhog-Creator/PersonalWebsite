import NextImage from 'next/image';

export default function Image({ src, alt, width, height, ...props }) {
  const isGHPages = process.env.NEXT_PUBLIC_GH_PAGES === 'true';
  const basePath = isGHPages ? '/PersonalWebsite' : '';
  
  // Handle different image paths
  let imageSrc = src;
  
  // If the image is in the public folder
  if (src.startsWith('/')) {
    imageSrc = `${basePath}${src}`;
  }

  return (
    <NextImage
      src={imageSrc}
      alt={alt || ''}
      width={width}
      height={height}
      unoptimized={true}
      {...props}
    />
  );
}
