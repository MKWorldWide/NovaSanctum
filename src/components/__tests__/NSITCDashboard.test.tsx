import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NSITCDashboard from '../NSITCDashboard';

// Mock the TerraformingBay component
jest.mock('../TerraformingBay', () => ({
  TerraformingBay: () => <div data-testid="terraforming-bay">Terraforming Bay</div>,
}));

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

describe('NSITCDashboard', () => {
  it('renders the dashboard title and description', () => {
    render(<NSITCDashboard />);
    expect(screen.getByText('NS-ITC Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('NovaSanctum Interplanetary Transport Cabin Control Interface')
    ).toBeInTheDocument();
  });

  it('renders all module buttons', () => {
    render(<NSITCDashboard />);
    // Use getAllByText and check for a button
    const terraformingButtons = screen.getAllByText('Terraforming Bay');
    const terraformingButton = terraformingButtons.find(el => el.closest('button'));
    expect(terraformingButton).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Defense Systems')).toBeInTheDocument();
    expect(screen.getByText('AI Core')).toBeInTheDocument();
  });

  it('shows Terraforming Bay by default', () => {
    render(<NSITCDashboard />);
    expect(screen.getByTestId('terraforming-bay')).toBeInTheDocument();
  });

  it('switches modules when clicking different module buttons', () => {
    render(<NSITCDashboard />);

    // Click Navigation button
    fireEvent.click(screen.getByText('Navigation'));
    expect(screen.getByText('Navigation Systems')).toBeInTheDocument();
    expect(screen.queryByTestId('terraforming-bay')).not.toBeInTheDocument();

    // Click Defense Systems button
    const defenseButtons = screen.getAllByText('Defense Systems');
    const defenseButton = defenseButtons.find(el => el.closest('button'))?.closest('button');
    fireEvent.click(defenseButton!);
    expect(defenseButton).toBeInTheDocument();

    // Click AI Core button
    const aiCoreButtons = screen.getAllByText('AI Core');
    const aiCoreButton = aiCoreButtons.find(el => el.closest('button'))?.closest('button');
    fireEvent.click(aiCoreButton!);
    expect(aiCoreButton).toBeInTheDocument();

    // Click Terraforming Bay button
    fireEvent.click(screen.getByText('Terraforming Bay'));
    expect(screen.getByTestId('terraforming-bay')).toBeInTheDocument();
  });

  it('applies active styles to selected module button', () => {
    render(<NSITCDashboard />);
    // Use getAllByText to avoid ambiguity
    const terraformingButtons = screen.getAllByText('Terraforming Bay');
    // Find the button by checking parent element type
    const terraformingButton = terraformingButtons
      .find(el => el.closest('button'))
      ?.closest('button');
    expect(terraformingButton).toHaveClass('bg-white/20');

    fireEvent.click(screen.getByText('Navigation'));
    expect(terraformingButton).not.toHaveClass('bg-white/20');
    expect(screen.getByText('Navigation').closest('button')).toHaveClass('bg-white/20');
  });
});
