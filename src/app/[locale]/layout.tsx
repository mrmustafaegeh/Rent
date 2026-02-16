import type { Metadata } from "next";
import { Space_Grotesk, Inter, Cairo } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
});

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rentalx.com'),
    title: {
      default: t('title'),
      template: `%s | ${t('brand')}`
    },
    description: t('description'),
    keywords: t('keywords').split(','),
    authors: [{ name: t('brand') }],
    creator: t('brand'),
    publisher: t('brand'),
    openGraph: {
      type: 'website',
      siteName: t('brand'),
      title: t('title'),
      description: t('description'),
      locale: locale
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ar': '/ar',
        'ru': '/ru',
        'tr': '/tr',
        'el': '/el',
      },
    },
    robots: {
      index: true, 
      follow: true,
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming locale parameter is valid
  if (!['en', 'ar', 'ru', 'tr', 'el'].includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${cairo.variable} antialiased ${isArabic ? 'font-arabic' : 'font-body'} bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthProvider>
            <AuthProvider>
              <CurrencyProvider>
                <Toaster position="bottom-right" />
                {children}
              </CurrencyProvider>
            </AuthProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRental",
              "name": messages.Metadata?.brand || "RENTALX",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://rentalx.com",
              "description": messages.Metadata?.description,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kyrenia",
                "addressLocality": "Kyrenia",
                "addressCountry": "CY"
              },
              "telephone": "+905330000000",
              "email": "hello@mediterraneandrive.com",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                  ],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
