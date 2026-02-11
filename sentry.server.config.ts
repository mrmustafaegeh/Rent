import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry event (server, not sent in dev):', event);
      return null;
    }

    return event;
  },
});
