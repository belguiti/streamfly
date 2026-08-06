import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect non-www to www for canonical consistency
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'streamtly.com' }],
        destination: 'https://www.streamtly.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

