import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sweden Gallery',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}