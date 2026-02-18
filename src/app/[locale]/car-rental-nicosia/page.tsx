import { SEOPage } from "@/components/features/SEOPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO.nicosia' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/car-rental-nicosia`,
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    }
  };
}

export default function NicosiaSEO() {
  return <SEOPage namespace="nicosia" />;
}
