import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pay.payphonetodoesposible.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://pay.payphonetodoesposible.com https://images.unsplash.com https://www.fyf.com.ec https://fyf.com.ec; connect-src 'self' https://pay.payphonetodoesposible.com https://api.payphone.com.ec; frame-src 'self' https://pay.payphonetodoesposible.com https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://pay.payphonetodoesposible.com; frame-ancestors 'none';"
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "pay.payphonetodoesposible.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.fyf.com.ec",
      },
      {
        protocol: "https",
        hostname: "fyf.com.ec",
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/tienda",
        destination: "/catalogo",
      },
      {
        source: "/tienda/:path*",
        destination: "/catalogo/:path*",
      },
    ];
  },
};

export default nextConfig;
