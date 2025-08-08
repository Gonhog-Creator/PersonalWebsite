import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jose Barbeito | Engineer & Photographer',
  description: 'Personal website of Jose Barbeito - Engineer, Photographer, and Maker',
  keywords: ['Jose Barbeito', 'Engineer', 'Photographer', 'Portfolio', 'Personal Website'],
  authors: [{ name: 'Jose Barbeito' }],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://josebarbeito.com',
    title: 'Jose Barbeito | Engineer & Photographer',
    description: 'Personal website of Jose Barbeito - Engineer, Photographer, and Maker',
    siteName: 'Jose Barbeito',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jose Barbeito | Engineer & Photographer',
    description: 'Personal website of Jose Barbeito - Engineer, Photographer, and Maker',
    creator: '@josebarbeito',
  },
};
