import { render, screen } from '@testing-library/react';
<<<<<<< HEAD
import Dashboard from '../page';

// Mock the Navigation component
jest.mock('@/components/Navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-navigation">Navigation</div>,
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
=======
import DashboardPage from '../page';

// Mock all the services to prevent initialization errors
jest.mock('@/services/NovaSanctumMasterController', () => ({
  novaSanctumMasterController: {
    getUnifiedMetrics: () => ({
      totalNetworks: 10,
      activeCollaborations: 5,
      researchProjects: 20,
      funding: 1000000000
    }),
    getNetworkStatistics: () => ({
      networks: {
        byType: {
          biological: 5,
          solar: 3,
          black_research: 2,
          science_institute: 8,
          governmental: 12,
          international: 6,
          consciousness: 4,
          mystical: 3,
          gaming: 2,
          quantum: 7
        },
        byClassification: {
          public: 15,
          secret: 8,
          top_secret: 12,
          black: 5,
          above_top_secret: 3
        }
      }
    }),
    getSystemHealth: () => ({}),
    getUnifiedNetworks: () => ([]),
    getCrossDomainCollaborations: () => ([]),
    getGenesisProtocolStatus: () => ({}),
    getDivinaL3Status: () => ({}),
    getQuantumGamingStatus: () => ({})
  }
}));

jest.mock('@/services/BlackResearchNetworks', () => ({
  blackResearchNetworks: {
    getBlackResearchStatistics: () => ({})
  }
}));

jest.mock('@/services/TopScienceInstitutes', () => ({
  topScienceInstitutes: {
    getScienceInstituteStatistics: () => ({})
  }
}));

jest.mock('@/services/GovernmentalNetworks', () => ({
  governmentalNetworks: {
    getGovernmentalNetworkStatistics: () => ({})
  }
}));

jest.mock('@/services/InternationalResearchDatabase', () => ({
  internationalResearchDatabase: {
    getResearchStatistics: () => ({})
  }
}));

jest.mock('@/services/LilithEveIntegration', () => ({
  lilithEveIntegration: {
    getLilithEveMetrics: () => ({})
  }
}));

jest.mock('@/services/EdenOneCityIntegration', () => ({
  edenOneCityIntegration: {
    getSystemStats: () => ({})
  }
}));

jest.mock('@/services/DivinaL3Integration', () => ({
  divinaL3Integration: {
    getDivinaL3Status: () => ({})
  }
}));

jest.mock('@/services/QuantumGamingService', () => ({
  quantumGamingService: {
    getQuantumGamingStatus: () => ({})
  }
}));

describe('Dashboard Page', () => {
  it('renders the dashboard page', () => {
    render(<DashboardPage />);
    expect(screen.getByText('🌟 NovaSanctum Master Controller')).toBeInTheDocument();
  });

  it('shows the overview tab content', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Overview/)).toBeInTheDocument();
    expect(screen.getByText('🌟 Sun Kingdom Vision')).toBeInTheDocument();
>>>>>>> parent of b7917e5 (sync: auto-sync submodule with remote)
  });
});
