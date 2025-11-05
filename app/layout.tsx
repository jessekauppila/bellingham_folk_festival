import type { Metadata } from 'next';
import { Gentium_Plus, Josefin_Sans } from 'next/font/google';
import './globals.css';

const gentiumPlus = Gentium_Plus({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-gentium-plus',
  display: 'swap',
});

const josefinSans = Josefin_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-josefin-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bellingham Folk Festival',
  description:
    'The Bellingham Folk Festival is a homemade weekend of music and people that takes place in the heart of beautiful Bellingham, WA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gentiumPlus.variable} ${josefinSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
