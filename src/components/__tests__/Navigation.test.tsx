import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock framer-motion to prevent animation issues during testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    button: ({ children, ...props }: Record<string, unknown>) => (
      <button {...props}>{children as React.ReactNode}</button>
    ),
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
    const marsTrajectories = screen.getAllByText('Mars Colony Route');
    const marsTrajectoryDiv = marsTrajectories
      .find(el => el.closest('div.p-4.rounded-lg.cursor-pointer'))
      ?.closest('div.p-4.rounded-lg.cursor-pointer');
    fireEvent.click(marsTrajectoryDiv!);
    expect(marsTrajectoryDiv).toHaveClass('bg-white/20');
  });

  it('handles course correction', async () => {
    render(<Navigation />);
    const correctionButton = screen.getByText('Initiate Course Correction');

    fireEvent.click(correctionButton);
    expect(screen.getByText('Correcting Course...')).toBeInTheDocument();

    // Simulate the full correction process
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // After correction, the button should revert to 'Initiate Course Correction'
    await waitFor(() => {
      const matches = screen.getAllByText(
        (content, node) => !!node?.textContent?.includes('Initiate Course Correction')
      );
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('displays course status information', () => {
    render(<Navigation />);
    expect(screen.getByText('Current Course Status')).toBeInTheDocument();
    expect(screen.getByText('Deviation')).toBeInTheDocument();
    expect(screen.getByText('Correction Needed')).toBeInTheDocument();
    expect(screen.getByText('Fuel Impact')).toBeInTheDocument();
  });
});
