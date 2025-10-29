import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'France Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
