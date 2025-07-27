// Jest polyfills for browser-like environment

// Mock for global objects that might be needed in tests
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Mock for requestAnimationFrame
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 0);
  };
}

// Mock for cancelAnimationFrame
if (typeof globalThis.cancelAnimationFrame === 'undefined') {
  globalThis.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

// Mock for matchMedia
if (typeof globalThis.matchMedia === 'undefined') {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: jest.fn((query) => ({
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
}

// Mock for IntersectionObserver
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserver {
    constructor() {
      this.observe = jest.fn();
      this.unobserve = jest.fn();
      this.disconnect = jest.fn();
    }
  }
  
  globalThis.IntersectionObserver = IntersectionObserver;
  globalThis.IntersectionObserverEntry = class {};
}

// Mock for ResizeObserver
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserver {
    constructor() {
      this.observe = jest.fn();
      this.unobserve = jest.fn();
      this.disconnect = jest.fn();
    }
  }
  
  globalThis.ResizeObserver = ResizeObserver;
}

// Mock for scrollTo
if (typeof globalThis.scrollTo === 'undefined') {
  globalThis.scrollTo = jest.fn();
}

// Add any other browser APIs that your tests might need
