import { render, screen, act } from '@testing-library/react';
import { Navigation } from '../Navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation', () => {
  it('renders the NovaSanctum logo', () => {
    render(<Navigation />);
    expect(screen.getByText('NovaSanctum')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navigation />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders user menu items', async () => {
    render(<Navigation />);
    const userButton = screen.getByRole('button', { name: /open user menu/i });

    await act(async () => {
      userButton.click();
    });

    // Wait for the menu to be visible
    await screen.findByText('Your Profile');

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
