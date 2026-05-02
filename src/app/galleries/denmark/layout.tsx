import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Denmark Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}