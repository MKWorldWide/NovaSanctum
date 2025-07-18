// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Framer Motion to prevent React warnings
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Filter out motion-specific props to prevent React warnings
      const { whileHover, whileTap, animate, initial, exit, ...restProps } = props;
      return <div {...restProps}>{children}</div>;
    },
    button: ({ children, ...props }) => {
      const { whileHover, whileTap, animate, initial, exit, ...restProps } = props;
      return <button {...restProps}>{children}</button>;
    },
    span: ({ children, ...props }) => {
      const { whileHover, whileTap, animate, initial, exit, ...restProps } = props;
      return <span {...restProps}>{children}</span>;
    }
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn()
  }),
  useMotionValue: (initial) => ({
    get: () => initial,
    set: jest.fn(),
    on: jest.fn()
  }),
  useTransform: () => ({
    get: jest.fn()
  })
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
      },
      isFallback: false
    };
  }
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  }
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
    get: jest.fn()
  }
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
process.env.NEXT_PUBLIC_AWS_REGION = 'us-east-1';
process.env.NEXT_PUBLIC_AWS_USER_POOL_ID = 'test-pool-id';
process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID = 'test-client-id';

// Suppress console warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: React does not recognize the')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: React does not recognize the') ||
       args[0].includes('punycode'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
