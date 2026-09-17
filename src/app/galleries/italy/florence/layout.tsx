import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Florence Gallery',
  description: 'Photography from Florence, Italy.',
  path: '/galleries/italy/florence',
  image: '/img/Italy/Florence/florence-panorama (7).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
