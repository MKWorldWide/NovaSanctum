let withSentryConfig = (config) => config;
try {
  if (process.env.SENTRY_AUTH_TOKEN) {
    // Lazy-require Sentry only when token is present
    ({ withSentryConfig } = require('@sentry/nextjs'));
  }
} catch (e) {
  // Sentry not installed; proceed without it
  withSentryConfig = (config) => config;
}

// Enable CSS optimization only if Critters is available
const hasCritters = (() => {
  try {
    require.resolve('critters');
    return true;
  } catch {
    return false;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', '*.amplifyapp.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV !== 'production', // Only optimize in production
  },
  
  // Enable React's concurrent features
  experimental: {
    optimizeCss: hasCritters,
    optimizePackageImports: ['@headlessui/react', 'framer-motion'],
    optimizeServerReact: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Configure the development server
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Add custom webpack configurations here if needed
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

// Only enable Sentry in production
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
};

// Make sure adding Sentry options is the last code to run before exporting
const config = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

// Export the configuration
module.exports = config;
