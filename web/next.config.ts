import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "media-src 'self' https://*.cloudfront.net blob: data:;",
          },
        ],
      },
    ]
  },
};

export default nextConfig;