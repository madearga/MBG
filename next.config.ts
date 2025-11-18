import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    browserDebugInfoInTerminal: true,
  },
  reactCompiler: true,
  typedRoutes: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      path: false,
      crypto: false,
    };
    
    // Mark Convex modules as server-only to prevent bundling
    config.resolve.alias = {
      ...config.resolve.alias,
      '@convex': false,
      '@convex/_generated': false,
    };
    
    return config;
  },
};

export default nextConfig;
