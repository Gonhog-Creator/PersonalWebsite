import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Germany Gallery',
  description: 'From the vibrant beer halls of Munich to the relaxing spas of Baden-Baden.',
  path: '/galleries/germany',
  image: '/img/Germany/germany_panorama (12).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
