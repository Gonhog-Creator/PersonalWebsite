import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finland Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}