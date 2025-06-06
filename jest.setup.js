// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="mocked" {...props} />;
  },
}));

// Mock AWS Amplify
jest.mock('aws-amplify', () => ({
  Auth: {
    configure: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    currentAuthenticatedUser: jest.fn(),
  },
  API: {
    configure: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
  },
}));
