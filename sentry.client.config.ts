import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking (useful for tracking which version has issues)
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Ignore common, non-critical errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    // Network errors
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event (not sent in dev):', event);
      return null;
    }

    // Filter out low-priority errors
    if (event.exception) {
      const error = hint.originalException;
      
      // Don't send 404s or similar
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status === 404 || status === 403) {
          return null;
        }
      }
    }

    return event;
  },
});
