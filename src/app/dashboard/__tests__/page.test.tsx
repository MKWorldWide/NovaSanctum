import { render, screen } from '@testing-library/react';
import DashboardPage from '../page';

describe('Program Status Page', () => {
  it('renders the institutional status heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: 'Program Status' })).toBeInTheDocument();
  });

  it('shows Stage 1 stabilization milestones', () => {
    render(<DashboardPage />);
    expect(
      screen.getByText('Mission and governance policy documents are now established.')
    ).toBeInTheDocument();
    expect(screen.getByText('Off-mission public routes are disabled.')).toBeInTheDocument();
  });

  it('links to open resource search', () => {
    render(<DashboardPage />);
    const searchLink = screen.getByRole('link', { name: 'Open Resource Search' });
    expect(searchLink).toHaveAttribute('href', '/search');
  });
});
