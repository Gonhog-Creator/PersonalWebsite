import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Tree',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
