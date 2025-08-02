const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost', '*.amplifyapp.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV !== 'production', // Only optimize in production
  },
  
  // Enable React's concurrent features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@headlessui/react', 'framer-motion'],
    serverActions: true,
    optimizeServerReact: true,
    scrollRestoration: true,
    workerThreads: true,
    // Enable Webpack 5 persistent caching
    webpackBuildWorker: true,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Only run these optimizations in production
    if (!dev) {
      // Enable tree shaking and module concatenation
      config.optimization.concatenateModules = true;
      config.optimization.usedExports = true;
      
      // Enable chunk splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the package name
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              // Return a consistent name for better caching
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    
    // Important: return the modified config
    return config;
  },
};

// Only enable Sentry in production
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
};

// Wrap your config with Sentry
module.exports = process.env.SENTRY_AUTH_TOKEN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;