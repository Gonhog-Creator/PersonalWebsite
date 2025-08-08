import type { Metadata, Viewport } from 'next';
import { Inter, Alfa_Slab_One, Open_Sans, Fira_Code } from 'next/font/google';
import ClientLayout from './client-layout';
import AosInitializer from '@/components/AosInitializer';
import '@/app/globals.css';

// Load fonts with optimized settings
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  preload: true,
});

const alfaSlabOne = Alfa_Slab_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alfa-slab-one',
  display: 'swap',
  adjustFontFallback: false,
});

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  adjustFontFallback: false,
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
  adjustFontFallback: false,
});

// Viewport settings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
};

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: 'Jose Barbeito | Engineer & Photographer',
    template: '%s | Jose Barbeito',
  },
  description: 'Chemical Engineering and Material Science student at NC State University with a passion for photography and technology.',
  keywords: [
    'Jose Barbeito', 
    'Chemical Engineering', 
    'Material Science', 
    'NC State University', 
    'Photography',
    'Portfolio',
    'Engineer',
    'Resume'
  ],
  authors: [{ 
    name: 'Jose Barbeito',
    url: 'https://josebarbeito.com',
  }],
  creator: 'Jose Barbeito',
  publisher: 'Jose Barbeito',
  metadataBase: new URL('https://josebarbeito.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://josebarbeito.com',
    title: 'Jose Barbeito | Engineer & Photographer',
    siteName: 'Jose Barbeito',
    description: 'Chemical Engineering and Material Science student at NC State University with a passion for photography and technology.',
    images: [
      {
        url: '/img/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jose Barbeito - Engineer & Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jose Barbeito | Engineer & Photographer',
    description: 'Chemical Engineering and Material Science student at NC State University with a passion for photography and technology.',
    creator: '@josebarbeito',
    images: ['/img/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Jose Barbeito',
  },
  formatDetection: {
    telephone: false,
    email: true,
    address: false,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${alfaSlabOne.variable} ${openSans.variable} ${firaCode.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* AOS CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ClientLayout>
          {children}
          <AosInitializer />
        </ClientLayout>
        
        <script
          src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"
          async
          defer
        />
      </body>
    </html>
  );
}
