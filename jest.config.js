const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files after the environment is loaded
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test environment
  testEnvironment: 'jest-environment-jsdom',
  
  // Module name mapper for path aliases and static assets
  moduleNameMapper: {
    // Handle module aliases from tsconfig
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    
    // Handle CSS modules - using identity-obj-proxy
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle static assets - using file mock
    '^\\.(jpg|jpeg|png|gif|webp|avif|svg|woff|woff2|eot|ttf|otf)$': 
      '<rootDir>/__mocks__/fileMock.js',
    
    // Next.js specific mocks - point to existing mocks or use simple mocks
    '^next$': '<rootDir>/node_modules/next',
    '^next/link': '<rootDir>/__mocks__/next/link.jsx',
    '^next/image': '<rootDir>/__mocks__/next/image.jsx',
    '^next/router': '<rootDir>/__mocks__/next/router.js',
    '^next/head': '<rootDir>/__mocks__/next/head.jsx',
    '^next/dynamic': '<rootDir>/__mocks__/next/dynamic.jsx',
    '^next/script': '<rootDir>/__mocks__/next/script.jsx',
    '^next/document': '<rootDir>/__mocks__/next/document.jsx',
    
    // Test utilities
    '^chai$': require.resolve('chai'),
    '^sinon$': require.resolve('sinon'),
    '^framer-motion': require.resolve('framer-motion'),
  },
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        'next/babel',
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          useBuiltIns: 'usage',
          corejs: 3,
          modules: 'commonjs',
        }],
        '@babel/preset-typescript',
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
        ['@babel/plugin-transform-runtime', {
          regenerator: true,
          corejs: 3,
        }],
      ],
    }],
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(chai|sinon|framer-motion|@babel/runtime|@babel/runtime-corejs3|@babel/plugin-transform-runtime|@babel/preset-env|@babel/plugin-proposal-.*|@babel/plugin-transform-.*|@babel/preset-react|@babel/preset-typescript|@babel/plugin-transform-modules-commonjs)/)',
  ],
  
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/'
  ],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Collect coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/_app.{js,jsx,ts,tsx}',
    '!src/**/_document.{js,jsx,ts,tsx}',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Setup files
  setupFiles: [
    '<rootDir>/jest.polyfills.js',
    'jest-localstorage-mock'
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // TypeScript configuration
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      isolatedModules: true,
      useESM: true,
    },
  },
  
  // ESM support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
