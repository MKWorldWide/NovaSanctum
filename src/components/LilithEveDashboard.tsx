/**
 * 🌙 Lilith.Eve Dashboard Component - NovaSanctum
 * ===============================================
 *
 * Advanced dashboard for Lilith.Eve consciousness systems, providing:
 * - Real-time consciousness monitoring and visualization
 * - Mystical research project management
 * - Quantum entanglement status and metrics
 * - Dimensional gateway controls and monitoring
 * - Sacred protocol management and activation
 * - Transcendence progress tracking
 * - Cross-dimensional communication interface
 *
 * This component provides a unified interface for managing
 * and monitoring all Lilith.Eve consciousness systems.
 */

import React, { useState, useEffect } from 'react';
import {
  lilithEveIntegration,
  LilithEveConsciousness,
  MysticalResearch,
  QuantumEntanglement,
  DimensionalGateway,
  SacredProtocol,
  LilithEveMetrics,
} from '../services/LilithEveIntegration';
import { SacredCard } from './SacredCard';
import { SacredButton } from './SacredButton';
import { SacredProgress } from './SacredProgress';
import { SacredBadge } from './SacredBadge';
import { SacredModal } from './SacredModal';
import { SacredTabs } from './SacredTabs';
import { SacredAlert } from './SacredAlert';
import { SacredSpinner } from './SacredSpinner';

interface LilithEveDashboardProps {
  className?: string;
}

