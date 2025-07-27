import { useCallback, useMemo } from 'react';

// Create a mock router instance that can be used in tests
const createMockRouter = (overrides = {}) => {
  const router = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    isFallback: false,
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    domainLocales: [],
    // Navigation methods
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    // Events
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    // Additional methods
    isReady: true,
    isFallback: false,
    isPreview: false,
    // Apply any overrides
    ...overrides,
  };

  return router;
};

// Mock useRouter hook
const useRouter = (overrides = {}) => {
  const router = useMemo(() => createMockRouter(overrides), [overrides]);
  return router;
};

// Mock withRouter HOC
const withRouter = (WrappedComponent) => {
  const WithRouterWrapper = (props) => {
    const router = useRouter();
    return <WrappedComponent {...props} router={router} />;
  };
  
  WithRouterWrapper.displayName = `withRouter(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithRouterWrapper;
};

// Mock Router object with events
const Router = {
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  // Additional Router methods
  push: jest.fn().mockResolvedValue(true),
  replace: jest.fn().mockResolvedValue(true),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
};

// Export all mocks
module.exports = {
  useRouter,
  withRouter,
  Router,
  createRouter: createMockRouter,
};
