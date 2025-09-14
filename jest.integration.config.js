const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', 
});

const customJestConfig = {
  testEnvironment: 'jsdom', // Use jsdom environment for browser-like testing
  testMatch: ['**/tests/integration/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^chai$': require.resolve('chai'),
    '^sinon$': require.resolve('sinon'),
    '^framer-motion': require.resolve('framer-motion'),
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
        },
        target: 'es2021',
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
};

module.exports = createJestConfig(customJestConfig);
