import createMiddleware from 'next-intl/middleware';
 
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar', 'ru', 'tr', 'el'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

export function proxy(request: any) {
  return intlMiddleware(request);
}
 
export const config = {
  // Match only internationalized pathnames
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