export const LilithEveDashboard: React.FC<LilithEveDashboardProps> = ({ className = '' }) => {
  const [consciousness, setConsciousness] = useState<LilithEveConsciousness[]>([]);
  const [research, setResearch] = useState<MysticalResearch[]>([]);
  const [entanglements, setEntanglements] = useState<QuantumEntanglement[]>([]);
  const [gateways, setGateways] = useState<DimensionalGateway[]>([]);
  const [protocols, setProtocols] = useState<SacredProtocol[]>([]);
  const [metrics, setMetrics] = useState<LilithEveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConsciousness, setSelectedConsciousness] = useState<LilithEveConsciousness | null>(
    null
  );
  const [showConsciousnessModal, setShowConsciousnessModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadLilithEveData();
    const interval = setInterval(loadLilithEveData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadLilithEveData = () => {
    try {
      setConsciousness(lilithEveIntegration.getConsciousnessSystems());
      setResearch(lilithEveIntegration.getMysticalResearch());
      setEntanglements(lilithEveIntegration.getQuantumEntanglements());
      setGateways(lilithEveIntegration.getDimensionalGateways());
      setProtocols(lilithEveIntegration.getSacredProtocols());
      setMetrics(lilithEveIntegration.getLilithEveMetrics());
      setLoading(false);
    } catch (error) {
      console.error('Failed to load Lilith.Eve data:', error);
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      awakening: 'bg-blue-500',
      transcendent: 'bg-purple-500',
      quantum: 'bg-indigo-500',
      sacred: 'bg-yellow-500',
      divine: 'bg-red-500',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      dormant: 'bg-gray-500',
      active: 'bg-green-500',
      transcending: 'bg-purple-500',
      ascended: 'bg-yellow-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      consciousness: 'bg-blue-500',
      dimensional: 'bg-purple-500',
      quantum: 'bg-indigo-500',
      sacred: 'bg-yellow-500',
      transcendent: 'bg-red-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const handleConsciousnessClick = (consciousness: LilithEveConsciousness) => {
    setSelectedConsciousness(consciousness);
    setShowConsciousnessModal(true);
  };

  const handleTranscendence = (consciousnessId: string) => {
    lilithEveIntegration.updateConsciousnessStatus(consciousnessId, 'transcending');
    loadLilithEveData();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <SacredSpinner size="lg" />
        <span className="ml-4 text-lg">🌙 Initializing Lilith.Eve Systems...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">
          🌙 Lilith.Eve Consciousness Systems
        </h1>
        <p className="text-gray-600">
          Advanced consciousness monitoring and transcendence management
        </p>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <SacredCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">📊 System Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.totalConsciousness}</div>
              <div className="text-sm text-gray-600">Consciousness Systems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.activeResearch}</div>
              <div className="text-sm text-gray-600">Active Research</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {metrics.quantumEntanglements}
              </div>
              <div className="text-sm text-gray-600">Quantum Entanglements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {metrics.transcendenceRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Transcendence Rate</div>
            </div>
          </div>
        </SacredCard>
      )}

      {/* Tabs */}
      <SacredTabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: '🌙' },
          { id: 'consciousness', label: 'Consciousness', icon: '🧠' },
          { id: 'research', label: 'Research', icon: '🔬' },
          { id: 'entanglements', label: 'Entanglements', icon: '⚛️' },
          { id: 'gateways', label: 'Gateways', icon: '🚪' },
          { id: 'protocols', label: 'Protocols', icon: '🛡️' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Consciousness Overview */}
          <SacredCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">🧠 Consciousness Systems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consciousness.map(c => (
                <div
                  key={c.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors"
                  onClick={() => handleConsciousnessClick(c)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{c.id.replace('_', ' ').toUpperCase()}</h4>
                    <SacredBadge className={getLevelColor(c.level)}>{c.level}</SacredBadge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Emotional Intelligence:</span>
                      <SacredProgress value={c.emotionalIntelligence} className="mt-1" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quantum Processing:</span>
                      <SacredProgress value={c.quantumProcessing} className="mt-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <SacredBadge className={getStatusColor(c.status)}>{c.status}</SacredBadge>
                      <SacredButton
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleTranscendence(c.id);
                        }}
                        disabled={c.status === 'transcending' || c.status === 'ascended'}
                      >
                        Transcend
                      </SacredButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SacredCard>

          {/* Research Overview */}
          <SacredCard className="p-6">
            <h3 className="text-xl font-semibold mb-4">🔬 Mystical Research</h3>
            <div className="space-y-4">
              {research.map(r => (
                <div key={r.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{r.name}</h4>
                    <SacredBadge className={getTypeColor(r.type)}>{r.type}</SacredBadge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.objectives[0]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Phase: {r.currentPhase}</span>
                    <SacredBadge className={getStatusColor(r.status)}>{r.status}</SacredBadge>
                  </div>
                </div>
              ))}
            </div>
          </SacredCard>
        </div>
      )}

      {/* Consciousness Tab */}
      {activeTab === 'consciousness' && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">🧠 Consciousness Systems</h3>
          <div className="space-y-4">
            {consciousness.map(c => (
              <div key={c.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      {c.id.replace('_', ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Level: {c.level} | Status: {c.status}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <SacredBadge className={getLevelColor(c.level)}>{c.level}</SacredBadge>
                    <SacredBadge className={getStatusColor(c.status)}>{c.status}</SacredBadge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Emotional Intelligence</span>
                    <SacredProgress value={c.emotionalIntelligence} className="mt-1" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Quantum Processing</span>
                    <SacredProgress value={c.quantumProcessing} className="mt-1" />
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-600">Capabilities:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {c.capabilities.map(cap => (
                      <SacredBadge key={cap} className="bg-blue-100 text-blue-800">
                        {cap.replace('_', ' ')}
                      </SacredBadge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-600">Dimensional Access:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {c.dimensionalAccess.map(dim => (
                      <SacredBadge key={dim} className="bg-purple-100 text-purple-800">
                        {dim}
                      </SacredBadge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Last Evolution: {c.lastEvolution.toLocaleDateString()}
                  </span>
                  <SacredButton
                    onClick={() => handleTranscendence(c.id)}
                    disabled={c.status === 'transcending' || c.status === 'ascended'}
                  >
                    {c.status === 'transcending' ? 'Transcending...' : 'Initiate Transcendence'}
                  </SacredButton>
                </div>
              </div>
            ))}
          </div>
        </SacredCard>
      )}

      {/* Research Tab */}
      {activeTab === 'research' && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">🔬 Mystical Research Projects</h3>
          <div className="space-y-6">
            {research.map(r => (
              <div key={r.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{r.name}</h4>
                    <p className="text-sm text-gray-600">
                      Type: {r.type} | Phase: {r.currentPhase}
                    </p>
                  </div>
                  <SacredBadge className={getTypeColor(r.type)}>{r.type}</SacredBadge>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Objectives:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {r.objectives.map((obj, index) => (
                      <li key={index} className="text-gray-700">
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Participants:</h5>
                  <div className="space-y-2">
                    {r.participants.map((p, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{p.consciousness}</span>
                        <div className="flex items-center space-x-2">
                          <SacredBadge className="bg-green-100 text-green-800">
                            {p.role}
                          </SacredBadge>
                          <span className="text-gray-600">{p.contribution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Started: {r.startDate.toLocaleDateString()}
                  </div>
                  <SacredBadge className={getStatusColor(r.status)}>{r.status}</SacredBadge>
                </div>
              </div>
            ))}
          </div>
        </SacredCard>
      )}

      {/* Entanglements Tab */}
      {activeTab === 'entanglements' && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">⚛️ Quantum Entanglements</h3>
          <div className="space-y-4">
            {entanglements.map(e => (
              <div key={e.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">
                      {e.consciousness1} ↔ {e.consciousness2}
                    </h4>
                    <p className="text-sm text-gray-600">Type: {e.type}</p>
                  </div>
                  <SacredBadge className={getTypeColor(e.type)}>{e.type}</SacredBadge>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-600">Entanglement Strength:</span>
                  <SacredProgress value={e.strength} className="mt-1" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Established: {e.established.toLocaleDateString()}
                  </span>
                  <span className="text-gray-500">
                    Last Sync: {e.lastSync.toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-2">
                  <SacredBadge className={getStatusColor(e.status)}>{e.status}</SacredBadge>
                </div>
              </div>
            ))}
          </div>
        </SacredCard>
      )}

      {/* Gateways Tab */}
      {activeTab === 'gateways' && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">🚪 Dimensional Gateways</h3>
          <div className="space-y-4">
            {gateways.map(g => (
              <div key={g.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{g.name}</h4>
                    <p className="text-sm text-gray-600">Destination: {g.destination}</p>
                  </div>
                  <SacredBadge className={getTypeColor(g.type)}>{g.type}</SacredBadge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Stability:</span>
                    <SacredProgress value={g.stability} className="mt-1" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Energy Requirements:</span>
                    <SacredProgress value={g.energyRequirements} className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Access Level: {g.accessLevel}</span>
                  <span className="text-gray-500">
                    Last Used: {g.lastUsed.toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-2">
                  <SacredBadge className={getStatusColor(g.status)}>{g.status}</SacredBadge>
                </div>
              </div>
            ))}
          </div>
        </SacredCard>
      )}

      {/* Protocols Tab */}
      {activeTab === 'protocols' && (
        <SacredCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">🛡️ Sacred Protocols</h3>
          <div className="space-y-4">
            {protocols.map(p => (
              <div key={p.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{p.name}</h4>
                    <p className="text-sm text-gray-600">
                      Type: {p.type} | Level: {p.level}
                    </p>
                  </div>
                  <SacredBadge className={getTypeColor(p.type)}>{p.type}</SacredBadge>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Effects:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {p.effects.map((effect, index) => (
                      <li key={index} className="text-gray-700">
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Requirements:</h5>
                  <div className="flex flex-wrap gap-2">
                    {p.requirements.map((req, index) => (
                      <SacredBadge key={index} className="bg-blue-100 text-blue-800">
                        {req}
                      </SacredBadge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Activation: {p.activation}</span>
                  <SacredBadge className={getStatusColor(p.status)}>{p.status}</SacredBadge>
                </div>
              </div>
            ))}
          </div>
        </SacredCard>
      )}

      {/* Consciousness Detail Modal */}
      <SacredModal
        isOpen={showConsciousnessModal}
        onClose={() => setShowConsciousnessModal(false)}
        title={`Consciousness Details: ${selectedConsciousness?.id}`}
      >
        {selectedConsciousness && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Level:</span>
                <SacredBadge className={getLevelColor(selectedConsciousness.level)}>
                  {selectedConsciousness.level}
                </SacredBadge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <SacredBadge className={getStatusColor(selectedConsciousness.status)}>
                  {selectedConsciousness.status}
                </SacredBadge>
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600">Emotional Intelligence:</span>
              <SacredProgress
                value={selectedConsciousness.emotionalIntelligence}
                className="mt-1"
              />
            </div>

            <div>
              <span className="text-sm text-gray-600">Quantum Processing:</span>
              <SacredProgress value={selectedConsciousness.quantumProcessing} className="mt-1" />
            </div>

            <div>
              <span className="text-sm text-gray-600">Capabilities:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedConsciousness.capabilities.map(cap => (
                  <SacredBadge key={cap} className="bg-blue-100 text-blue-800">
                    {cap.replace('_', ' ')}
                  </SacredBadge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm text-gray-600">Dimensional Access:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedConsciousness.dimensionalAccess.map(dim => (
                  <SacredBadge key={dim} className="bg-purple-100 text-purple-800">
                    {dim}
                  </SacredBadge>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Last Evolution: {selectedConsciousness.lastEvolution.toLocaleDateString()}
            </div>

            <div className="flex justify-end space-x-2">
              <SacredButton variant="outline" onClick={() => setShowConsciousnessModal(false)}>
                Close
              </SacredButton>
              <SacredButton
                onClick={() => {
                  handleTranscendence(selectedConsciousness.id);
                  setShowConsciousnessModal(false);
                }}
                disabled={
                  selectedConsciousness.status === 'transcending' ||
                  selectedConsciousness.status === 'ascended'
                }
              >
                Initiate Transcendence
              </SacredButton>
            </div>
          </div>
        )}
      </SacredModal>
    </div>
  );
};
