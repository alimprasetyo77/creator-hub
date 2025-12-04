import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  logging: { fetches: { fullUrl: true, hmrRefreshes: true }, incomingRequests: true },
  redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: 'simulator.sandbox.midtrans.com' },
      { hostname: 'api.sandbox.midtrans.com' },
    ],
  },
};

export default nextConfig;
