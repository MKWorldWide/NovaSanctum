import { render, screen } from '@testing-library/react';
import DashboardPage from '../page';

// Mock the Navigation component
jest.mock('@/components/Navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-navigation">Navigation</div>,
}));

// Mock all the services to prevent initialization errors
jest.mock('@/services/NovaSanctumMasterController', () => ({
  novaSanctumMasterController: {
    getUnifiedMetrics: () => ({
      totalNetworks: 10,
      activeCollaborations: 5,
      researchProjects: 20,
      funding: 1000000000,
      activeProjects: 15,
      teamMembers: 42,
      researchPapers: 45,
      dataPoints: 1500
    }),
    getNetworkStatistics: () => ({
      networks: {
        byType: {
          blackResearch: 3,
          scienceInstitutes: 4,
          government: 3
        },
        byClassification: {
          top_secret: 5,
          secret: 3,
          confidential: 2,
          unclassified: 0
        },
        byRegion: {
          northAmerica: 4,
          europe: 3,
          asia: 2,
          other: 1
        },
        total: 10,
        active: 8,
        inactive: 2
      },
      collaborations: {
        total: 15,
        active: 5,
        completed: 10,
        byDomain: {
          ai: 5,
          biotech: 4,
          quantum: 3,
          other: 3
        }
      },
      research: {
        totalProjects: 20,
        activeProjects: 12,
        publishedPapers: 45,
        citations: 1200
      },
      funding: {
        total: 1000000000,
        allocated: 750000000,
        available: 250000000,
        bySector: {
          ai: 300000000,
          biotech: 400000000,
          quantum: 200000000,
          other: 100000000
        }
      }
    }),
    getSystemHealth: () => ({
      status: 'operational',
      uptime: 99.98,
      lastUpdated: new Date().toISOString()
    }),
    getUnifiedNetworks: () => [],
    getCrossDomainCollaborations: () => [],
    getGenesisProtocolStatus: () => ({}),
    getDivinaL3Status: () => ({}),
    getQuantumGamingStatus: () => ({})
  }
}));

jest.mock('@/services/BlackResearchNetworks', () => ({
  blackResearchNetworks: {
    getBlackResearchStatistics: () => ({
      totalNetworks: 3,
      activeNetworks: 3,
      totalNodes: 150,
      totalStorage: 5000,
      averageUptime: 99.9
    })
  }
}));

jest.mock('@/services/TopScienceInstitutes', () => ({
  topScienceInstitutes: {
    getScienceInstituteStatistics: () => ({
      totalInstitutes: 4,
      activeResearchProjects: 25,
      publishedPapers: 120,
      totalFunding: 500000000
    })
  }
}));

jest.mock('@/services/GovernmentalNetworks', () => ({
  governmentalNetworks: {
    getGovernmentalNetworkStatistics: () => ({
      totalNetworks: 3,
      activeNetworks: 2,
      totalUsers: 500,
      totalStorage: 10000,
      complianceScore: 98.5
    })
  }
}));

jest.mock('@/services/InternationalResearchDatabase', () => ({
  internationalResearchDatabase: {
    getResearchStatistics: () => ({
      totalProjects: 20,
      activeProjects: 12,
      publishedPapers: 45,
      totalDatasets: 1500
    })
  }
}));

jest.mock('@/services/LilithEveIntegration', () => ({
  lilithEveIntegration: {
    getLilithEveMetrics: () => ({
      status: 'operational',
      uptime: '99.9%',
      activeConnections: 42,
      averageResponseTime: 200,
      errorRate: 0.1,
      statusText: 'Operational'
    })
  }
}));

jest.mock('@/services/EdenOneCityIntegration', () => ({
  edenOneCityIntegration: {
    getSystemStats: () => ({
      status: 'online',
      uptime: '99.9%',
      activeConnections: 100,
      averageResponseTime: 200,
      errorRate: 0.1,
      statusText: 'Operational'
    })
  }
}));

jest.mock('@/services/DivinaL3Integration', () => ({
  divinaL3Integration: {
    getDivinaL3Status: () => ({
      status: 'online',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      statusText: 'Operational'
    })
  }
}));

jest.mock('@/services/QuantumGamingService', () => ({
  quantumGamingService: {
    getQuantumGamingStatus: () => ({
      status: 'online',
      activePlayers: 50,
      totalGames: 10,
      averageLatency: 45,
      statusText: 'Operational'
    })
  }
}));

describe('Dashboard Page', () => {
  it('renders the dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders all stats cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Research Papers')).toBeInTheDocument();
    expect(screen.getByText('Data Points')).toBeInTheDocument();
  });

  it('renders the navigation component', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
  });

  it('displays the main statistics', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Total Networks')).toBeInTheDocument();
    expect(screen.getByText('Active Collaborations')).toBeInTheDocument();
    expect(screen.getByText('Research Projects')).toBeInTheDocument();
    expect(screen.getByText('Total Funding')).toBeInTheDocument();
  });

  it('displays the network statistics section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Network Statistics')).toBeInTheDocument();
    expect(screen.getByText('Black Research')).toBeInTheDocument();
    expect(screen.getByText('Science Institutes')).toBeInTheDocument();
    expect(screen.getByText('Government')).toBeInTheDocument();
  });

  it('displays the system health status', () => {
    render(<DashboardPage />);
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Operational')).toBeInTheDocument();
  });

  it('displays the integration status section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Integration Status')).toBeInTheDocument();
    expect(screen.getByText('Lilith Eve')).toBeInTheDocument();
    expect(screen.getByText('Eden One City')).toBeInTheDocument();
    expect(screen.getByText('Divina L3')).toBeInTheDocument();
    expect(screen.getByText('Quantum Gaming')).toBeInTheDocument();
  });
});
