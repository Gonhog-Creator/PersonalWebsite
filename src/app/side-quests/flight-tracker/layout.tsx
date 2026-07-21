import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flight Tracker',
  description: 'An interactive 3D globe tracing my flights over the years.',
};

export default function FlightTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
