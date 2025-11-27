import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  logging: { fetches: { fullUrl: true, hmrRefreshes: true }, incomingRequests: true },
  images: {
    remotePatterns: [
      { hostname: 'simulator.sandbox.midtrans.com' },
      { hostname: 'api.sandbox.midtrans.com' },
    ],
  },
};

export default nextConfig;
