import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Flight Tracker',
  description: 'An interactive 3D globe tracing my flights over the years.',
  path: '/side-quests/flight-tracker',
});

export default function FlightTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
