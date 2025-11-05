import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEBUG: process.env.DEBUG || '',
  },
};

export default nextConfig;
