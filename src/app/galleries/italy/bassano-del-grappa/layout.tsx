import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bassano Del Grappa Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
