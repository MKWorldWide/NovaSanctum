const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^\\.(jpg|jpeg|png|gif|webp|avif|svg|woff|woff2|eot|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
    '^next$': '<rootDir>/node_modules/next',
    '^next/link': '<rootDir>/__mocks__/next/link.jsx',
    '^next/image': '<rootDir>/__mocks__/next/image.jsx',
    '^next/router': '<rootDir>/__mocks__/next/router.js',
    '^next/head': '<rootDir>/__mocks__/next/head.jsx',
    '^next/dynamic': '<rootDir>/__mocks__/next/dynamic.jsx',
    '^next/script': '<rootDir>/__mocks__/next/script.jsx',
    '^next/document': '<rootDir>/__mocks__/next/document.jsx',
    '^chai$': require.resolve('chai'),
    '^sinon$': require.resolve('sinon'),
    '^framer-motion': require.resolve('framer-motion'),
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true, decorators: true },
          target: 'es2021',
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(framer-motion)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/cypress/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
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
  coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } },
  setupFiles: ['<rootDir>/jest.polyfills.js', 'jest-localstorage-mock'],
  testEnvironmentOptions: { url: 'http://localhost:3000' },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

module.exports = createJestConfig(customJestConfig);
