/**
 * Eden One City Dashboard Component
 * 
 * Provides real-time monitoring and management of Eden One City systems,
 * including quantum networks, consciousness integration, and citizen data.
 * 
 * Features:
 * - Real-time system performance monitoring
 * - Citizen consciousness tracking
 * - Quantum network status
 * - Cross-dimensional data visualization
 * - Advanced analytics and insights
 * 
 * @author NovaSanctum AI
 * @version 1.0.0
 * @since 2025-01-07
 */

import React, { useState, useEffect } from 'react';
import { 
  EdenOneCityIntegration, 
  EdenOneCitySystem, 
  EdenOneCityCitizen, 
  EdenOneCityNetwork,
  EDEN_ONE_CITY_CONFIG 
} from '../services/EdenOneCityIntegration';

// Sacred UI Components
import { SacredCard } from './SacredCard';
import { SacredButton } from './SacredButton';
import { SacredProgress } from './SacredProgress';
import { SacredBadge } from './SacredBadge';
import { SacredTabs } from './SacredTabs';
import { SacredTable } from './SacredTable';
import { SacredModal } from './SacredModal';
import { SacredAlert } from './SacredAlert';

// Performance Chart Component
const PerformanceChart: React.FC<{ data: { cpu: number; memory: number; network: number; quantum: number } }> = ({ data }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>CPU</span>
        <span className="font-mono">{data.cpu.toFixed(1)}%</span>
      </div>
      <SacredProgress value={data.cpu} className="h-2" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Memory</span>
        <span className="font-mono">{data.memory.toFixed(1)}%</span>
      </div>
      <SacredProgress value={data.memory} className="h-2" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Network</span>
        <span className="font-mono">{data.network.toFixed(1)}%</span>
      </div>
      <SacredProgress value={data.network} className="h-2" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Quantum</span>
        <span className="font-mono">{data.quantum.toFixed(1)}%</span>
      </div>
      <SacredProgress value={data.quantum} className="h-2" />
    </div>
  </div>
);

