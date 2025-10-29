import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'United Kingdom Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
