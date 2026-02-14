import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically varies based on existing routing strategy 
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !['en', 'ar', 'ru', 'tr', 'el'].includes(locale)) {
    locale = 'en';
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
