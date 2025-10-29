import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trieste Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
