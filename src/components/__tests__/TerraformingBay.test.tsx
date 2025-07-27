import { render, screen, fireEvent, act } from '@testing-library/react';
import { TerraformingBay } from '../TerraformingBay';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const originalModule = jest.requireActual('framer-motion');
  return {
    ...originalModule,
    motion: {
      ...originalModule.motion,
      div: ({ children, ...props }: any) => {
        const { whileHover, whileTap, ...rest } = props;
        return <div {...rest}>{children}</div>;
      },
      button: ({ children, ...props }: any) => {
        const { whileHover, whileTap, ...rest } = props;
        return <button {...rest}>{children}</button>;
      },
    },
  };
});

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
    // Find all elements with the canister name
    const canisterElements = screen.getAllByText('Ancient Redwood');
    // Find the motion.div with the expected class
    const canisterDiv = canisterElements
      .find(el => el.closest('div.p-4.rounded-lg.cursor-pointer'))
      ?.closest('div.p-4.rounded-lg.cursor-pointer');
    fireEvent.click(canisterDiv!);
    expect(canisterDiv).toHaveClass('ring-2');
  });
});
