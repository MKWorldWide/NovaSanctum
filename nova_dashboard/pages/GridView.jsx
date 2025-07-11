/**
 * GridView.jsx - Real-time Map of Connected NovaTiny Agents
 * 
 * Divine digital infrastructure for edge AI sovereignty
 * Displays real-time emotional grid of all connected agents
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionPulseTile from '../components/EmotionPulseTile';
import WebSocketGridDaemon from '../lib/WebSocketGridDaemon';

const GridView = () => {
  const [agents, setAgents] = useState(new Map());
  const [gridLayout, setGridLayout] = useState('auto'); // 'auto', 'compact', 'spread'
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp'); // 'timestamp', 'emotion', 'device'
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    lastUpdate: null
  });

  // WebSocket connection for real-time data
  const [wsDaemon] = useState(() => new WebSocketGridDaemon());

  // Handle new emotion data
  const handleEmotionUpdate = useCallback((data) => {
    setAgents(prevAgents => {
      const newAgents = new Map(prevAgents);
      newAgents.set(data.deviceId, {
        ...data,
        lastSeen: new Date().toISOString()
      });
      return newAgents;
    });

    // Update connection stats
    setConnectionStats(prev => ({
      ...prev,
      totalAgents: agents.size + 1,
      activeAgents: Array.from(agents.values()).filter(agent => 
        new Date(agent.lastSeen) > new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
      ).length,
      lastUpdate: new Date().toISOString()
    }));
  }, [agents]);

  // Handle agent disconnection
  const handleAgentDisconnect = useCallback((deviceId) => {
    setAgents(prevAgents => {
      const newAgents = new Map(prevAgents);
      newAgents.delete(deviceId);
      return newAgents;
    });
  }, []);

  // WebSocket connection management
  useEffect(() => {
    wsDaemon.onConnect(() => {
      setIsConnected(true);
      console.log('🥀 Connected to NovaSanctum Grid');
    });

    wsDaemon.onDisconnect(() => {
      setIsConnected(false);
      console.log('🛑 Disconnected from NovaSanctum Grid');
    });

    wsDaemon.onEmotionUpdate(handleEmotionUpdate);
    wsDaemon.onAgentDisconnect(handleAgentDisconnect);

    // Connect to WebSocket
    wsDaemon.connect();

    return () => {
      wsDaemon.disconnect();
    };
  }, [wsDaemon, handleEmotionUpdate, handleAgentDisconnect]);

  // Filter and sort agents
  const filteredAndSortedAgents = Array.from(agents.values())
    .filter(agent => {
      if (filterEmotion === 'all') return true;
      return agent.emotion === filterEmotion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'emotion':
          return a.emotion.localeCompare(b.emotion);
        case 'device':
          return a.deviceId.localeCompare(b.deviceId);
        default:
          return 0;
      }
    });

  // Calculate grid layout
  const getGridLayout = () => {
    const count = filteredAndSortedAgents.length;
    
    switch (gridLayout) {
      case 'compact':
        return {
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        };
      case 'spread':
        return {
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        };
      default: // auto
        const cols = Math.ceil(Math.sqrt(count));
        return {
          gridTemplateColumns: `repeat(${Math.max(cols, 1)}, 1fr)`,
          gap: '1.5rem'
        };
    }
  };

  // Get emotion statistics
  const getEmotionStats = () => {
    const stats = {};
    filteredAndSortedAgents.forEach(agent => {
      stats[agent.emotion] = (stats[agent.emotion] || 0) + 1;
    });
    return stats;
  };

  const emotionStats = getEmotionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🥀 NovaSanctum Emotional Grid
              </h1>
              <p className="text-gray-300 mt-1">
                Real-time emotional pulse of connected agents
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-white text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {/* Stats */}
              <div className="text-white text-sm">
                {connectionStats.activeAgents} active / {connectionStats.totalAgents} total
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-6 mt-6">
            {/* Grid Layout */}
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Layout:</label>
              <select
                value={gridLayout}
                onChange={(e) => setGridLayout(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="auto">Auto</option>
                <option value="compact">Compact</option>
                <option value="spread">Spread</option>
              </select>
            </div>

            {/* Emotion Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Filter:</label>
              <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="all">All Emotions</option>
                <option value="calm">Calm</option>
                <option value="excited">Excited</option>
                <option value="stressed">Stressed</option>
                <option value="focused">Focused</option>
                <option value="relaxed">Relaxed</option>
                <option value="anxious">Anxious</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
              >
                <option value="timestamp">Time</option>
                <option value="emotion">Emotion</option>
                <option value="device">Device</option>
              </select>
            </div>
          </div>

          {/* Emotion Statistics */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-white text-sm">Emotion Distribution:</span>
            {Object.entries(emotionStats).map(([emotion, count]) => (
              <div key={emotion} className="flex items-center space-x-1">
                <span className="text-white text-sm">{emotion}:</span>
                <span className="bg-white/20 px-2 py-1 rounded text-white text-sm font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedAgents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥀</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Agents Connected
            </h2>
            <p className="text-gray-300">
              Waiting for NovaTiny agents to establish connection...
            </p>
          </div>
        ) : (
          <motion.div
            className="grid"
            style={getGridLayout()}
            layout
          >
            <AnimatePresence>
              {filteredAndSortedAgents.map((agent) => (
                <motion.div
                  key={agent.deviceId}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmotionPulseTile
                    deviceId={agent.deviceId}
                    emotion={agent.emotion}
                    emotionScore={agent.emotionScore}
                    confidence={agent.confidence}
                    timestamp={agent.timestamp}
                    isActive={new Date(agent.lastSeen) > new Date(Date.now() - 5 * 60 * 1000)}
                    onEmotionChange={handleEmotionUpdate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Connection Indicator */}
      <motion.div
        className="fixed bottom-6 right-6 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-white text-sm">
            {isConnected ? 'Grid Active' : 'Grid Inactive'}
          </span>
        </div>
      </motion.div>

      {/* Last Update Indicator */}
      {connectionStats.lastUpdate && (
        <motion.div
          className="fixed bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-white text-sm">
            Last: {new Date(connectionStats.lastUpdate).toLocaleTimeString()}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default GridView; 