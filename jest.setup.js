// Mock for Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} data-testid="next-image" />,
}));

// Mock for Next.js Link component
jest.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, href, ...props }) => (
      <a href={href} {...props} data-testid="next-link">
        {children}
      </a>
    ),
  };
});

// Mock for Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
    isPreview: false,
  }),
}));

// Mock for CSS modules
const mockCssModules = new Proxy(
  {},
  {
    get: function (target, prop) {
      return prop;
    },
  }
);

// Mock for CSS/SCSS/SASS modules
const mockStyleModule = {
  __esModule: true,
  default: mockCssModules,
  ...mockCssModules,
};

// Mock for file imports
jest.mock('^.*\\.(css|scss|sass|less)$', () => mockStyleModule, {
  virtual: true,
});

// Mock for image and font files
jest.mock('^.*\\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|eot)$', () => ({
  __esModule: true,
  default: 'test-file-stub',
}));

// Mock for Next.js head
jest.mock('next/head', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }) => {
      return React.createElement('head', null, children);
    },
  };
});

// Mock for Next.js document
jest.mock('next/document', () => ({
  __esModule: true,
  Html: 'html',
  Head: 'head',
  Main: 'main',
  NextScript: 'next-script',
  Document: 'document',
}));

// Mock for Next.js dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (loader, options) => {
    const Component = () => {
      const [Component, setComponent] = React.useState(null);
      
      React.useEffect(() => {
        const loadComponent = async () => {
          const loaded = await loader();
          setComponent(() => loaded.default || loaded);
        };
        
        loadComponent();
      }, []);
      
      return Component ? <Component /> : (options?.loading || null);
    };
    
    Component.displayName = 'LoadableComponent';
    return Component;
  },
}));
