import { SEOPage } from "@/components/features/SEOPage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO.selfDrive' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/self-drive-car-rental-cyprus`,
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    }
  };
}

export default function SelfDriveSEO() {
  return <SEOPage namespace="selfDrive" />;
}
