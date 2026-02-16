import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,

  images: {
    // Disable optimization in dev to avoid timeouts
    unoptimized: process.env.NODE_ENV === 'development',
    // Modern, secure way (recommended)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "stripe.com",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],

    // Performance optimizations
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash', 'framer-motion', '@radix-ui/react-icons'],
  },

  // Security headers (nice touch for production apps)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://res.cloudinary.com https://*.stripe.com https://cdn.simpleicons.org; font-src 'self' data:; connect-src 'self' https://api.stripe.com;",
          }
        ],
      },
    ];
  },

  // Ignore TS errors during build (optional, only if needed)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
