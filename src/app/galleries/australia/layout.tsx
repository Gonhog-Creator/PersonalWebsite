import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Australia Gallery',
  description: 'Dusty bus rides through the Australian outback and sail-driven adventures on the eastern coast.',
  path: '/galleries/australia',
  image: '/img/Australia/panorama-australia (14).jpg',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
