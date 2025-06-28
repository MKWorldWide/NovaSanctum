import { render, screen, fireEvent, act } from '@testing-library/react';
import { TerraformingBay } from '../TerraformingBay';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('TerraformingBay', () => {
  it('renders the terraforming bay title and description', () => {
    render(<TerraformingBay />);
    expect(screen.getByText('CRISPR TerraSeed Bay')).toBeInTheDocument();
    expect(screen.getByText('Planetary Seeding and Environmental Control')).toBeInTheDocument();
  });

  it('displays environmental metrics', () => {
    render(<TerraformingBay />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Oxygen')).toBeInTheDocument();
    expect(screen.getByText('Nitrogen')).toBeInTheDocument();
    expect(screen.getByText('CO₂')).toBeInTheDocument();
  });

  it('shows seed canisters with their status', () => {
    render(<TerraformingBay />);
    expect(screen.getByText('Ancient Redwood')).toBeInTheDocument();
    expect(screen.getByText('Quantum Butterfly')).toBeInTheDocument();
    expect(screen.getByText('Atmospheric Algae')).toBeInTheDocument();
  });

  it('allows deploying a seed canister', async () => {
    jest.useFakeTimers();
    render(<TerraformingBay />);

    const deployButton = screen.getAllByText('Deploy')[0];
    fireEvent.click(deployButton);

    // Check if the canister status changes to deploying
    expect(screen.getByText('Deploying')).toBeInTheDocument();

    // Fast-forward timers to complete deployment
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    // Check if the canister status changes to deployed
    expect(screen.getByText('Deployed')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('allows selecting a canister', () => {
    render(<TerraformingBay />);
    const canister = screen.getByText('Ancient Redwood').closest('div');
    fireEvent.click(canister!);
    expect(canister).toHaveClass('ring-2');
  });
});
