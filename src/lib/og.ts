import type { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

// Builds per-page metadata with Open Graph/Twitter tags so shared links
// render a page-specific preview card instead of the site-wide default.
export function pageMetadata({
  title,
  description,
  path,
  image = '/img/og-image.jpg',
}: PageMetadataOptions): Metadata {
  const ogImage = image.replace(/ /g, '%20');
  const fullTitle = `${title} | Jose Barbeito`;
  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `https://josebarbeito.com${path}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
