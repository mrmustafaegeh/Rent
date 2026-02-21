import type { Metadata } from "next";
import { Space_Grotesk, Inter, Cairo, Bebas_Neue, DM_Sans } from "next/font/google"; // already has fonts from separate block replacement
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

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
  try {
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
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: 'RentalX',
      description: 'Premium Car Rental'
    };
  }
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

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load messages:", error);
    // Fallback to empty messages to prevent total crash
    messages = {};
  }
  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${cairo.variable} ${bebas.variable} ${dmSans.variable} antialiased ${isArabic ? 'font-arabic' : 'font-body'} bg-background text-foreground`}
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
              "@type": "CarRental",
              "name": messages.Metadata?.brand || "RentalX",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://rentalx.com",
              "logo": `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              "image": "https://images.unsplash.com/photo-1503376763036-066120622c74",
              "description": messages.Metadata?.description,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kyrenia Harbour",
                "addressLocality": "Kyrenia",
                "addressRegion": "TRNC",
                "addressCountry": "CY"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 35.3364,
                "longitude": 33.3169
              },
              "telephone": "+90 533 000 00 00",
              "email": "hello@mediterraneandrive.com",
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              ],
              "sameAs": [
                "https://facebook.com/rentalx",
                "https://instagram.com/rentalx"
              ]
            })
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </body>
    </html>
  );
}
