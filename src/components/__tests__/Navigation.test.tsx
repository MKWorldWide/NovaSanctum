import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock framer-motion to prevent animation issues during testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe('Navigation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders navigation metrics', () => {
    render(<Navigation />);
    expect(screen.getByText('Current Speed')).toBeInTheDocument();
    expect(screen.getByText('Distance Traveled')).toBeInTheDocument();
    expect(screen.getByText('Fuel Level')).toBeInTheDocument();
    expect(screen.getByText('Shield Strength')).toBeInTheDocument();
  });

  it('renders trajectory list', () => {
    render(<Navigation />);
    expect(screen.getByText('Active Trajectories')).toBeInTheDocument();
    expect(screen.getByText('Mars Colony Route')).toBeInTheDocument();
    expect(screen.getByText('Venus Research Mission')).toBeInTheDocument();
    expect(screen.getByText('Jupiter Exploration')).toBeInTheDocument();
  });

  it('updates metrics over time', () => {
    render(<Navigation />);
    const initialSpeed = screen.getByText(/Current Speed/).nextSibling?.textContent;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const newSpeed = screen.getByText(/Current Speed/).nextSibling?.textContent;
    expect(newSpeed).not.toBe(initialSpeed);
  });

  it('handles trajectory selection', () => {
    render(<Navigation />);
    const marsTrajectory = screen.getByText('Mars Colony Route').closest('div');
    fireEvent.click(marsTrajectory!);
    expect(marsTrajectory).toHaveClass('bg-white/20');
  });

  it('handles course correction', () => {
    render(<Navigation />);
    const correctionButton = screen.getByText('Initiate Course Correction');

    fireEvent.click(correctionButton);
    expect(screen.getByText('Correcting Course...')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByText('10%')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4500);
    });

    expect(screen.getByText('Initiate Course Correction')).toBeInTheDocument();
  });

  it('displays course status information', () => {
    render(<Navigation />);
    expect(screen.getByText('Current Course Status')).toBeInTheDocument();
    expect(screen.getByText('Deviation')).toBeInTheDocument();
    expect(screen.getByText('Correction Needed')).toBeInTheDocument();
    expect(screen.getByText('Fuel Impact')).toBeInTheDocument();
  });
});
