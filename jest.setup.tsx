// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import type { NextRouter } from 'next/router';
import React from 'react';

// Mock global objects
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = mockLocalStorage;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock framer-motion is now handled by src/__mocks__/framer-motion.tsx
// This provides a more maintainable and type-safe mock implementation

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
  withRouter: (component) => component,
  Router: {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
}));

// Mock next/image
jest.mock('next/image', () => {
  const Image = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
  
  // Set display name for better test output
  Image.displayName = 'NextImage';
  
  return {
    __esModule: true,
    default: Image,
  };
});

// Mock next/head
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => {
    return <>{children}</>;
  },
}));

// Mock AWS Amplify
jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn()
  },
  Auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
    currentUserInfo: jest.fn()
  },
  API: {
    graphql: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    del: jest.fn()
  }
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NEXT_PUBLIC_AWS_REGION = 'us-east-1';
process.env.NEXT_PUBLIC_USER_POOL_ID = 'test-pool-id';
process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID = 'test-client-id';

// Mock requestAnimationFrame
const requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

const cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock console.error and console.warn to track test output
const originalError = console.error;
const originalWarn = console.warn;

// Suppress specific warnings in tests
console.error = (...args) => {
  // Suppress specific warnings from libraries
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: An update to %s inside a test was not wrapped in act') ||
      args[0].includes('Warning: validateDOMNesting') ||
      args[0].includes('Warning: Each child in a list should have a unique "key" prop') ||
      args[0].includes('Warning: Failed prop type'))
  ) {
    return;
  }
  originalError(...args);
};

console.warn = (...args) => {
  // Suppress specific warnings from libraries
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('componentWillReceiveProps') ||
      args[0].includes('componentWillMount') ||
      args[0].includes('componentWillUpdate') ||
      args[0].includes('Deprecation warning: value provided is not in a recognized RFC2822 or ISO format'))
  ) {
    return;
  }
  originalWarn(...args);
};

// Add global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

global.IntersectionObserver = MockIntersectionObserver;

// Restore original console methods after all tests
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
