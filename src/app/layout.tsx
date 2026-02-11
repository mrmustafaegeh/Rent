import type { Metadata } from "next";
import { Space_Grotesk, Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
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

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} antialiased font-body bg-background text-foreground`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <Toaster position="bottom-right" />
            {children}
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
