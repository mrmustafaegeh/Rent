import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rentalx.com'),
  title: {
    default: 'RENTALX | Premium Luxury Car Rental',
    template: '%s | RENTALX'
  },
  description: 'Experience the thrill of the drive with our premium fleet of luxury, sports, and SUV vehicles. Rent Porsche, Mercedes, Range Rover and more.',
  keywords: ['luxury car rental', 'premium car rental', 'sports car rental', 'SUV rental', 'exotic car rental', 'RENTALX'],
  authors: [{ name: 'RENTALX' }],
  creator: 'RENTALX',
  publisher: 'RENTALX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rentalx.com',
    title: 'RENTALX | Premium Luxury Car Rental',
    description: 'Experience the thrill of the drive with our premium fleet.',
    siteName: 'RENTALX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RENTALX | Premium Luxury Car Rental',
    description: 'Experience the thrill of the drive with our premium fleet.',
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
  verification: {
    google: 'google-site-verification-code',
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
