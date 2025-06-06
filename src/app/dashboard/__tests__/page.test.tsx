import { render, screen } from '@testing-library/react';
import Dashboard from '../page';

// Mock the Navigation component
jest.mock('@/components/Navigation', () => ({
  Navigation: () => <div data-testid="mock-navigation">Navigation</div>,
}));

describe('Dashboard', () => {
  it('renders the dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders all stats cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Research Papers')).toBeInTheDocument();
    expect(screen.getByText('Data Points')).toBeInTheDocument();
  });

  it('renders recent projects section', () => {
    render(<Dashboard />);
    expect(screen.getByText('Recent Projects')).toBeInTheDocument();
    expect(screen.getByText('Synthetic DNA Sequencing')).toBeInTheDocument();
    expect(screen.getByText('Neural Network Optimization')).toBeInTheDocument();
    expect(screen.getByText('Protein Folding Analysis')).toBeInTheDocument();
  });

  it('renders the navigation component', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });
});