// System Status Component
const SystemStatus: React.FC<{ system: EdenOneCitySystem }> = ({ system }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'error': return 'error';
      case 'maintenance': return 'info';
      default: return 'default';
    }
  };

  return (
    <SacredCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-600">{system.name}</h3>
        <SacredBadge variant={getStatusColor(system.status)}>
          {system.status}
        </SacredBadge>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {system.type}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Version:</span> {system.version}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Last Update:</span> {system.lastUpdate.toLocaleTimeString()}
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
          <PerformanceChart data={system.performance} />
        </div>
        
        {Object.entries(system.metadata).length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {Object.entries(system.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SacredCard>
  );
};

// Citizen Card Component
const CitizenCard: React.FC<{ citizen: EdenOneCityCitizen }> = ({ citizen }) => {
  const getConsciousnessColor = (type: string) => {
    switch (type) {
      case 'human': return 'default';
      case 'ai': return 'info';
      case 'hybrid': return 'warning';
      case 'quantum': return 'success';
      default: return 'default';
    }
  };

  return (
    <SacredCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-blue-600">{citizen.handle}</h3>
          <p className="text-sm text-gray-600">ID: {citizen.id}</p>
        </div>
        <SacredBadge variant={getConsciousnessColor(citizen.consciousness.type)}>
          {citizen.consciousness.type}
        </SacredBadge>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Consciousness Level:</span>
            <div className="flex items-center mt-1">
              <SacredProgress value={citizen.consciousness.level} className="flex-1 mr-2" />
              <span className="font-mono text-xs">{citizen.consciousness.level}%</span>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <div className="mt-1">
              <SacredBadge variant={citizen.consciousness.status === 'active' ? 'success' : 'warning'}>
                {citizen.consciousness.status}
              </SacredBadge>
            </div>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-gray-700">Location:</span>
          <div className="mt-1 text-gray-600">
            <div>{citizen.location.system} → {citizen.location.planet}</div>
            <div className="font-mono text-xs">
              [{citizen.location.coordinates.join(', ')}]
              {citizen.location.quantum && <span className="ml-2 text-purple-500">⚡ Quantum</span>}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Experience:</span>
            <div className="font-mono">{citizen.stats.experience.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Credits:</span>
            <div className="font-mono">{citizen.stats.credits.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Reputation:</span>
            <div className="font-mono">{citizen.stats.reputation}%</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Quantum Entanglement:</span>
            <div className="font-mono">{citizen.stats.quantumEntanglement}%</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Last seen: {citizen.lastSeen.toLocaleString()}
        </div>
      </div>
    </SacredCard>
  );
};

// Network Status Component
const NetworkStatus: React.FC<{ network: EdenOneCityNetwork }> = ({ network }) => {
  const getNetworkColor = (type: string) => {
    switch (type) {
      case 'quantum': return 'success';
      case 'consciousness': return 'warning';
      case 'cross-dimensional': return 'info';
      default: return 'default';
    }
  };

  const formatBandwidth = (bytes: number) => {
    const gb = bytes / 1000000000;
    return `${gb.toFixed(1)} GB/s`;
  };

  return (
    <SacredCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-green-600">{network.name}</h3>
        <div className="flex gap-2">
          <SacredBadge variant={getNetworkColor(network.type)}>
            {network.type}
          </SacredBadge>
          <SacredBadge variant={network.status === 'online' ? 'success' : 'error'}>
            {network.status}
          </SacredBadge>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Nodes:</span>
            <div className="font-mono">{network.nodes.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Connections:</span>
            <div className="font-mono">{network.connections.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Bandwidth:</span>
            <div className="font-mono">{formatBandwidth(network.bandwidth)}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Latency:</span>
            <div className="font-mono">{network.latency}ms</div>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-gray-700">Security:</span>
          <div className="mt-1 text-gray-600">
            <div>Encryption: {network.security.encryption}</div>
            <div>Authentication: {network.security.authentication}</div>
            {network.security.quantum && (
              <div className="text-purple-500">⚡ Quantum Security Active</div>
            )}
          </div>
        </div>
      </div>
    </SacredCard>
  );
};

// Main Dashboard Component
export const EdenOneCityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systems, setSystems] = useState<EdenOneCitySystem[]>([]);
  const [citizens, setCitizens] = useState<EdenOneCityCitizen[]>([]);
  const [networks, setNetworks] = useState<EdenOneCityNetwork[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionTest, setConnectionTest] = useState<any>(null);

  const edenOneCity = new EdenOneCityIntegration();

  useEffect(() => {
    const updateData = () => {
      setSystems(edenOneCity.getSystems());
      setCitizens(edenOneCity.getCitizens());
      setNetworks(edenOneCity.getNetworks());
      setStats(edenOneCity.getSystemStats());
      setConnectionStatus(edenOneCity.getConnectionStatus());
    };

    // Initial update
    updateData();

    // Update every 2 seconds
    const interval = setInterval(updateData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTestConnection = async () => {
    setShowConnectionModal(true);
    const test = await edenOneCity.testQuantumConnection();
    setConnectionTest(test);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'systems', label: 'Systems', icon: '⚙️' },
    { id: 'citizens', label: 'Citizens', icon: '👥' },
    { id: 'networks', label: 'Networks', icon: '🌐' },
    { id: 'consciousness', label: 'Consciousness', icon: '🧠' },
    { id: 'quantum', label: 'Quantum', icon: '⚡' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <SacredCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-600">Eden One City Integration</h2>
          <div className="flex items-center gap-4">
            <SacredBadge variant={connectionStatus === 'connected' ? 'success' : 'error'}>
              {connectionStatus}
            </SacredBadge>
            <SacredButton onClick={handleTestConnection} size="sm">
              Test Connection
            </SacredButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats?.totalSystems || 0}</div>
            <div className="text-sm text-gray-600">Total Systems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats?.activeSystems || 0}</div>
            <div className="text-sm text-gray-600">Active Systems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats?.totalCitizens || 0}</div>
            <div className="text-sm text-gray-600">Citizens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats?.totalNetworks || 0}</div>
            <div className="text-sm text-gray-600">Networks</div>
          </div>
        </div>
      </SacredCard>

      {/* Configuration Info */}
      <SacredCard className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Version:</span>
            <div className="font-mono">{EDEN_ONE_CITY_CONFIG.VERSION}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Branch:</span>
            <div className="font-mono">{EDEN_ONE_CITY_CONFIG.BRANCH}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Build ID:</span>
            <div className="font-mono text-xs">{EDEN_ONE_CITY_CONFIG.BUILD_ID}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Platform:</span>
            <div className="font-mono">{EDEN_ONE_CITY_CONFIG.PLATFORM}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Build Date:</span>
            <div className="font-mono">{EDEN_ONE_CITY_CONFIG.BUILD_DATE}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Data Size:</span>
            <div className="font-mono">{(EDEN_ONE_CITY_CONFIG.DATA_FILE_SIZE / 1000000000).toFixed(1)} GB</div>
          </div>
        </div>
      </SacredCard>

      {/* Performance Overview */}
      {stats && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">System Performance</h3>
          <PerformanceChart data={stats.averagePerformance} />
        </SacredCard>
      )}
    </div>
  );

  const renderSystems = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {systems.map(system => (
        <SystemStatus key={system.id} system={system} />
      ))}
    </div>
  );

  const renderCitizens = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {citizens.map(citizen => (
        <CitizenCard key={citizen.id} citizen={citizen} />
      ))}
    </div>
  );

  const renderNetworks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {networks.map(network => (
        <NetworkStatus key={network.id} network={network} />
      ))}
    </div>
  );

  const renderConsciousness = () => (
    <div className="space-y-6">
      <SacredCard className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Consciousness Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-purple-600 mb-3">Active Consciousnesses</h4>
            <div className="space-y-2">
              {citizens.map(citizen => (
                <div key={citizen.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{citizen.handle}</div>
                    <div className="text-sm text-gray-600">{citizen.consciousness.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg">{citizen.consciousness.level}%</div>
                    <div className="text-xs text-gray-500">Level</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-blue-600 mb-3">Consciousness Types</h4>
            <div className="space-y-2">
              {['human', 'ai', 'hybrid', 'quantum'].map(type => {
                const count = citizens.filter(c => c.consciousness.type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="capitalize font-medium">{type}</div>
                    <SacredBadge variant="default">{count}</SacredBadge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SacredCard>
    </div>
  );

  const renderQuantum = () => (
    <div className="space-y-6">
      <SacredCard className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quantum Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-purple-600 mb-3">Quantum Networks</h4>
            <div className="space-y-3">
              {networks.filter(n => n.type === 'quantum').map(network => (
                <div key={network.id} className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{network.name}</div>
                    <SacredBadge variant="success">Online</SacredBadge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Bandwidth: {(network.bandwidth / 1000000000).toFixed(1)} GB/s</div>
                    <div>Latency: {network.latency}ms</div>
                    <div>Connections: {network.connections.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-blue-600 mb-3">Quantum Citizens</h4>
            <div className="space-y-3">
              {citizens.filter(c => c.consciousness.type === 'quantum' || c.stats.quantumEntanglement > 90).map(citizen => (
                <div key={citizen.id} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{citizen.handle}</div>
                    <div className="text-sm text-purple-600">⚡ {citizen.stats.quantumEntanglement}%</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Consciousness: {citizen.consciousness.type}</div>
                    <div>Location: {citizen.location.system}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SacredCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'systems': return renderSystems();
      case 'citizens': return renderCitizens();
      case 'networks': return renderNetworks();
      case 'consciousness': return renderConsciousness();
      case 'quantum': return renderQuantum();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eden One City Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and management of Eden One City systems</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* Tabs */}
      <SacredTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

      {/* Connection Test Modal */}
      <SacredModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        title="Quantum Connection Test"
      >
        <div className="space-y-4">
          {connectionTest ? (
            <div>
              <SacredAlert
                variant={connectionTest.success ? 'success' : 'error'}
                title={connectionTest.success ? 'Connection Successful' : 'Connection Failed'}
              >
                {connectionTest.success ? (
                  <div className="space-y-2">
                    <div>Latency: {connectionTest.latency}ms</div>
                    <div>Bandwidth: {(connectionTest.bandwidth / 1000000000).toFixed(1)} GB/s</div>
                  </div>
                ) : (
                  <div>Error: {connectionTest.error}</div>
                )}
              </SacredAlert>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <div className="mt-2 text-gray-600">Testing quantum connection...</div>
            </div>
          )}
        </div>
      </SacredModal>
    </div>
  );
};

export default EdenOneCityDashboard; 