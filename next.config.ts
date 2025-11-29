import type { NextConfig } from 'next';

// Détection de l'environnement
const isDevelopment = process.env.NODE_ENV === 'development';

// Get CMS URL from environment variable
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_HOSTNAME = new URL(STRAPI_URL).hostname;
const STRAPI_PROTOCOL = new URL(STRAPI_URL).protocol.replace(':', '') as 'http' | 'https';

// Security headers configuration
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: Allow self, Next.js inline scripts, and CDNs for MathJax, etc.
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com",
      // Styles: Allow self, inline styles, and common CSS CDNs
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
      // Images: Allow self, data URIs, blobs, and specific remote patterns
      `img-src 'self' data: blob: ${STRAPI_URL || ''} http://localhost:* https://localhost:* https://*.media.strapiapp.com https://*.fra1.digitaloceanspaces.com https://*.nyc3.digitaloceanspaces.com https://images.unsplash.com https://via.placeholder.com https://avatars.githubusercontent.com https://github.com https://upload.wikimedia.org https://*.wikipedia.org`
        .replace(/\s+/g, ' ')
        .trim(),
      // Fonts: Allow self, data URIs, and Google Fonts
      "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      // Connect: Allow API calls and common services (Strapi optional)
      `connect-src 'self' http://localhost:* https://localhost:* ${STRAPI_URL ? STRAPI_URL : ''} https://images.unsplash.com https://api.github.com`
        .replace(/\s+/g, ' ')
        .trim(),
      // Media: Allow media from HTTPS sources (for audio/video in articles)
      "media-src 'self' https: data: blob:",
      // Frames: Allow YouTube, Vimeo, CodePen, CodeSandbox, etc. for embedded content in articles
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://codepen.io https://codesandbox.io https://stackblitz.com",
      // Object/Embed: Block for security
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // Frame ancestors: Prevent clickjacking
      "frame-ancestors 'none'",
      // Upgrade HTTP to HTTPS (désactivé en développement pour permettre l'accès via IP locale)
      ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
    ]
      .filter(Boolean) // Retire les entrées vides
      .join('; '),
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // Strict-Transport-Security désactivé en développement
  ...(isDevelopment
    ? []
    : [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ]),
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  // Réactivé avec React 19.2.0 qui corrige les bugs du mode strict
  reactStrictMode: true,

  // Optimisations pour le preloading
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'react-markdown'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Strapi pattern (only if enabled)
      ...(STRAPI_URL
        ? [
          {
            protocol: STRAPI_PROTOCOL,
            hostname: STRAPI_HOSTNAME,
          },
        ]
        : []),
      // Strapi Media CDN (images are served from a different subdomain)
      {
        protocol: 'https',
        hostname: '*.media.strapiapp.com',
      },
      // Digital Ocean Spaces (Strapi storage)
      {
        protocol: 'https',
        hostname: '*.fra1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '*.nyc3.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikipedia.org',
      },
    ],
    formats: ['image/webp'],
  },
};

export default nextConfig;
