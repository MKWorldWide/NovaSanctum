import React from 'react';

const mockComponent = (type: string) => {
  const Component = ({ children, ...props }: any) => {
    // Filter out motion-specific props to avoid React warnings
    const {
      initial,
      animate,
      exit,
      variants,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      layout,
      transition,
      onViewportEnter,
      onViewportLeave,
      ...rest
    } = props;
    return React.createElement(type, rest, children);
  };
  Component.displayName = `motion.${type}`;
  return Component;
};

const motion = {
  div: mockComponent('div'),
  button: mockComponent('button'),
  span: mockComponent('span'),
  section: mockComponent('section'),
  article: mockComponent('article'),
  nav: mockComponent('nav'),
  ul: mockComponent('ul'),
  li: mockComponent('li'),
  a: mockComponent('a'),
  h1: mockComponent('h1'),
  h2: mockComponent('h2'),
  h3: mockComponent('h3'),
  p: mockComponent('p'),
  img: mockComponent('img'),
  svg: mockComponent('svg'),
  path: mockComponent('path'),
  // Add more HTML elements as needed
};

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const LayoutGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const AnimateSharedLayout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const motionValue = jest.fn((initial: any) => ({
  get: () => initial,
  set: jest.fn(),
  onChange: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  stop: jest.fn(),
}));

const useAnimation = jest.fn(() => ({
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn(),
  set: jest.fn(),
  controls: { start: jest.fn(), stop: jest.fn() },
}));

const useMotionValue = jest.fn((initial: any) => ({
  get: () => initial,
  set: jest.fn(),
  onChange: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  stop: jest.fn(),
}));

const useTransform = jest.fn((value: any, inputRange: any, outputRange: any) => ({
  get: () => outputRange[0],
  onChange: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

const useSpring = jest.fn((value: any, config: any) => ({
  ...value,
  on: jest.fn(),
  off: jest.fn(),
}));

const useReducedMotion = jest.fn(() => false);
const useInView = jest.fn(() => [jest.fn(), false, null]);

const useAnimate = jest.fn(() => [
  jest.fn(),
  {
    current: null,
  },
]);

const useScroll = jest.fn(() => ({
  scrollX: { get: () => 0, on: jest.fn(), off: jest.fn() },
  scrollY: { get: () => 0, on: jest.fn(), off: jest.fn() },
  scrollXProgress: { get: () => 0, on: jest.fn(), off: jest.fn() },
  scrollYProgress: { get: () => 0, on: jest.fn(), off: jest.fn() },
}));

export {
  motion,
  AnimatePresence,
  LayoutGroup,
  AnimateSharedLayout,
  motionValue,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  useAnimate,
  useScroll,
};

export default {
  motion,
  AnimatePresence,
  LayoutGroup,
  AnimateSharedLayout,
  motionValue,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  useAnimate,
  useScroll,
};
