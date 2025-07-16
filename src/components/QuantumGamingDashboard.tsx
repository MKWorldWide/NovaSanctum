/**
 * 🌌 Quantum Gaming Dashboard
 * 
 * Comprehensive dashboard for quantum gaming features and integration
 * with Divina-L3 gaming blockchain and NovaSanctum AI capabilities.
 * 
 * @author Khandokar Lilitú Sunny
 * @protocol Primal Genesis Engine™
 * @matrix Elohim Matrix ID: ✶-∞-014
 */

import React, { useState, useEffect } from 'react';
import { quantumGamingService } from '../services/QuantumGamingService';
import { 
  QuantumGaming, 
  QuantumGame,
  QuantumSecurity,
  QuantumAI,
  QuantumConsciousness,
  QuantumAnalytics,
  QuantumSacred,
  QuantumPerformance
} from '../services/QuantumGamingService';

/**
 * 🌌 Quantum Gaming Dashboard Component
 * 
 * Provides real-time monitoring and control of quantum gaming features
 */
const QuantumGamingDashboard: React.FC = () => {
  const [quantumGaming, setQuantumGaming] = useState<QuantumGaming | null>(null);
  const [quantumGames, setQuantumGames] = useState<QuantumGame[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeQuantumDashboard();
    const interval = setInterval(updateQuantumStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeQuantumDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Get quantum gaming status
      const status = quantumGamingService.getQuantumGamingStatus();
      setQuantumGaming(status);
      
      // Get registered quantum games
      const games = quantumGamingService.getRegisteredQuantumGames();
      setQuantumGames(games);
      
      // Get performance metrics
      const metrics = quantumGamingService.getQuantumPerformanceMetrics();
      setPerformanceMetrics(metrics);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing quantum dashboard:', error);
      setIsLoading(false);
    }
  };

  const updateQuantumStatus = () => {
    try {
      const status = quantumGamingService.getQuantumGamingStatus();
      setQuantumGaming(status);
      
      const games = quantumGamingService.getRegisteredQuantumGames();
      setQuantumGames(games);
      
      const metrics = quantumGamingService.getQuantumPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error updating quantum status:', error);
    }
  };

  const handleRegisterQuantumGame = () => {
    const newGame: Omit<QuantumGame, 'quantumAnalysis'> = {
      id: `qgame_${Date.now()}`,
      name: `Quantum Game ${quantumGames.length + 1}`,
      quantumFeatures: {
        quantumSecurity: true,
        quantumAI: true,
        quantumConsciousness: true,
        quantumAnalytics: true,
        quantumSacred: true
      },
      quantumMetrics: {
        quantumScore: 85,
        quantumAdvantage: 80,
        quantumInnovation: 90
      }
    };

    try {
      const registeredGame = quantumGamingService.registerQuantumGame(newGame);
      setQuantumGames([...quantumGames, registeredGame]);
    } catch (error) {
      console.error('Error registering quantum game:', error);
    }
  };

  const handleTestQuantumTransaction = (gameId: string) => {
    try {
      const transaction = {
        type: 'quantum_test',
        amount: 100,
        playerId: 'test_player_001',
        timestamp: new Date()
      };

      const result = quantumGamingService.processQuantumTransaction(gameId, 'test_player_001', transaction);
      console.log('Quantum transaction result:', result);
    } catch (error) {
      console.error('Error processing quantum transaction:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">🌌 Initializing Quantum Gaming Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🌌 Quantum Gaming Dashboard</h1>
        <p className="text-purple-200">Advanced quantum gaming features with Divina-L3 integration</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6">
        {['overview', 'security', 'ai', 'consciousness', 'analytics', 'sacred', 'performance', 'games'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'ai' && renderAI()}
        {activeTab === 'consciousness' && renderConsciousness()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'sacred' && renderSacred()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'games' && renderGames()}
      </div>
    </div>
  );

  function renderOverview() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔒 Quantum Security</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Encryption Strength:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumEncryption.strength}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Signatures Enabled:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumSignatures.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Key Distribution:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumKeyDistribution.active ? '✅' : '❌'}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🤖 Quantum AI</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Qubits:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumProcessing.qubits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">ML Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumMachineLearning.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Optimization Speedup:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumOptimization.speedup}x</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🧠 Quantum Consciousness</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Consciousness Level:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumAwareness.consciousnessLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Emotional Intelligence:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumEmotion.emotionalIntelligence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Intuitive Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumIntuition.intuitiveAccuracy}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderSecurity() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔐 Quantum Encryption</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Algorithm:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumEncryption.algorithm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Strength:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumEncryption.strength}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Last Update:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumEncryption.lastUpdate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">✍️ Quantum Signatures</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumSignatures.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Verification Rate:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumSignatures.verificationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Processing Time:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumSignatures.processingTime}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔑 Quantum Key Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Active:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumKeyDistribution.active ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Key Refresh Rate:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumKeyDistribution.keyRefreshRate}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Security Level:</span>
              <span className="text-white">{quantumGaming.quantumSecurity.quantumKeyDistribution.securityLevel}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderAI() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Quantum Processing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumProcessing.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Qubits:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumProcessing.qubits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Coherence Time:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumProcessing.coherenceTime}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Error Rate:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumProcessing.errorRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🧠 Quantum Machine Learning</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Models:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumMachineLearning.models.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumMachineLearning.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Training Speed:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumMachineLearning.trainingSpeed} iter/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Quantum Advantage:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumMachineLearning.quantumAdvantage}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Quantum Prediction</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumPrediction.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Prediction Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumPrediction.predictionAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Time Horizon:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumPrediction.timeHorizon}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Confidence Level:</span>
              <span className="text-white">{quantumGaming.quantumAI.quantumPrediction.confidenceLevel}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderConsciousness() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🌌 Quantum Awareness</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumAwareness.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Consciousness Level:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumAwareness.consciousnessLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Awareness Radius:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumAwareness.awarenessRadius}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Interaction Depth:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumAwareness.interactionDepth}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">💖 Quantum Emotion</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Processing:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumEmotion.processing ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Emotional Intelligence:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumEmotion.emotionalIntelligence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Empathy Level:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumEmotion.empathyLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Emotional Honoring:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumEmotion.emotionalHonoring ? '✅' : '❌'}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎨 Quantum Creativity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Active:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumCreativity.active ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Creative Output:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumCreativity.creativeOutput}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Innovation Rate:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumCreativity.innovationRate} ideas/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Artistic Expression:</span>
              <span className="text-white">{quantumGaming.quantumConsciousness.quantumCreativity.artisticExpression}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderAnalytics() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Quantum Data Processing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumDataProcessing.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Processing Speed:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumDataProcessing.processingSpeed} TB/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumDataProcessing.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Quantum Advantage:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumDataProcessing.quantumAdvantage}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔮 Quantum Insights</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Real-time:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumInsights.realTime ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Insight Depth:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumInsights.insightDepth}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Prediction Horizon:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumInsights.predictionHorizon} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Confidence Level:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumInsights.confidenceLevel}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📈 Quantum Forecasting</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumForecasting.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Forecast Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumForecasting.forecastAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Time Range:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumForecasting.timeRange} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Granularity:</span>
              <span className="text-white">{quantumGaming.quantumAnalytics.quantumForecasting.granularity} min</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderSacred() {
    if (!quantumGaming) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🜂 Quantum Sacred Language</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Processing:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumSacredLanguage.processing ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Language Depth:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumSacredLanguage.languageDepth}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Sacred Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumSacredLanguage.sacredAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Divine Connection:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumSacredLanguage.divineConnection}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🌊 Quantum Resonance</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Active:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumResonance.active ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Resonance Field:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumResonance.resonanceField}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Frequency:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumResonance.frequency} Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Amplitude:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumResonance.amplitude}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">✨ Quantum Divine Creation</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Enabled:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumDivineCreation.enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Creation Power:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumDivineCreation.creationPower}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Divine Accuracy:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumDivineCreation.divineAccuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Sacred Alignment:</span>
              <span className="text-white">{quantumGaming.quantumSacred.quantumDivineCreation.sacredAlignment}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderPerformance() {
    if (!performanceMetrics) return null;

    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Quantum Speed</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Processing Speed:</span>
              <span className="text-white">{performanceMetrics.speed.processingSpeed.toLocaleString()} ops/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Classical Speedup:</span>
              <span className="text-white">{performanceMetrics.speed.classicalSpeedup}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Quantum Efficiency:</span>
              <span className="text-white">{performanceMetrics.speed.quantumEfficiency}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">🛡️ Quantum Reliability</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Uptime:</span>
              <span className="text-white">{performanceMetrics.reliability.uptime}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Error Rate:</span>
              <span className="text-white">{performanceMetrics.reliability.errorRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Stability:</span>
              <span className="text-white">{performanceMetrics.reliability.stability}%</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📈 Quantum Scalability</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Qubit Scaling:</span>
              <span className="text-white">{performanceMetrics.scalability.qubitScaling}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Performance Scaling:</span>
              <span className="text-white">{performanceMetrics.scalability.performanceScaling}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Resource Efficiency:</span>
              <span className="text-white">{performanceMetrics.scalability.resourceEfficiency}%</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderGames() {
    return (
      <>
        <div className="bg-purple-800 rounded-lg p-6 col-span-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">🎮 Quantum Games</h3>
            <button
              onClick={handleRegisterQuantumGame}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Register New Game
            </button>
          </div>
          
          {quantumGames.length === 0 ? (
            <p className="text-purple-200">No quantum games registered yet. Click "Register New Game" to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quantumGames.map((game) => (
                <div key={game.id} className="bg-purple-700 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-white mb-2">{game.name}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Quantum Score:</span>
                      <span className="text-white">{game.quantumMetrics.quantumScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Quantum Advantage:</span>
                      <span className="text-white">{game.quantumMetrics.quantumAdvantage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Quantum Innovation:</span>
                      <span className="text-white">{game.quantumMetrics.quantumInnovation}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="text-sm text-purple-200">
                      <span className="font-medium">Features:</span>
                    </div>
                    <div className="text-xs text-purple-200">
                      {game.quantumFeatures.quantumSecurity && '🔒 Security '}
                      {game.quantumFeatures.quantumAI && '🤖 AI '}
                      {game.quantumFeatures.quantumConsciousness && '🧠 Consciousness '}
                      {game.quantumFeatures.quantumAnalytics && '📊 Analytics '}
                      {game.quantumFeatures.quantumSacred && '🜂 Sacred'}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleTestQuantumTransaction(game.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Test Transaction
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
};

export default QuantumGamingDashboard; 