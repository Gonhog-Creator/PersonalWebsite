import './globals.css';

export const metadata = {
  title: 'Jose Maria Barbeito',
  description: 'Personal website of Jose Maria Barbeito',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
